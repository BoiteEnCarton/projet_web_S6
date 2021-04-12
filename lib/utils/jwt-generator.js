'use strict';

const Jwt = require('@hapi/jwt');


const token = (user) => { return Jwt.token.generate(
    {
        aud: 'urn:audience:iut',
        iss: 'urn:issuer:iut',
        firstName: user.firstName,
        lastName: user.lastName,
        mail: user.mail,
        scope: user.scope //Le scope du user
    },
    {
        key: 'random_string', // La clé qui est définie dans lib/auth/strategies/jwt.js
        algorithm: 'HS512'
    },
    {
        ttlSec: 14400 // 4 hours
    }
);};

module.exports = token;