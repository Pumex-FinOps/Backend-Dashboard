const crypto = require('crypto');

const generateRandomString = (length) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const generateUniqueUsername = async (email, User) => {
    let baseUsername = email.split('@')[0];
    let username = baseUsername;
    let counter = 1;

    while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
    }

    return username;
}

module.exports = { generateRandomString, generateUniqueUsername };
