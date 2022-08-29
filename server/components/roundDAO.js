class RoundDAO {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    // Table management methods
    async newTableRound() {
        await this.dbHandler.run(
            "CREATE TABLE IF NOT EXISTS round(roundId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                category TEXT, letter varchar(1),  level INTEGER, score INTEGER, userID INTEGER)"
        );
    }
    async dropTableRound() {
        
        await this.dbHandler.run("DROP TABLE IF EXISTS round");
    }

    // GET
    async getRoundsByUser(userId) {
        return await this.dbHandler.all("SELECT roundId, category, letter, level, score FROM round WHERE userID=? ORDER BY roundId DESC", [userId] );
    }
    
    async getLastTwoRounds(category, letter, userId) {
        if(userId===0){
            return await this.dbHandler.all("SELECT roundId FROM round WHERE  category = ? AND letter = ? ORDER BY roundId DESC LIMIT 2", [category, letter]);
        }else{
            return await this.dbHandler.all("SELECT roundId FROM round WHERE  category = ? AND letter = ? AND userID != ? ORDER BY roundId DESC LIMIT 2", [category, letter, userId]);
        }
        
    }

    async getBestRoundsPerCategory() {
         return await this.dbHandler.all("SELECT category, max(score) as maxscore, name FROM round, users WHERE round.userID = users.id  GROUP BY category", []);
      
    }

    



    // POST
    async addRound(round, userId) {
         await this.dbHandler.run("INSERT INTO round(category, letter, level, score,  userID) VALUES(?, ?, ?, ?, ?)", [round.category, round.letter, round.level, (parseInt(round.score)), userId]);
         return await this.dbHandler.get("SELECT roundId FROM round ORDER BY roundId DESC LIMIT 1", []);

    }

    
}

module.exports = RoundDAO;