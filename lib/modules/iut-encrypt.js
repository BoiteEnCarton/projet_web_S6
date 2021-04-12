'use strict';


const crypto = require('crypto');


class Encrypt {

    static sha1(mdp) {
        return crypto.createHash('sha1').update(mdp).digest('hex');
    }
    static compareSha1(mdp, hash) {
        return Encrypt.sha1(mdp) === hash;
    }
}


module.exports = Encrypt;
