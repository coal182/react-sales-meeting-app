import './App.sass';
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate, Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faCalendarPlus, faRotate, faUserPlus, faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import {Form, Row, Col, ListGroup, Button, Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Dashboard from './components/Dashboard/Dashboard';
import CalendarEvent from './components/CalendarEvent/CalendarEvent';
import Customer from './components/CalendarEvent/CalendarEvent';
import Login from './components/Login/Login';
import CreateForm from './components/CreateForm/CreateForm';
import CreatePartnerForm from './components/CreatePartnerForm/CreatePartnerForm';
import { history } from "./helpers/history";
import { logout } from "./redux/auth/auth.actions";
import { clearMessage } from "./redux/message/message.actions";

const App = () => {

  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);
  useEffect(() => {
    if (currentUser) {
      //setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      //setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };  

  let rutas =   
                <div className="wrapper">

                      <Navbar bg="light" expand="lg" >
                                                    
                            {currentUser ? (
                              <Container>
                                <Navbar.Brand href="/">Sales Meeting App</Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                
                                <Navbar.Collapse id="basic-navbar-nav">
                                  <Nav className="me-auto">
                                    <Nav.Link as={Link} to="/"><FontAwesomeIcon icon={faHome}  color="#505050" /> Inicio</Nav.Link>
                                    <Nav.Link as={Link} to="/create"><FontAwesomeIcon icon={faCalendarPlus}  color="#505050" /> Crear Evento</Nav.Link>
                                    <Nav.Link as={Link} to="/createPartner"><FontAwesomeIcon icon={faUserPlus}  color="#505050" /> Crear Prospección</Nav.Link>                                                                        
                                  </Nav>

                                  <Nav>                                   
                                    <Navbar.Collapse className="justify-content-end">
                                      <NavDropdown title={currentUser.username} id="basic-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/profile"><FontAwesomeIcon icon={faUser}  color="#505050" /> Perfil</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/login" onClick={logOut}><FontAwesomeIcon icon={faPowerOff}  color="#505050" /> Cerrar sesión</NavDropdown.Item>
                                      </NavDropdown>
                                    </Navbar.Collapse>                              
                                  </Nav>
                                </Navbar.Collapse>
                              </Container>
                            ) : (
                              <Container>
                                <Navbar.Brand href="/">Sales Meeting App</Navbar.Brand>
                              </Container>
                            )}                         
                          
                        
                      </Navbar>

                    <div className="wrapper">
                            
                          {currentUser ? (
                            <Routes>
                              <Route exact path="/" element={<Dashboard />} />
                              <Route exact path="/list" element={<Dashboard />} />
                              <Route exact path="/login"  element={<Login />} />
                              <Route exact path="/logout" element={<Login logout="true" />} />                
                              <Route exact path="/calendar_event/:id/:partner_id" element={<CalendarEvent />} />
                              <Route path="/create/:customer_id" element={<CreateForm />} />
                              <Route path="/create" element={<CreateForm />} />
                              <Route exact path="/createPartner" element={<CreatePartnerForm />} />
                              <Route exact path="/customer" element={<Customer />} />
                              <Route path="*" element={<Navigate to="/" replace={true} />} />
                            </Routes>
                          ) : (
                            <Routes>
                              <Route exact path="/"  element={<Login />} />
                              <Route exact path="/login"  element={<Login />} />
                              <Route path="*" element={<Navigate to="/login" replace={true} />} />
                            </Routes>
                          )}                          

                      </div>

                      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
  
                </div>

  //console.log(token);

  return rutas;

}

export default App;