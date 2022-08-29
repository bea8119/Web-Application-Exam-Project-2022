# Exam #3: "Categories"
## Student: s304812 PIRAS BEATRICE 

## React Client Application Routes

- Route `/`: It is the main route, it contains the sidebar that can direct to the game options menu, to the hall of fame and, if a user is logged in, the history (previous rounds) of the user.
- Route `/topPlayers`: Accessible from the sidebar (hall of fame) it shows for each category the best player and the best score, giving precedence to the last rounds played in case of equivalent scores.
- Route `/myhistory`: Accessible from the sidebar (History) it has two options: it either invites the user to login or if a user is already logged in, it shows their previous rounds with all their characteristics and score, in order of last execution.
- Route `/login`: Login Route, contains the login form. Will trigger an alert if the credentials are not found
- Route `/round`: Accessed after selecting the game options in the main route, it executes teh game. It contains a sidebar with the randomized letter, the category and difficulty and a 60 seconds timer. The central part contains a text field where to write words, and an add button to add more text fields to insert other words. the end game button has the same behaviour as the timer finishing.
- Route `/round/score`: After finishing the game, the player is redirected to the result of the round, where the score is shown and a list of the distinct words inserted that start with the correct letter, with their relative score. If the score is zero, the word was not valid for the selected category.

## API Server

- POST `/api/login`
  - req parameters: None
  - req body content: username and password (will be used by Passport)
  - res content: session (contains user, name, email)
- DELETE `/api/logout`
  - req parameters: None
  - req body content: None
- GET `/api/sessions/current`
  - req parameters: None
  - req body content: session
  - res content: session
- GET `/api/topList`
  - req parameters: None
  - req body content: None
  - res content: topList of the 3 categories (list of Object {category, score, username})
- GET `/api/history/user/current`
  - req parameters: None
  - req body content: None
  - res content: history of rounds of user (Object {roundId, category, letter, level, score})
- GET `/api/getScore/word/:word/:category/:letter`
  - req parameters: word, categpry, letter
  - req body content: None
  - res content: score per word (Object {word, score})
  -description:  1) gets last two rounds from round table by category and letter (not   played by current user), this returns a list of 2 or less roundId
                2) finds word + category in words table and returns its roundId (can be null if word was never played)
                3) if word is found, checks if the word was played in the last 2 rounds extracted (if there were two rounds) if it wasn't played and there are 2 rounds played for category+letter-user, then score is 10, else score is 5
- PUT `/api/word/setRound/:word/:category`
  - req parameters: word, category
  - req body content: roundId
  -description: changes the roundId in word+category in words table
- POST `/api/round/add`
  - req parameters: None
  - req body content: category, letter, level, score
  - result: roundId generated (integer)



## Database Tables

- Table `users` - contains id, email, username, hash, salt
- Table `words` - contains word, category and roundId 
          *word and category are pre filled with the list of words + categories in the folder categoriesFiles and unchangeable, roundId is set to null at the beginning, set to the specific roundId every time a valid word is used in a valid round
- Table `round` - contains roundId, category, letter, level, score, userId 
          *userId is set to 0 if the round is played in incognito


## Main React Components

- `NavBar` (in `navbar.js`): Navigation bar containing logo and name of the application, login and logout button.
- `SideBar` (in `sidebar.js`): Side Bar to navigate between the main route and the hall of fame or history.
- `HistoryList` (in `historylist.js`): Table list of the history of each user.
- `TopPlayerList` (in `topPlayerList.js`): Table list of the best users/score per category
- `Play` (in `playFunctions.js`): Implementation of a form  to select the options of the round to lay (category and difficulty).
- `PlayRound` (in `playFunctions.js`):Implementation of: 1)Side Bar present during the game, with the implementation of the timer. 2) Implementation of a form that, starting with a single text box, generates new text boxes for multiple words by pressing a + button.  
- `MainRoute` (in `mainRoutes.js`): the main route function that unites NavBar, SideBar and one between {HistoryList, TopPlayerList, Play} depending on the option selected.
- `RoundRoute` (in `mainRoutes.js`): The route function that manages the gameplay, unites NavBar, GameSideBar and PlayRound
- `ScoreRoute` (in `mainRoutes.js`): The route function called after the end of a round, that reports the results of the round.


## Screenshot

![Screenshot](./img/screenshotGame.jpg)

## Users Credentials

- username: prova1@polito.it , password: password
- username: prova2@polito.it , password: password
- username: prova3@polito.it , password: password
- username: prova4@polito.it , password: password
- username: prova5@polito.it , password: password
