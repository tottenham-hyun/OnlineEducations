import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import {Nav, Navbar, Container,Button} from 'react-bootstrap';
import {Route, Routes,useNavigate} from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/signup'
import LectureRoom from './pages/lectureRoom';
import { useState } from 'react';
import Mypage from './pages/mypage';
import Modify from './pages/modify';
import Lectures from './pages/lectures';
import MakeLecture from './pages/makeLectures';
import axios from 'axios';

function App() {
  let navigate = useNavigate();
  let [user,setUser] = useState();
  var id;
 
  return (
    <div className="App">
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>Online Study</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={()=>navigate('/')}>Home</Nav.Link>
            <Nav.Link onClick={()=>navigate('/lectureRoom')}>강의실</Nav.Link>
            <Nav.Link onClick={()=>{
              axios.get('/mypage').then((result)=>{
                setUser(result.data.userData)
                id = result.data.user._id
                navigate('/mypage/'+id)
              }).catch((error)=>{
                alert("로그인 해주세요")
                navigate('/login')
              })
            }}>내 정보</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

        <Routes>
          <Route path="/" element={
            <>
            <div className="main-bg"></div>
            <div className='bg2'>
            <div style={{paddingTop:'140px'}}>
              <h1>나만의 온라인 강의를 만나보아요</h1>
                <div className='buttons' style={{marginTop:'50px'}}>
                  <Button variant="outline-success" onClick={()=>navigate('/login')}>로그인</Button>
                  <Button variant="outline-success" onClick={()=>navigate('/signup')} style={{marginLeft: '40px'}}>회원가입</Button>
                </div>
            </div>
            </div>
            </>
          }/>

          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/lectureRoom' element={<LectureRoom />}/>
          <Route path='/mypage/:id' element={<Mypage user={user}/>}/>
          <Route path='/modify/:id' element={<Modify user={user}/>}/>
          <Route path='/lectures/:id' element={<Lectures/>}/>
          <Route path='/makeLecture' element={<MakeLecture/>}/>
          
          <Route path="*" element={<div>그런거 없수다</div>}/>
        </Routes>
      
    </div>
  );
}

export default App;
