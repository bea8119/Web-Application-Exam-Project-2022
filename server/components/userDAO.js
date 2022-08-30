class UserDAO {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    // Table management methods
    async newTableUsers() {
        await this.dbHandler.run(
            "CREATE TABLE IF NOT EXISTS users(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                email TEXT NOT NULL, name TEXT, hash TEXT NOT NULL, salt TEXT NOT NULL)"
        );
    }
    async dropTableUsers() {
        
        await this.dbHandler.run("DROP TABLE IF EXISTS users");
    }

    // GET
    async getUserByEmail(email) {
        return await this.dbHandler.get("SELECT id, email, name FROM users WHERE email=?", [email]);
    }

    async getUserNameById(id) {
        return await this.dbHandler.get("SELECT name FROM users WHERE id=?", [id]);
    }
    
    async getUsers() {
        return await this.dbHandler.all("SELECT id, email, name FROM users");
    }

    // POST
    async addUser(user) {
        return await this.dbHandler.run("INSERT INTO users(email, name, hash, salt) VALUES(?, ?, ?, ?)", [user.email, user.name, user.hash, user.salt]);
    }

    
}

module.exports = UserDAO;