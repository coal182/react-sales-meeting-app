import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Form, Row, Col, ListGroup, FloatingLabel, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CustomerService from "../../services/customer.service";

const CreateForm = () => {

  const [isLoaded, setIsLoaded] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState('');
  const [filterName, setFilterName] = useState('');
  const MySwal = withReactContent(Swal)
  const { customer_id } = useParams();

  const { user: currentUser } = useSelector((state) => state.auth); 

  const inputBuscador = useRef(null);

    let navigate = useNavigate();

    useEffect(() => {
      if (inputBuscador.current) {
        inputBuscador.current.focus();
      }

      if(customer_id){
        
        CustomerService.getCustomer(currentUser.user_id, customer_id)
          .then(res => {

              setIsLoaded(true)
              setCustomer(res.data.result)
                    
          }).catch(error => {
              
              setIsLoaded(true)
          
              MySwal.fire({
                    title: <strong>Evento</strong>,
                    html: <i>Error al cargar el Cliente</i>,
                    icon: 'error'
              })
        
        });

      }

    }, []);

    const handleClick = (cus) => {

      if (cus === customer){

        setCustomer('');
        setCustomers([]);
        setFilterName('');
        if (inputBuscador.current) {
          inputBuscador.current.focus();
        }

      }else{
      
        setCustomer(cus);
        setFilterName(cus.ref);
        setCustomers([cus])

      }
      
    }

    const handleBuscar = () => {

      if (filterName !== ""){

        setIsLoaded(false)
        
        CustomerService.getCustomers(currentUser.user_id, filterName)
          .then(res => {
  
              setIsLoaded(true)
              setCustomers(res.data.result)
            
          },
          (error) => {
            setIsLoaded(true)
        });
  
      }else{
        setCustomers([]);
      }
      
    }

    const handleBuscarLimpiar = () => {
      
      setFilterName("");
      setCustomers([]);
      inputBuscador.current.focus();      
      
    }

    const handleCreateEvent = () => {   

      if (!customer){

        MySwal.fire({title: <strong>Evento</strong>,html: <i>El Cliente es obligatorio</i>, icon: 'error'})

      }else if(!name){

        MySwal.fire({title: <strong>Evento</strong>,html: <i>El Nombre es obligatorio</i>, icon: 'error'})

      }else if(!description){
        
        MySwal.fire({title: <strong>Evento</strong>,html: <i>La Descripción es obligatoria</i>, icon: 'error'})

      }else{
      
        setIsLoaded(false)
        
        const event = { 
          user_id: currentUser.user_id,
          partner_id: currentUser.partner_id[0],
          name: name,
          description: description,
          customer: parseInt(customer.id)
        };

        CalendarEventService.addCalendarEvent(event)
        .then(response => {
                  
          setIsLoaded(true);
          navigate("/calendar_event/"+response.data.result+"/"+customer.id);

        }).catch(error => {
          
          setIsLoaded(true)
          
          MySwal.fire({title: <strong>Evento</strong>,html: <i>Error al crear Evento</i>, icon: 'error'})
        
        });

      }
            
    }

    const customersList = customers.map((cus,i) => {
      return (
        
        <ListGroup.Item key={i} action onClick={() => handleClick(cus)} className={cus.id === customer.id  ? "entregado_ribbon" : ""}>
          <Row>
            <Col xs="12" sm="12">
            <div className="li_pedido">
              <Row>
                <Col xs="8" sm="8"><h5>{cus.name}</h5></Col>
                <Col xs="4" sm="4" className="text-end"><h6>{cus.ref}</h6></Col>
              </Row>  
              <Row>
                <Col xs="8" sm="8"><p>{cus.street}</p></Col>
                <Col xs="4" sm="4" className="text-end">{cus.vat}</Col>
              </Row>
              <Row>
                <Col xs="4" sm="4"><p>{cus.phone}</p></Col>
                <Col xs="8" sm="8" className="text-end">{cus.email}</Col>
              </Row>                                   
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
            <Row>
              <Col>Cliente Seleccionado: <br />{customer.name}<hr /></Col>
            </Row>
            <Row>
              <Col>
              <FloatingLabel controlId="floatingInput" label="Buscador de Clientes">
                  <Form.Control type="text" size="lg" placeholder="Buscador de Clientes" value={filterName} onChange={e => setFilterName(e.target.value)} ref={inputBuscador} />
              </FloatingLabel> 
              <br />
              <Row>
                <Col>
                <div className="d-grid gap-2">          
                  <Button variant="secondary" size="lg" onClick={handleBuscarLimpiar}>
                    Limpiar <FontAwesomeIcon icon={faTrash}  color="#ffffff" />
                  </Button>         
                </div>
                </Col>
                <Col>
                <div className="d-grid gap-2">
                  <Button variant="light" size="lg" onClick={handleBuscar}>
                    Buscar <FontAwesomeIcon icon={faSearch}  color="#303030" />
                  </Button>                      
                </div>
                </Col>
              </Row>
            
              </Col>
            </Row>
            <br />
            {customersList}
            <hr />
            <Row>
              <Col>
              <FloatingLabel controlId="floatingInput" label="Nombre Evento">
                  <Form.Control type="text" size="lg" placeholder="Nombre Evento" onChange={e => setName(e.target.value)} />
              </FloatingLabel>
              <br />
              <FloatingLabel controlId="floatingTextarea2" label="Descripción Evento">
                <Form.Control as="textarea" placeholder="Descripcion Evento" style={{ height: '100px' }} onChange={e => setDescription(e.target.value)} />
              </FloatingLabel>       
              </Col>
            </Row>
            <br />
            <Row>
            <div className="d-grid gap-2">
              <Button variant="light" size="lg" onClick={handleCreateEvent}>
                Crear Evento <FontAwesomeIcon icon={faPlus}  color="#303030" />
              </Button>         
            </div>
            </Row>
            <br />
            <br /> 
            <br /> 
            <br /> 
            <br /> 
            <br /> 
            <br /> 
            <br /> 
            <br /> 
            <br /> 
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

export default CreateForm;


