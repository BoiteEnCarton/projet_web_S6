'use strict';


const Crypto = require('crypto');


class Encrypt {

    static sha1(mdp) {

        return Crypto.createHash('sha1').update(mdp).digest('hex');
    }
    static compareSha1(mdp, hash) {

        return Encrypt.sha1(mdp) === hash;
    }
}


module.exports = Encrypt;
