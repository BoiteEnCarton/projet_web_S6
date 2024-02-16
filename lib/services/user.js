'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('../modules/iut-encrypt');
const Token = require('../utils/jwt-generator');
const { Boom } = require('@hapi/boom');

module.exports = class UserService extends Service {

    create(user) {
        console.log(user.password);
        const { User } = this.server.models();

        user.password = Encrypt.sha1(user.password);

        return User.query().insertAndFetch(user);
    }
    getAll() {

        const { User } = this.server.models();

        return User.query().select();
    }
    delete(id) {

        const { User } = this.server.models();

        return User.query().deleteById(id);
    }
    getById(id) {

        const { User } = this.server.models();

        return User.query().findById(id);
    }
    update(id, user) {

        const { User } = this.server.models();
        if (user.password) {
            user.password = Encrypt.sha1(user?.password);
        }

        return User.query().patchAndFetchById(id, user);
    }
    login(user) {

        const { User } = this.server.models();
        console.log(Token(user));
        console.log(user.firstName);
        console.log(user.lastName);
        return User.query().findOne({ mail: user.mail, password: user.password });
        // return token(user);
    }
    async verifyPassword(mail, password) {

        const { User } = this.server.models();
        const user = await User.query().findOne({ mail });

        if (user && user.password === Encrypt.sha1(password)) {

            return user;
        }

        throw Boom.unauthorized('Invalid password');
    }

};

