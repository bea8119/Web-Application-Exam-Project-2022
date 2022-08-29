const crypto = require('crypto');

class UserAuth {
    constructor(db) {
        this.db = db;
    }

    getUserHashCheck = async (email, password) => { // This function MUST be a Promise  
        return new Promise((resolve, reject) => { // must NOT have await in the promise callback
            const sql = "SELECT * FROM users WHERE email=?"
            this.db.get(sql, [email], (err, row) => {
                if (err) reject(err);
                else if (row === undefined) resolve(false); // or undefined
                else {
                    const user = {id: row.id, email: row.email, name: row.name};
                    crypto.scrypt(password, row.salt, 64, function(err, hashedPassword) {
                        if (err) reject(err);
                       
                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) {
                           
                            resolve(false);
                        }
                        else resolve(user);
                    });
                }
            });
        });   
    };
}

module.exports = UserAuth;