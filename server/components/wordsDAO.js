
const { readFileSync, promises: fsPromises } = require('fs');
const { resolve } = require('path');

class WordsDAO {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }




    // Table management methods
    async newTableWords() {
        await this.dbHandler.run(
            "CREATE TABLE IF NOT EXISTS words(word TEXT NOT NULL, category TEXT NOT NULL, roundId INTEGER , PRIMARY KEY(word, category))"
        );
    }
    async dropTableWords() {

        await this.dbHandler.run("DROP TABLE IF EXISTS words");
    }

    // GET
    async getWordsByRoundId(roundId) {
        return await this.dbHandler.all("SELECT word FROM words WHERE roundId=? ", [roundId]);
    }

    async getWordsByCategory(category) {
        return await this.dbHandler.all("SELECT word FROM words WHERE category=? ", [category]);
    }

    // get unique roundId for word, 
    //if roundId is present in list of last 2 roundId then give 5 points, else give 10
    async findWordInCategory(word, category) {
        return await this.dbHandler.get("SELECT count(*) as count, roundId FROM words WHERE category=? AND word = ? ", [category, word]);
    }

    /*async deleteWordsByRoundId(roundId){
        await this.dbHandler.run("DELETE FROM words WHERE roundId= ?", [roundId]);
    }*/

    async getWords() {
        return await this.dbHandler.all("SELECT word, category, roundId FROM words", []);
    }


    async setRound(word, category, roundId){
        return await this.dbHandler.run("UPDATE words SET roundId = ? WHERE word= ? AND category = ?", [roundId, word, category]);
    }


    // POST
    async addWords(words, category) {
        words.forEach( async(word) =>{
            await this.dbHandler.run("INSERT INTO words(word, category, roundId) VALUES(?, ?, ?)", [word.toLowerCase(), category, null], (err) =>{
                if(err){
                    reject(err);
                }else resolve();
            })
        });

    }

    async DeleteWordCategory(word, category){
        return await this.dbHandler.run("DELETE FROM words WHERE  category = ?", ["countries"]);
    }

    async cleanWordRounds(){
        return await this.dbHandler.run("UPDATE words SET roundId=?", [null]);
    }




    getArray(filename) {

        return readFileSync(filename, 'utf-8').split(/\r?\n/);

    }




}

module.exports = WordsDAO;