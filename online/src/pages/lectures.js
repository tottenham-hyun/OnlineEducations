import {Nav, Navbar, Container,Row,Col} from 'react-bootstrap';
import { useParams,useNavigate } from "react-router-dom";
import {Button,Form,InputGroup} from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

const socket = io()

function Lectures(){
    let [msg,setMsg] = useState()
    let [datas,setData] = useState([])
    let [lec,setLec] = useState([])
    let {id} = useParams()
    let videoName = ''
    
    useEffect(()=>{
        axios.get('/lectures').then((result)=>{
            setLec(result.data)
        })
        socket.emit('joinroom',id)
    },[])

    useEffect(()=>{
        socket.on('broadcast',function(data){
            setData([...datas,data])
        })
    })
    lec.map((a,i)=>{
        if(lec[i]._id == id){
            videoName = 'http://localhost:3000/videos/'+lec[i].timeStamp+'.mp4'
        }
        return 
    })

    return (
        <>
        <h1>강의</h1>

        <div style={{position:"relative", height:'0', paddingBottom:'30%', marginBottom:'10px'}}>
            <iframe src={videoName} controls type='video/mp4'
            style={{position:'absolute', left:'0', top:'0', width:'100%', height:'100%'}}>
            </iframe>
        </div>

        <div className='chat_container'>
            {
                datas.map((a,i)=>{
                    return(
                        <Chat datas={datas[i]}/>
                    )
                })
            }
        </div>

        <InputGroup className="mb-3">
            <Form.Control placeholder="채팅치세요" onChange={(e)=>{
                setMsg(e.target.value)
            }}/>
            <Button variant="outline-secondary" id="button-addon2" onClick={()=>{
                socket.emit('user-send',msg) 
            }}>전송</Button>
        </InputGroup>

       
        </>
    )
}

function Chat({datas}){
    return (
        <div>
            <h3>{datas}</h3>
        </div>
    )
}




export default Lectures
