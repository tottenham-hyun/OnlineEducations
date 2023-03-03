import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import {Nav, Navbar, Container,Button,Form} from 'react-bootstrap';
import {useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
import  {useState} from 'react'

function Modify(props){
    let navigate = useNavigate()
    let {id} = useParams();  
    
    let [info,setInfo] = useState({
        id: props.user.id,
        email:'',
        pwd:'',
        names:'',
        birthday:'',
        telnum:'',
        gender:'남성'
    })
    const handleChange = (e)=>{
        setInfo({...info,[e.target.name]:e.target.value})
    }
    return (
        <>
        <div className='signupContainer'>
            <h1>회원정보 수정</h1>

            <Form className='loginBox'>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>이메일</Form.Label>
                <Form.Control type="email" placeholder="이메일 입력" name='email' value={info.email} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>비밀번호</Form.Label>
                <Form.Control type="password" placeholder="비밀번호" name='pwd' value={info.pwd} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>비밀번호 재확인</Form.Label>
                <Form.Control type="password" placeholder="비밀번호 재확인" />
            </Form.Group> 

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>이름</Form.Label>
                <Form.Control type="text" placeholder="이름" name='names' value={info.names} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>생년월일</Form.Label>
                <Form.Control type="date" placeholder="생년월일" name='birthday' value={info.birthday} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>전화번호</Form.Label>
                <Form.Control type="text" placeholder="전화번호" name='telnum' value={info.telnum} onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label style={{fontSize:'20px', fontWeight:'bold'}}>성별</Form.Label>
                <Form.Select name='gender' onChange={handleChange}>
                    <option value='남성' selected>남성</option>
                    <option value='여성'>여성</option>
                </Form.Select>
            </Form.Group>

            <Button variant="outline-success" onClick={()=>{
                axios.post('/modify',info).then((result)=>{
                    console.log('성공이에요')
                    alert("수정완료!")
                    navigate('/mypage/'+id)
                    
                })
                .catch(()=>{
                    console.log('실패함')
                })
            }}>수정하기</Button>
        </Form>
        </div>
        </>
    )
}

export default Modify