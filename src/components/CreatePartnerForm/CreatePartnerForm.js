import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faSearch, faPlus, faHome, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Form, Row, Col, ListGroup, FloatingLabel, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CustomerService from "../../services/customer.service";

const CreatePartnerForm = () => {

  const [isLoaded, setIsLoaded] = useState(true);
  const [name, setName] = useState('');
  const MySwal = withReactContent(Swal);

  const { user: currentUser } = useSelector((state) => state.auth); 

  let navigate = useNavigate();

  const handleCreatePartner = () => {   

    if(!name){

      MySwal.fire({title: <strong>Evento</strong>,html: <i>El Nombre es obligatorio</i>, icon: 'error'})

    }else{
    
      setIsLoaded(false)
      
      const new_customer = { 
        user_id: currentUser.user_id,
        name: name
      };

      CustomerService.addCustomer(new_customer)
      .then(response => {
                
        setIsLoaded(true);
        navigate("/create/"+response.data.result);

      }).catch(error => {
        
        setIsLoaded(true)
        
        MySwal.fire({title: <strong>Evento</strong>,html: <i>Error al crear Evento</i>, icon: 'error'})
      
      });

    }
          
  }

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
            <Col>
            <FloatingLabel controlId="floatingInput" label="Nombre Prospección">
                <Form.Control type="text" size="lg" placeholder="Nombre Prospección" onChange={e => setName(e.target.value)} />
            </FloatingLabel>                       
            </Col>
          </Row>
          <br />
          <Row>
          <div className="d-grid gap-2">
            <Button variant="light" size="lg" onClick={handleCreatePartner}>
              Crear Prospección <FontAwesomeIcon icon={faPlus}  color="#303030" />
            </Button>         
          </div>
          </Row>
          <br />
          <br /> 
          <br /> 
          </div>
        </div>

      </div>
    )

  }    

  

}

export default CreatePartnerForm;


