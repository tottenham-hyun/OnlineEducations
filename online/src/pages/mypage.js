import axios from 'axios';
import { useState } from 'react';
import {Nav, Navbar, Container,Row,Col} from 'react-bootstrap';
import { useParams,useNavigate } from "react-router-dom";

function Mypage(props){
    let navigate = useNavigate()
    
    return (
        <>
        <div className="mypage">
            <h1 style={{marginTop:'20px'}}>마이페이지</h1>
            <div style={{textAlign:'left'}}>
                <i class="fa-regular fa-user fa-3x" style={{marginBottom:"10px", marginLeft:'60px', marginTop:'15px'}}></i>
                <h1 style={{display:'inline-block', marginLeft:'30px', marginBottom:'15px'}}>{props.user.name}</h1>
            </div>
            <Navbar bg="light" variant="light">
                <Container>
                <Navbar.Brand>보기</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={()=>navigate('/modify/'+props.user._id)}>편집</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
            <Container>
                <Row>
                    <Col><img src={process.env.PUBLIC_URL+ '/son.jpg'} style={{display:'block', marginLeft:'0px', marginTop:'20px', 
                width:'300px', height:'300px', borderRadius:'50px'}}></img></Col>
                    <Col>
                        <div style={{marginTop:'55px'}}> 
                        <h3 style={{display:'block', textAlign:'left',marginTop:'30px'}}>이름 : {props.user.name}</h3>
                        <h3 style={{display:'block', textAlign:'left',marginTop:'30px'}}>전화번호 : {props.user.telephone.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3")}</h3>
                        <h3 style={{display:'block', textAlign:'left',marginTop:'30px'}}>성별 : {props.user.gender}</h3>
                        <h3 style={{display:'block', textAlign:'left',marginTop:'30px'}}>생년월일 : {props.user.birthday}</h3>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
        </>
    )
}

export default Mypage
