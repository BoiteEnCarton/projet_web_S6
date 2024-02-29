'use strict';

const Jwt = require('@hapi/jwt');


const token = (user) => { return Jwt.token.generate(
    {
        aud: 'urn:audience:iut',
        iss: 'urn:issuer:iut',
        firstName: user.firstName,
        lastName: user.lastName,
        mail: user.mail,
        scope: user.scope
    },
    {
        key: 'random_string',
        algorithm: 'HS512'
    },
    {
        ttlSec: 14400
    }
);};

module.exports = token;