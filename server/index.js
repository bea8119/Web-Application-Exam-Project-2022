'use strict';


const express = require('express');

const bodyParser = require('body-parser'); // middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const morgan = require('morgan'); // for logging
const cors = require('cors');


const DBHandler = require('./components/dbHandler');
const dbHandler = new DBHandler('categories.db');


const UserDAO = require('./components/userDAO');
const userDAO = new UserDAO(dbHandler);

const RoundDAO = require('./components/roundDAO');
const roundDAO = new RoundDAO(dbHandler);

const WordsDAO = require('./components/wordsDAO');
const wordsDAO = new WordsDAO(dbHandler);

const UserAuth = require('./components/userAuth');
const userAuth = new UserAuth(dbHandler.db);

// init express
const app = new express();
const port = 3001;

// Passport 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const User = require('./User');

app.use(morgan('dev'));
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userAuth.getUserHashCheck(username, password);
  if (!user) {
    return cb(null, false, 'Incorrect username and/or password.'); // return cb(err, user, info)
  }
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) { // for storing in session storage (and cookie content)
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// checks if logged in if not stops the api
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}


app.use(session({
  secret: "this is a secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

// logs in user 
app.post('/api/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json(req.user);
    });
  })(req, res, next); // IIFE (Immediat Invoked Function Expression)
});


// logs out current logged in user
app.delete('/api/logout', isLoggedIn, (req, res) => {
  req.logout(() => {
    res.end();
  });
});


//returns current user session
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) return res.status(200).json(req.user);
  return res.status(401).json({ error: 'Not authenticated' });
});



//To get the list of best rounds per category
app.get('/api/topList', async (req, res) => {
  try {
    let categories = await roundDAO.getBestRoundsPerCategory();
    const topList = categories.map((cat) => ({ category: cat.category, score: cat.maxscore, username: cat.name }));
    return res.status(200).json(topList);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

// returns the list of rounds of logged in user
app.get('/api/history/user/current', isLoggedIn, async (req, res) => {
  try {
    let List = await roundDAO.getRoundsByUser(req.user.id);
    
    const rounds = List.map((round) => {
      return { roundId: round.roundId, category: round.category, letter: round.letter, level: round.level, score: round.score };
    });
    return res.status(200).json(rounds);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});


// calculate score given a word, category and letter
app.get('/api/getScore/word/:word/:category/:letter', async (req, res) => {
  const bod = req.params;
  let userId=0;
  if (req.isAuthenticated()) {
    userId = req.user.id;
  }

  let score = 0;

  try {
    const rounds = await roundDAO.getLastTwoRounds(bod.category, bod.letter, userId);
  
    const roundWord = await wordsDAO.findWordInCategory(bod.word, bod.category);

    if (roundWord.count !== 0) {
     
      score = 5;
      let lastRounds= rounds.map(r => r.roundId);

      if (rounds.length === 2 && !lastRounds.includes(roundWord.roundId)) {
        
        score=10;
      }
    }
    return res.status(200).json({ word: bod.word, score: score });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }

});


// sets the roundId in word that was used
app.put('/api/word/setRound/:word/:category', async (req, res)=>{
  try {
    await wordsDAO.setRound(req.params.word, req.params.category, req.body.roundId);
    return res.status(200).end();
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }

});


//to add round, either with or without userId
app.post('/api/round/add', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: 'Empty body request' });
  }
  let userId=0;
  if (req.isAuthenticated()) {
   userId = req.user.id;
  }

  try {
    await roundDAO.newTableRound();
    let roundId=await roundDAO.addRound(req.body, userId); // gather from session
    return res.status(201).json(roundId);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});


/*these are functions for technical operations, unaccessible from my application*/

// to add users
app.post('/api/user', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: 'Empty body request' });
  }
  try {

    await userDAO.newTableUsers();
    await userDAO.addUser(req.body); // gather from session
    return res.status(201).json("successfully added user");
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});


// to delete all users
app.delete('/api/userDelete', async (req, res) => {
  try {
    await userDAO.dropTableUsers();
    res.status(204).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});


// to delete all rounds
app.delete('/api/roundDelete', async (req, res) => {
  try {
    await roundDAO.dropTableRound();
    res.status(204).end();
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.put('/api/word/cleanRounds', async (req, res) => {
  try {
    await wordsDAO.cleanWordRounds();
    res.status(204).end();
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

//this was used to fill up the database of words (changing manually)
 app.post('/api/words', async (req, res) => {

   await wordsDAO.newTableWords();

   let countries = wordsDAO.getArray("./categoriesFiles/countries.txt");
   try {
     await wordsDAO.addWords(countries, "countries");
   
   return res.status(201).json("successfully added words");
   }
   catch(err){
     console.log(err);
     return res.status(500).json({ error: 'DB error' });
   }
   

 }); 


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});