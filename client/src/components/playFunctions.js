import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Table, Col, Row, Alert, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';



function Play(props) {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [level, setLevel] = useState('');

    const startTheGame = async (event) => {
        event.preventDefault();
        const roundOptions = { category, level };
        props.startGame(roundOptions, props.user);

        navigate('/round');
    };

    return (<>
        {props.msg && <Row>
            <Alert variant={props.msg.type} onClose={() => props.setMessage('')}
                dismissible>{props.msg.msg}</Alert>
        </Row>}
        <Container>


            <h1>Play a new round</h1>
            <br />

            <Form onSubmit={startTheGame}>
                <Row xs={3} className="gameOptions">
                    <Form.Group controlId="category">
                        <Form.Label>Choose the category</Form.Label>
                        <select className="form-select" onChange={ev => setCategory(ev.target.value)} id="category" required defaultValue="">
                            <option value="" disabled >Choose...</option>
                            <option value="Animals">Animals</option>
                            <option value="Colors">Colors</option>
                            <option value="Countries">Countries</option>
                        </select>
                    </Form.Group>
                </Row>

                <Row xs={3} className="gameOptions">
                    <Form.Group controlId="level">
                        <Form.Label>Choose the difficulty</Form.Label>
                        <select className="form-select" onChange={ev => setLevel(ev.target.value)} id="level" required defaultValue="">
                            <option value="" disabled>Choose...</option>
                            <option value="1">Difficulty 1</option>
                            <option value="2">Difficulty 2</option>
                            <option value="3">Difficulty 3</option>
                            <option value="4">Difficulty 4</option>
                        </select>
                    </Form.Group>
                </Row>
                <br />
                <Button type="submit" variant="primary">Start</Button>
                &nbsp;&nbsp;
                <Button variant="danger" onClick={() => { navigate('/') }}>Back</Button>
            </Form>


        </Container>
    </>);
}

function PlayRound(props) {
    const navigate = useNavigate();
    const [words, setWords] = useState([
        { id: uuidv4(), word: "" }
    ]);
    let mandatoryWords = (parseInt(props.level) !== 4 ? (parseInt(props.level) + 1) : 6);

    useEffect(() => {
        props.setWords(props.words);
    }, [props.finish]);

    const calcScoreWrapper = (w) => {
        props.calculateScore(w);
        navigate("/round/score")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        calcScoreWrapper(props.words);
    }

    const handleChangeWord = (id, event) => {
        //update local wordList for writing in the boxes
        const values = words.map(i => {
            if (id === i.id) {
                i.word = event.target.value
            }
            return i;
        })

        setWords(values);

        //update the wordList at App level in case time finishes
        let list = [];
        for (let w of words) {
            let lcword = w.word.toLowerCase();
            list.push(lcword);
        }
        props.setWords(list);
        //props.callback(list);
        //console.log("this is inside playfunc", props.words);
        //props.setFinish(true);
    }

    const handleAddWord = (event) => {
        setWords([...words, { id: uuidv4(), word: "" }])
    }

    let timeleft = 60;
    const [theTimer, setTimer] = useState(60);

   /* const handleFinishTime = () => {
        props.handleSubmit();
    }*/

    useEffect(() => {
        const timer = setInterval(function () {
            if (timeleft <= 0 ) {
                props.setFinish(true);
                timeleft = 0;
                setTimer(timeleft);
                //calcScoreWrapper(props.words);
                clearInterval(timer);
            }
            setTimer(timeleft);
            timeleft -= 1;
            props.setFinish(false);
        }, 1000);
        return () => clearInterval(timer);
    }, []);



    return (
        <>
            <Col xs={2} >

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
                        <span className="bold"  >{theTimer}</span>
                    </div>
                    


                </div>

                <br />
            </Col>
            <Col>
                <h2>You need to insert at least {mandatoryWords} words</h2>


                <br />
                <Form onSubmit={handleSubmit}>

                {theTimer!==0 ? 
                   <> {words.map(i => (
                        <div key={i.id}>
                            <div>
                                <input type="text" value={i.word} onChange={event => handleChangeWord(i.id, event)} />
                                &nbsp;&nbsp;
                                <br />
                            </div>
                            <br />
                        </div>

                    )

                    ) } <Button variant="primary" onClick={handleAddWord} >
                    <i className="bi bi-plus" />
                </Button> </>
                    :
                            <div> Time expired! Click the End Game button to see your results</div>
                    
                }
                    { /*words.map(i => (
                        <div key={i.id}>
                            <div>
                                <input type="text" value={i.word} onChange={event => handleChangeWord(i.id, event)} />
                                &nbsp;&nbsp;
                                <br />
                            </div>
                            <br />
                        </div>

                    )

                    ) */}
                    <br />
                   
                    

                    <br /> <br />
                    
                    <Button type="submit" variant="primary" onClick={() => { props.setFinish(true) }}>End Game</Button>
                    &nbsp;&nbsp;
                    <Button variant="danger" onClick={() => { props.setFinish(true); navigate('/') }}>Back</Button>
                </Form>
            </Col>
        </>
    );

}

/*function WordRows(props){

    <WordRows finish={props.finish} letter={props.letter} mandatoryWords={props.mandatoryWords} setFinish={props.setFinish} words={words} setWords={setWords}/>




    const [currWord, setCurrWord] = useState('');
    const validateWord = (word) => {
        if (!word.startsWith(props.letter))
            return "Wrong letter";
        else if(!props.words.includes(word)) 
        return "Word already inserted, try again";
        else
        return;
    }

    if(!props.finish){

            return(
                <>
                <Row>
                <Form.Control type="text" placeholder="" value={currWord} 
                      onChange={ev => setCurrWord(ev.target.value)} required={true}/>
                    
                </Row>
                

                </>
            )
        }
        

}*/



export { Play, PlayRound }