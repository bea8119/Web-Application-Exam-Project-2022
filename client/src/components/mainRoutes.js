import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Alert, Table, Button } from 'react-bootstrap';
//import { useParams, Link, useNavigate } from 'react-router-dom';
import { NavBar } from './navbar'
import { Link} from 'react-router-dom';
import { LoginForm } from './authComponents';
import { SideBar} from './sidebar';
import { TopPlayerList } from './topPlayerList';
import { HistoryList } from './historyList';
import { Play, PlayRound } from './playFunctions';
import { useEffect, useState } from 'react';

function MainRoute(props) {
    useEffect(() => {
        props.setOption(props.option);
    });

    return (
        <>
            <Row>
                <NavBar user={props.user} logout={props.logout} />
            </Row>
            <Row className="after_navbar">
                <Container fluid>
                    <Row>
                        <Col xs={2}>
                            <SideBar user={props.user} option={props.option} setOption={props.setOption} />
                        </Col>
                        <Col>
                            <ManageContentOption option={props.option} user={props.user} topPlayers={props.topPlayers} rounds={props.History} startGame={props.startGame}
                                msg={props.msg} setMessage={props.setMessage} />
                        </Col>
                    </Row>
                </Container>
            </Row>
        </>
    );
}

function ManageContentOption(props) {

    if (props.option === 'TopPlayers') {
        return (
            <TopPlayerList topPlayers={props.topPlayers} msg={props.msg}
                setMessage={props.setMessage} />
        );
    } else if (props.option === 'Play') {
        return (
            <Play option={props.option} user={props.user} msg={props.msg} setMessage={props.setMessage} startGame={props.startGame} />
        );
    } else if (props.option === 'History') {
        return (
            <HistoryList option={props.option} user={props.user} rounds={props.rounds}
                msg={props.msg} setMessage={props.setMessage} />
        );
    }

}




function LoginRoute(props) {
    return (
        <>
            <Row>
                <NavBar user={props.user} logout={props.logout} />
            </Row>
            <Row className="after_navbar">
                <Row>
                    {props.msg && <Row>
                        <Alert variant={props.msg.type} onClose={() => props.setMessage('')} dismissible>{props.msg.msg}</Alert>
                    </Row>}
                    <Col>
                        <h1>Login</h1>
                    </Col>
                </Row>
                <Row>
                    <LoginForm login={props.login} />
                </Row>
            </Row>
        </>
    );
}

function RoundRoute(props) {
     
    const [finish, setFinish] = useState(false);
    const [words, setWords] = useState([]);
      
    return (
        <>
            <Row>
                <NavBar user={props.user} logout={props.logout} />
            </Row>
            <Row className="after_navbar">
                <Container fluid>
                    <Row>
                        
                            <PlayRound words={words} setWords={setWords} finish={finish} setFinish={setFinish} calculateScore= {props.calculateScore} category={props.category} level={props.level} letter={props.letter} user={props.user} />
                               
                    </Row>
                </Container>
                </Row>
        </>
    );
}


function ScoreRoute(props) {
    const sad= (props.score===0 ? "ROUND FAILED... You did not insert enough valid words" :  `Your total score is: ${props.score}` );


    const wordsScores = props.wordScore.map(ws => {
        return (
            <tr key={ws.word}>
                <td>{ws.word}</td>
                <td>{ws.score*parseInt(props.level)}</td>
            </tr>
        );
    });
   

    return (
        <>
            <Row>
                <NavBar user={props.user} logout={props.logout} />
            </Row>
            <Row className="after_navbar">
                <Container fluid>
                    <h2>Game Over!</h2>
                     <div> {sad} </div>
                    <br/>
                    <div>More in detail, the valid words with respective scores are:</div>
                    <Table hover>
                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    { wordsScores }
                </tbody>
            </Table> 

            &nbsp;&nbsp;
                <Link to={'/'}>
                <Button variant="danger" > Back</Button>
            </Link>
                    
                </Container>
                </Row>
        </>
    );
}

export { MainRoute, LoginRoute, RoundRoute, ScoreRoute };