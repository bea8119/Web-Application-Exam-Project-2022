import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './authComponents';

function NavBar(props) {
    return (
        <Navbar className="mynav" variant="dark" fixed="top">
            <Container fluid>
                <Navbar.Brand align="center">
                    <i className="bi bi-flower1" />
                    &nbsp;&nbsp; Categories (AKA Fiori Frutta)
                </Navbar.Brand>
                <div>
                    <LogoutButton user={props.user} logout={props.logout}/>
                    &nbsp;&nbsp;&nbsp;
                    <Link to={'/login'}>
                        <Button bg="success" variant="outline-light">
                            <i className="bi bi-person-fill" />
                        </Button>
                    </Link>
                </div>
            </Container>
        </Navbar>
    );
}

export { NavBar };