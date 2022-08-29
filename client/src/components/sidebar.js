import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';


function SideBar(props) {
    const navigate = useNavigate();
    return (
        <>

            <div className="myusericon"> {props.user.id ? <i className="bi bi-person-circle myusericon" /> : <i className="bi bi-incognito"></i>}</div>

            <div>User:&nbsp;
                <span className="bold">
                    {props.user.id ? props.user.name : "incognito"}
                </span>
            </div> <br />

            <ListGroup as="ul" variant="flush">
                <ListGroup.Item as="li" variant="primary" action active={props.option === 'Play'}
                    onClick={() => { props.setOption('Play'); navigate('/') }}
                >Play a new game</ListGroup.Item>
                <ListGroup.Item as="li" variant="primary" action active={props.option === 'TopPlayers'}
                    onClick={() => { props.setOption('TopPlayers'); navigate('/topPlayers') }}
                >Hall of fame</ListGroup.Item>

                <ListGroup.Item as="li" action active={props.option === 'History'} onClick={() => { props.setOption('History'); navigate('/myhistory') }}
                    variant="primary"
                >My History</ListGroup.Item>



            </ListGroup>
            <br />

        </>
    );
}

/*function GameSideBar(props) {
   // const navigate = useNavigate();

    let timeleft = 15;
    const [theTimer, setTimer] = useState(60);

    const handleFinishTime = () => {
        props.handleSubmit();
    }

    useEffect(() => {
        const timer = setInterval(function () {
            if (timeleft <= 0) {
                props.setFinish(true);
                timeleft = 0;
                setTimer(timeleft);
                handleFinishTime();
                clearInterval(timer);
            }
            setTimer(timeleft);
            timeleft -= 1;
            props.setFinish(false);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (<>


        <div className="myusericon"> {props.user.id ? <i className="bi bi-person-circle myusericon" /> : <i className="bi bi-incognito"></i>}</div>

        <div>User:&nbsp;
            <span className="bold">
                {props.user.id ? props.user.name : "incognito"}
            </span>
        </div> <br />

        <div className="myside" xs={4}>
            <div>Your letter is: &nbsp;
                <span className="bold">{props.letter}</span>
            </div>
            <div>Category: {props.category}</div>
            <div>Difficulty {props.level}</div>
            <div>Timer: &nbsp;
                <span className="bold">{theTimer}</span>
            </div>


        </div>

        <br />


    </>

    );

}*/



export { SideBar};