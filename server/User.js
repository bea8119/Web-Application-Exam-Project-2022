/**
 * Constructor function for new User objects (do not include credentials)
 * @param {number} id ID of the user (e.g, 1)
 * @param {string} name Name of the user
 * @param {string} email E-mail of the user 
 * @param {number} score Score of a user
 */

 function User(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
}

module.exports = User;