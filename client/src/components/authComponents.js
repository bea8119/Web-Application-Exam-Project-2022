import {useState} from 'react';
import {Form, Button, Row} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import '../App.css';

function LoginForm(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = {username, password};
      props.login(credentials);
      navigate('/login');
  };

  return (
    
      <Form onSubmit={handleSubmit}>
          <Row xs={4} className="loginform">
              <Form.Group controlId="username">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" value={username} 
                      onChange={ev => setUsername(ev.target.value)} required={true}/>
              </Form.Group>
          </Row>

          <Row xs={4} className="loginform">
              <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={password} 
                      onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
              </Form.Group>
          </Row>
          <br/>
          <Button type="submit" variant="primary">Login</Button>
          &nbsp;&nbsp;
          <Button variant="danger" onClick={() => {navigate('/')}}>Back</Button>
      </Form>
  )
};

function LogoutButton(props) {
  const navigate = useNavigate();
  return (
    <Button bg="success" variant="outline-light" disabled={!props.user ? true : false} 
      onClick={() => {props.logout();  navigate('/')} }>Logout</Button>
  )
}

export {LoginForm, LogoutButton};