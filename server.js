var express = require('express')
var path = require('path')
var app = express()
const bodyParser = require('body-parser')
let multer = require('multer')
let fileDate =  new Date().valueOf()
require('dotenv').config()

var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, './public/videos')
    },
    filename : function(req,file,cb){
        fileDate++
        let new_fileName = fileDate + path.extname(file.originalname)
        console.log(new_fileName)
        cb(null, new_fileName)
    }
})
var upload = multer({storage:storage})

const {ObjectId} = require('mongodb')
const http = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(http)

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const webrtc = require('@koush/wrtc')



app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/online/build'))
app.use(express.json())
app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(session({secret:'비밀코드', resave:true, saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())

var cors= require('cors')
const { ReplSet } = require('mongodb/lib/core')
const { sensitiveHeaders } = require('http2')
app.use(cors())


const MongoClient = require('mongodb').MongoClient
const url = process.env.DB_URL
var db;


MongoClient.connect(url,{useUnifiedTopology:true},function(error,client){
    if(error) return console.log('error')
    db = client.db('LECTURES')

    app.get('/', function(req,res){
        res.sendFile(__dirname,'/index.html')
    })

    app.post('/signup', function(req,res){
        const r = req.body
        console.log(req.body)

        db.collection('user_counter').findOne({name:'유저수'},function(error,result){
            var totalUser = result.totalUser

            db.collection('user').insertOne({_id: totalUser+1, name:r.names,
                birthday:r.birthday, gender:r.gender,telephone: r.telnum}, function(error,result){
                    console.log('유저저장완료')
            })
            
            db.collection('user_info').insertOne({_id:totalUser+1,email:r.email, pwd:r.pwd}, function(error,result){
                    console.log('아디비번저장완료')
            })

            db.collection('user_counter').updateOne({name:'유저수'},{$inc:{totalUser:1}},function(error,result){
                if(error) return console.log(error)
                res.send('전송완료')
            })
        })
    }) // 회원가입
    
    app.post('/modify',function(req,res){
        const r = req.body
        console.log(r)

        db.collection('user').updateOne({_id: r.id}, {$set: {name:r.names,
            birthday:r.birthday, gender:r.gender,telephone: r.telnum}, function(error,result){
                console.log('유저수정완료')
        }})

        db.collection('user_info').updateOne({_id: r.id}, {$set: {email:r.email, pwd:r.pwd}, function(error,result){
                console.log('유저수정완료')
        }})
    }) //회원정보수정
    
    
    app.post('/makeLecture',upload.single('vids'),function(req,res,next){
        const r = JSON.parse(req.body.infos)
        timest = r.timestamp
        db.collection('lecture_counter').findOne({name:'강의수'}, function(error,result){
            var totalLecture = result.totalLecture

            db.collection('lecture').insertOne({_id: totalLecture, title: r.title, teacher: r.teacher,
                detail: r.detail, maker:parseInt(totalLecture), timeStamp: fileDate+1},function(error,result){
                    db.collection('lecture_counter').updateOne({name:'강의수'},{$inc:{totalLecture:1}},function(error,result){
                        if(error) return console.log(error)
                        res.send('전송완료')

                    })
                })
        }) 
    }) // 강의생성

    app.get('/lectureRoom', function(req,res){
        db.collection('lecture').find().toArray(function(error,result){
            console.log(result)
            res.send(result)
        })
    })

    app.post('/login',passport.authenticate('local',{
        failureRedirect:'/fail'
    }), function(req,res){
        res.send('로그인성공')
    })

    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'pwd',
        session : true,
        passReqToCallback: false,
    }, function(input_id, input_pwd, done){
        db.collection('user_info').findOne({email:input_id}, function(error,result){
            if(error) return done(error)
            if(!result) return done(null, false, {message: '존재하지 않은 아이디입니다'})
            if(input_pwd == result.pwd){
                return done(null,result)
            }else{
                return done(null,false,{message:'틀린 비밀번호입니다'})
            }
        })
    }))

    passport.serializeUser(function(user,done){
        done(null,user.email)
    })
    passport.deserializeUser(function(id,done){
        db.collection('user_info').findOne({email:id},function(error,result){
            done(null,result)
        })
    })

    app.get('/mypage', logined, function(req,res){
        db.collection('user').findOne({_id:req.user._id}, function(error,result){
           var userData = result
           console.log(userData)
           res.send({user:req.user,userData:userData})
        })
    })

    app.get('/logout',function(req,res){
        req.logOut(()=>{
            res.redirect('/')
        })
    })

    app.get('/lectures', function(req,res){
        db.collection('lecture').find().toArray(function(error,result){
            console.log('lectures:'+result)
            res.send(result)
        })
    })
    io.on('connection',function(socket){
        let prev_room = ''
        let lecture_room = ''

        socket.on('joinroom', function(data){
            lecture_room = 'room'+data // 지금 방
            console.log('방번호:'+lecture_room)

            if(prev_room != lecture_room){
                console.log('1. 이전 방번호:'+ prev_room)
                socket.leave(prev_room)
                socket.join(lecture_room) //지금 방입장
                console.log('방입장:'+lecture_room)
            }
           /* else{
                console.log('2. 이전 방번호:'+ prev_room)
                socket.join(lecture_room) //지금 방입장
            } */
            prev_room = lecture_room
            
        })
        
        socket.on('user-send', function(data){
            console.log(data) // 유저->서버
            io.to(lecture_room).emit('broadcast',data) // 서버-> 다 뿌리기
        })
    })
    
  /*  let senderStream

    app.post("/consumer", async ({ body }, res) => {
        const peer = new webrtc.RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });
        const desc = new webrtc.RTCSessionDescription(body.sdp);
        await peer.setRemoteDescription(desc);
        console.log(senderStream)
        senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload = {
            sdp: peer.localDescription
        }
    
        res.json(payload);
    });

    app.post('/broadcast', async ({ body }, res) => {
        const peer = new webrtc.RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });
        peer.ontrack = (e) => handleTrackEvent(e, peer);
        const desc = new webrtc.RTCSessionDescription(body.sdp);
        await peer.setRemoteDescription(desc);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload = {
            sdp: peer.localDescription
        }
    
        res.json(payload);
    });
    
    /* app.get('/list', function(req,res){
        db.collection('post').find().toArray(function(error,result){
            console.log(reuslt)
            res.render('list.ejs',{posts: result})
        })
    }) list에서 get요청 받으면 post에서 내용 array형으로 전부 다 꺼내서 posts라는 이름으로 보내주기*/

    /* db.collection('counter').updateOne({요런 이름의 자료를},{이렇게 수정해주세요},function(error,result){
        console.log('수정완료')
    })  {$set: {totalPost:100}}: 값을 100으로 변경
        {$inc: {totalPost:5}} : 5만큼 더해주기, $는 operator */

    http.listen(process.env.PORT,function(){
        console.log('listening on 3000')
    })

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname,'/online/build/index.html'))
      });
})

function logined(req,res,next){
    if(req.user){
        next()
    }
    else{
        res.send('로그인안했음')
    }
}
function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};


