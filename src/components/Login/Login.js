import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/auth/auth.actions";
import PropTypes from 'prop-types';
import './Login.css';
import logo from '../../logo.png';
import { useNavigate, Navigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Login = (props) => {

  const [isLoaded, setIsLoaded] = useState(true);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const MySwal = withReactContent(Swal);

  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  let navigate = useNavigate();

  const handleLogin = async e => {
    
    e.preventDefault();
    setIsLoaded(false);

    if (username === '' || typeof username === 'undefined' || password === "" || typeof password === 'undefined') {
      
        MySwal.fire({
          title: <strong>Login</strong>,
          html: <i>El usuario / contraseña no puede estar vacío</i>,
          icon: 'error'
        });
        setIsLoaded(true);

    }else{

      dispatch(login(username, password))
        .then(() => {
          //props.history.push("/profile");
          navigate("/");
          window.location.reload();
        })
        .catch(() => {
          MySwal.fire({
            title: <strong>Login</strong>,
            html: <i>{message}</i>,
            icon: 'error'
          });
          setIsLoaded(true);
        });

    }

    
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace={true} />;
  }

  if (!isLoaded) {
    return (
      <div className="spinner-dsf"></div>
    );
  } else {

    return(
      <div className="login-wrapper">        
        <Form onSubmit={handleLogin} className="card-dsf">
          <br />
          <center><img src={logo} className="logo_login" alt="Logo" width="150" /></center>
          <br />
          <center><h2>Sales Meeting App</h2></center><br /><br />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" onChange={e => setUserName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="warning" type="submit">
              Entrar
            </Button>
          </div>
        </Form>
      </div>
    )  

  }

}

export default Login;