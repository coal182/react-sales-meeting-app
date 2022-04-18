import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import {Form, Row, Col, Button, FloatingLabel} from 'react-bootstrap';
import CalendarEventService from "../../services/calendarEvent.service";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CalendarEvent = () => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState([]);
  const [description, setDescription] = useState([]);
  const [lastCoordinate, setLastCoordinate] = useState([]);
  const { id, partner_id } = useParams();

  const MySwal = withReactContent(Swal);

  const { user: currentUser } = useSelector((state) => state.auth);

  let api_url = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
  
    setIsLoaded(false);  

    CalendarEventService.getCalendarEvent(id, partner_id, currentUser).then(axios.spread((calendarEventData, lastCoordinateData) => {

      setIsLoaded(true)
      setCalendarEvent(calendarEventData.data.result)        
      setDescription(calendarEventData.data.result.description)        
      setLastCoordinate(lastCoordinateData.data.result)


    })).catch(error => setIsLoaded(true));
 
  }, [id]);

  const onClickHandler = (origen) => {

    if(!description){

      MySwal.fire({title: <strong>Evento</strong>,html: <i>La descripción / resultado de la visita es necesaria</i>, icon: 'error'})

    }else{

      setIsLoaded(false);

      const coordinate = { 
                            user_id: currentUser.user_id,
                            user: currentUser.code,
                            lat: lastCoordinate.lat,
                            lng: lastCoordinate.lng,
                            partner_id: parseInt(partner_id),
                            origen : origen,
                            event_id : calendarEvent.id,
                            event_result : description
                          };

      CalendarEventService.setCoordinate(coordinate).then(response => {
            
        setLastCoordinate(response.data.result);
        setIsLoaded(true);

      }).catch(error => setIsLoaded(true));
    
    }
    
  };

  if (!isLoaded) {
    return (
      <div className="spinner-dsf"></div>
    );
  } else {
      //console.log(pedido)

      let button;

      if(lastCoordinate.origen === 'S'){
        button = <Button variant="success" size="lg" type="button" onClick={() => {onClickHandler('E')}}><FontAwesomeIcon icon={faCheck}  color="white" /> Comienzo Visita</Button>;
      }else{
        button = <Button variant="danger" size="lg" type="button" onClick={() => {onClickHandler('S')}}><FontAwesomeIcon icon={faCheck}  color="white" /> Finalizar Visita</Button>;
      }

    return (
      <div id="container" className="App container-fluid">
        
        <div className="row cabecera">			
        
          <div className="col-3">
              <Link to="/" className="btn btn-link btn-lg"><FontAwesomeIcon icon={faArrowLeft}  color="#303030" /></Link>
          </div>
          <div className="col-9"><h4>Evento de Calendario {calendarEvent.name}</h4></div>

        </div>

        <div className="row cuerpo">

          <div className="col">
              <div className="row">
                  <div className="col">
                      <div className="card-dsf">
                          <center><h5>Datos del evento</h5></center><br />
                          <table className="table table-sm">
                              
                              <tbody>
                              <tr>
                                  <th>Fecha Inicio:</th>
                                  <td colSpan="2">{calendarEvent.start_date}</td>                                    
                              </tr>
                              <tr>
                                  <th>Nombre:</th>
                                  <td colSpan="2">{calendarEvent.name}</td>                                    
                              </tr>                         
                              <tr>
                                  <th>Descripción:</th>
                                  <td colSpan="2">{calendarEvent.description}</td>
                              </tr>
                              <tr>
                                  <th>Cliente :</th>
                                  <td colSpan="2">{calendarEvent.customer}</td>                                    
                              </tr>
                    
                              </tbody>
                          </table>

                          <br />
                          <Row>
                            <Col>
    
                            <FloatingLabel controlId="floatingTextarea2" label="Resultado Visita">
                              <Form.Control as="textarea" placeholder="Descripcion Evento" style={{ height: '100px' }} value={description ? description : ''} onChange={e => setDescription(e.target.value)} />
                            </FloatingLabel>
                    
                            </Col>
                          </Row>

                      </div>
                  </div>
              </div>
              <Row>
                  <Col>
                            <br />                      
                    {button}
                                    
                  </Col>                  
              </Row>
                        
          </div>
          
        </div>
            
      </div>
    )
  }    

  

}

export default CalendarEvent;


