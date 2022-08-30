import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { MainRoute, LoginRoute, RoundRoute, ScoreRoute } from './components/mainRoutes';
import { generateRandomLetter, firstCleanup } from './components/util';
import API from './API';



function App() {
  const [user, setUser] = useState({ id: 0 });
  //management of sidebar options
  const [option, setOption] = useState('Play');
  const [message, setMessage] = useState('');
  const [topPlayers, setTopPlayers] = useState([]);
  const [currentNameHistory, setCurrentNameHistory] = useState([]);
  //management of the round
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [letter, setLetter] = useState("");
  
  const [score, setScore] = useState(0);
  const [wordScore, setWordScore] = useState([]);

  const changeOption = (option) => {
    setOption(option);
  }



  const getDataFromServer = useCallback(async () => {
    if (option === 'TopPlayers') {
      let topPlayersList = await API.getTopList();
      setTopPlayers(topPlayersList);
    }
    else if (option === 'History' && user.id) {

      let historyList = await API.getHistory();
      setCurrentNameHistory(historyList);
    }
    /*else if (option === 'Play') {
      setWordScore([]);
      setScore(0);
      setWords([]);
    }*/

  }, [option, user.id]);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo(); // we have the user info here
        setUser(user);

      }
      catch (err) {
        setUser({ id: 0 });
      }
    }
    checkAuth();
  }, []);


  useEffect(() => {
    const getData = async () => {
      await getDataFromServer();
    }
    getData();
    /*setWordScore([]);
    setScore(0);
    setWords([]);*/
  }, [option, getDataFromServer, user.id]);



  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      let currentHistory = await API.getHistory();
      setCurrentNameHistory(currentHistory);
      setUser(user);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
    }
    catch (err) {
      console.log(err);
      setMessage({ msg: err, type: 'danger' });

    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setUser({ id: 0 });
    setCurrentNameHistory([]);
    setMessage('');
  };

  const handleGameStart = (charact) => {
    setCategory(charact.category);
    setLevel(charact.level);
    setLetter(generateRandomLetter());
  };

  const calculateScore = async (wordList) => {
    let cleaned = firstCleanup(wordList, letter);
    let countValid = 0;
    let sc = 0;
    let wordscore=[];
    for (let w of cleaned) {
      let res = await validateWord(w);
      wordscore.push(res);
      
      sc += res.score;
      if (parseInt(res.score) > 0) {
        countValid++;
      }
    }

    setScore((sc*parseInt(level)));
    setWordScore(wordscore);


    await registerRoundCleanWords(countValid, wordscore, sc*parseInt(level));

    return;

  };



  const registerRoundCleanWords = async (countValid, wordscore, sc) => {
      let mandatoryWords = (parseInt(level) !== 4 ? (parseInt(level) + 1) : 6);
      

      if (countValid < mandatoryWords) {
       
        await addRound({ category: category.toLowerCase(), letter: letter, level: level, score: 0 });
        setScore(0);
        return;
      }


      let roundId = await addRound({ category: category.toLowerCase(), letter: letter, level: level, score: sc })
      for (let ws of wordscore) {
        if (ws.score > 0) {
          await API.setWordRoundId(ws.word, category.toLowerCase(), roundId);
        }
      }


      await getDataFromServer();

  }


  const addRound = async (newRound) => {
    let roundId = await API.addRound(newRound);
    await getDataFromServer();
    return roundId;
  }

  const validateWord = async (word) => {

    return await API.checkWord(word, category.toLowerCase(), letter);
  }


  return (
    <Container className="App" fluid>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainRoute user={user} option={"Play"} setOption={changeOption} startGame={handleGameStart}
            logout={handleLogout} msg={message} setMessage={setMessage} />} />
          <Route path='/topPlayers' element={<MainRoute user={user} option={"TopPlayers"} setOption={changeOption}
            topPlayers={topPlayers} msg={message} setMessage={setMessage}
            logout={handleLogout} />} />
          <Route path='/myhistory' element={<MainRoute user={user} option={"History"}
            setOption={changeOption} History={currentNameHistory}
            msg={message} setMessage={setMessage}
            logout={handleLogout} />} />
          <Route path='/login' element={user.id ? <Navigate replace to='/' /> :
            <LoginRoute login={handleLogin} msg={message} setMessage={setMessage} />} />
          <Route path='/round' element={<RoundRoute user={user}
            category={category} level={level} letter={letter}
            calculateScore={calculateScore}
            msg={message} setMessage={setMessage} 
            logout={handleLogout}/>} />
          <Route path='/round/score' element={<ScoreRoute user={user}
            wordScore={wordScore} score={score} message={message}
            category={category} level={level} letter={letter}
            msg={message} setMessage={setMessage} setOption={changeOption}
            logout={handleLogout} />} />

        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
