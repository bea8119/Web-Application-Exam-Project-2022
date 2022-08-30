import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Table, Row, Alert , Button} from 'react-bootstrap';
import { Link} from 'react-router-dom';



    
function TopPlayerList(props) {
    const topElements = props.topPlayers.map(category => {
        return (
            <tr key={category.category}>
                <td>{category.category}</td>
                <td>{category.username}</td>
                <td>{category.score}</td>
            </tr>
        );
    }); 
    return (
        <>
            {props.msg && <Row>
                <Alert variant={props.msg.type} onClose={() => props.setMessage('')}
           dismissible>{props.msg.msg}</Alert>  
           </Row> }
            <h1>Top Players per category:</h1>
            <Table hover>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>User name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    { topElements  }
                </tbody>
            </Table>

            <Link to={'/'}>
                <Button variant="danger">Back</Button>
            </Link>
        </>
    );
}


export { TopPlayerList };