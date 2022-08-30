import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Table, Row, Alert , Button} from 'react-bootstrap';
import { Link} from 'react-router-dom';



    
function HistoryList(props) {
    const historyList = props.rounds.map(round => {
        return (
            <tr key={round.roundId}>
                <td>{round.category}</td>
                <td>{round.letter}</td>
                <td>{round.level}</td>
                <td>{round.score}</td>
                
            </tr>
        );
    }); 

    if(props.user.id){
        return(<>
            
            {props.msg && <Row>
                <Alert variant={props.msg.type} onClose={() => props.setMessage('')}
           dismissible>{props.msg.msg}</Alert>  
           </Row> }
                
                <Row>
                    <h1>Your previous rounds:</h1>
                </Row>
                <br/>
                <Table hover>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Letter</th>
                        <th>Level</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    { historyList  }
                </tbody>
            </Table>

                
                <Link to={'/'}>
                    <Button variant="danger">Back</Button>
                </Link>
            
        </>);
        } else{
            return(<>
                <Container>
                    
                    <Row>
                        <h1>Login to see your previous rounds</h1>
                    </Row>
                    <br/>
                     <Link to={'/login'}>
                            <Button variant="primary">
                                Go to Login
                            </Button>
                        </Link> &nbsp;&nbsp;&nbsp;
                    <Link to={'/'}>
                        <Button variant="danger">Back</Button>
                    </Link>
                   
                </Container>
            </>);
        }
        
}


export { HistoryList };