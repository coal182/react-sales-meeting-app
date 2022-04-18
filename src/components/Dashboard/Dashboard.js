import React, { useState, useEffect, useCallback  } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faCalendarPlus, faRotate, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import {Form, Row, Col, ListGroup, Button} from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CalendarEventService from "../../services/calendarEvent.service";

let api_url = process.env.REACT_APP_API_URL;

const Dashboard = () => {

  const { user: currentUser } = useSelector((state) => state.auth);  
  const [isLoaded, setIsLoaded] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [filteredCalendarEvents, setFilteredCalendarEvents] = useState([]);
  const [filtroCalendarEvent, setFiltroCalendarEvent] = useState('');
  const MySwal = withReactContent(Swal) 
  
  //console.log(currentUser)

  const cargar = useCallback(() => {

    setIsLoaded(false)

    CalendarEventService.getCalendarEvents(currentUser).then(res => {

        setIsLoaded(true)
        setCalendarEvents(res.data.result)
        setFilteredCalendarEvents(res.data.result) 

    }).catch(error => {

        if (error.response.data.msg == 'Token has expired') {
          
        }else{

          setIsLoaded(true)

          MySwal.fire({
                title: <strong>Evento</strong>,
                html: <i>Error al cargar los Eventos: {error.response.data.msg}</i>,
                icon: 'error'
          })

        }          
    
    });

    filterList();

  }, [])

  useEffect(() => {
    
    cargar();

  }, [cargar]);

  useEffect(() => {
    filterList();
  }, [filtroCalendarEvent]);

  useEffect(() => {
    filterList();
  }, [calendarEvents]);  

  function filterList() {

    var peds = calendarEvents.filter(function(ped) {

      return  (
                  (
                    (String(ped.id).indexOf(filtroCalendarEvent) !== -1 || filtroCalendarEvent==='') 
                    || 
                    (ped.name.toLowerCase().indexOf(filtroCalendarEvent.toLowerCase()) !== -1 )
                    || 
                    (ped.customer[1].toLowerCase().indexOf(filtroCalendarEvent.toLowerCase()) !== -1 )
                    || 
                    filtroCalendarEvent===''
                  )                  
      ); // returns true or false
    });
    setFilteredCalendarEvents(peds);
  }

    let navigate = useNavigate();

    const handleClick = (id, partner_id) => {
      console.log(id);
      navigate("/calendar_event/"+id+"/"+partner_id);
    }

    const calendarEventsList = filteredCalendarEvents.map((p,i) => {
      return (
        
        <ListGroup.Item key={i} action onClick={() => handleClick(p.id, p.customer[0])}>
          <Row>
            <Col xs="12" sm="12">
            <div className="li_pedido">
              <Row>
                <Col xs="9" sm="9"><h2>{p.name}</h2></Col>
                <Col xs="3" sm="3" className="text-end">{p.id}</Col>
              </Row>     
              <div> {p.customer[1]}</div>
              <span className="direccion_listado">{p.start_date}</span>   
              <br />          
              <span className="direccion_listado">{p.description}</span>             
              <br />                        
              
            </div>
            </Col>              
          </Row>
        </ListGroup.Item>      
        
      );
    });    

    if (!isLoaded) {
      return (
        <div className="spinner-dsf"></div>
      );
    } else {
      return (
        <div id="container" className="App container-fluid">
          
          <div className="row cuerpo">
            <div className="col-md-12">  
            <Button variant="link" size="lg" type="button" onClick={() => cargar()}><FontAwesomeIcon icon={faRotate}  color="#303030" /></Button>
            <Row>
              <Col>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control type="text" size="lg" placeholder="Buscar" onChange={e => setFiltroCalendarEvent(e.target.value)} />
              </Form.Group>
              </Col>
            </Row>
            <br />


            <ListGroup defaultActiveKey="#link1">
              {calendarEventsList}
            </ListGroup>
            <br /> 
            <br /> 
            <br /> 
            <br /> 
            <br /> 
            </div>
          </div>
          
              
        </div>
      )
    }    

  

}

export default Dashboard;


