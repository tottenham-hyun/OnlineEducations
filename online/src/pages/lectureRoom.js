import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import { useEffect, useState } from 'react';
import {Form, Button, Card, Container, Row, Col} from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router-dom';

function LectureRoom(){
    let navigate = useNavigate()
    let [lec,setLecs] = useState([])
    

    useEffect(()=>{
        axios.get('/lectureRoom').then((result)=>{
            console.log('가져옴')
            setLecs(result.data)
        })
    },[])
    return (
        <>
        <h1>강의실</h1>
        <Button variant="outline-success" onClick={()=>{
            navigate('/makeLecture')
        }}>강의생성</Button>

        <Container>
            <Row>
                {
                    lec.map((a,i)=>{
                        return (
                            <Cards clecs={lec} i={i}/>
                        )
                    })
                }
            </Row>
        </Container>
        </>
    )
}

function Cards({clecs,i}){
    let navigate = useNavigate()
    return (
            <Col>
                <Card style={{ width: '18rem', marginTop:'10px'}}>
                <Card.Body>
                    <Card.Title>{clecs[i].title}</Card.Title>
                    <Card.Text>{clecs[i].detail}</Card.Text>
                    <Card.Text>{clecs[i].teacher+" 선생님"}</Card.Text>
                    <Button data-id={clecs[i].maker} variant="primary" onClick={(e)=>{
                        var id = e.target.dataset.id
                        console.log(id)
                        navigate('/lectures/'+id)
                    }}>들어가기</Button>
                </Card.Body>
                </Card>
            </Col>
            )
}

export default LectureRoom