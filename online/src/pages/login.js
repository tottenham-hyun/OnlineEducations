import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function Login(){
    let navigate = useNavigate();
    let [login,setLogin] = useState({
        email:'',
        pwd:''
    })
    const handleChange = (e)=>{
        setLogin({...login,[e.target.name]:e.target.value})
    }
    return (
        <>
        <div className='signupContainer'>
            <h1>로그인</h1>
            <Form className='loginBox'>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>이메일</Form.Label>
                <Form.Control type="email" placeholder="이메일 입력" name='email' value={login.email} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>비밀번호</Form.Label>
                <Form.Control type="password" placeholder="비밀번호" name='pwd' value={login.pwd} onChange={handleChange}/>
            </Form.Group>
            </Form>

            <Button variant="outline-success" onClick={()=>{
                axios.post('/login',login).then((result)=>{
                    if(result.data=='로그인성공'){
                        alert('환영합니다')
                        navigate('/')
                    }
                })
            }}>로그인</Button>
            <Button variant="outline-success" onClick={()=>navigate('/signup')} style={{marginLeft: '40px'}}>회원가입</Button>
        </div>
        </>
    )
}

export default Login
