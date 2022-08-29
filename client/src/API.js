import dayjs from 'dayjs';

import User from './User';

const expressServerURL = 'http://localhost:3001';

const logIn = async (credentials) => {
    const response = await fetch(`${expressServerURL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getUserInfo = async () => {
    const response = await fetch(`${expressServerURL}/api/sessions/current`, {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;
    }
};

const logOut = async () => {
    const response = await fetch(`${expressServerURL}/api/logout`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) return null;
}

const getTopList = async () => {
    const response = await fetch(`${expressServerURL}/api/topList`, {
        method: 'GET'
    });
    const categories = await response.json();
    if (response.ok) {
        return categories.map(cat => ({category: cat.category, score: cat.score, username: cat.username }));
    }
    else throw categories;
}

const getHistory = async () => {
    const response = await fetch(`${expressServerURL}/api/history/user/current`, {
        method: 'GET',
        credentials: 'include'
    });
   
    const history = await response.json();
    if (response.ok) {
        return history.map(round => ({roundId: round.roundId, category: round.category, letter: round.letter, level: round.level, score: round.score}));
    }
    else throw history;
}

const addRound = async(newRound)  => {
    const response = await fetch(`${expressServerURL}/api/round/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            category : newRound.category,
            letter: newRound.letter,
            level: newRound.level,
            score: newRound.score
        })
    });
   
    const roundId = await response.json();
    if (response.ok) {
        return roundId;
    }
    else throw roundId;

}

const checkWord = async (word, category, letter) => {

    const response = await fetch(`${expressServerURL}/api/getScore/word/${word}/${category}/${letter}`, {
        method: 'GET', 
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
         
    });

    const wordScore = await response.json();
    
    if (response.ok) {
        return wordScore;
    }
    else throw wordScore;

}

const setWordRoundId = async (word, category, roundId) => {
    const response = await fetch(`${expressServerURL}/api/word/setRound/${word}/${category}`, {
        method: 'PUT', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            roundId: roundId.roundId
        }) 
    });

    const res = await response;
    
    if (response.ok) {
        return res;
    }
    else throw res;

};

const API = {
    logIn, getUserInfo, logOut, getTopList, getHistory, checkWord, addRound, setWordRoundId
};
export default API;