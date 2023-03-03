import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import {Nav, Navbar, Container,Button,Form} from 'react-bootstrap';
import {json, useNavigate} from 'react-router-dom';
import {useState} from 'react'
import axios from 'axios';

function MakeLecture(){
    let navigate = useNavigate();
    let [info,setInfo] = useState({
        id: 0,
        title:'',
        teacher:'',
        detail:'',
        timestamp: new Date().valueOf()
    })
    let formData = new FormData()

    const handleChange = (e)=>{
        setInfo({...info,[e.target.name]:e.target.value})
    }
    const handleFileChange = (e) =>{
        formData.append('vids',e.target.files[0])
    }
    const SubmitData = () => {
        console.log(info)
        formData.append('infos',JSON.stringify(info))
        console.log(...formData)
        axios.post('/makeLecture',formData,{
            headers: {"Content-Type": "multipart/form-data"}}
        ).then((result)=>{
            alert("생성완료!!")
            navigate('/lectureRoom')
        })
        
    }

    return (
        <>
        <div className='signupContainer'>
            <h1>강의생성</h1>
            <Form className='loginBox'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>강의명</Form.Label>
                    <Form.Control type="text" placeholder="강의명 입력" name='title' value={info.title} onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>선생님</Form.Label>
                    <Form.Control type="text" placeholder="선생님" name='teacher' value={info.teacher} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>강의설명</Form.Label>
                    <Form.Control type="text" placeholder="강의설명" name='detail' value={info.detail} onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>업로드</Form.Label>
                    <input type="file" placeholder="upload" name='upload' accept='video/*' onChange={handleFileChange}/>
                </Form.Group>

                <Button variant="outline-success" onClick={SubmitData}>생성하기</Button>
                
        </Form>
        </div>
        </>
    )
}
export default MakeLecture