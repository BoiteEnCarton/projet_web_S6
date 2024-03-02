'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('../modules/iut-encrypt');
const Token = require('../utils/jwt-generator');
const Boom = require('@hapi/boom');

module.exports = class UserService extends Service {

    async create(user) {
        console.log(user.password);
        const { User } = this.server.models();

        user.password = Encrypt.sha1(user.password);

        const newUser = await User.query().insertAndFetch(user);

        const { mailService } = this.server.services();
        await mailService.sendWelcomeEmail(newUser.mail);

        return newUser;
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

        if (!id) {
            throw Boom.notFound('L\'utilisateur spécifié n\'existe pas.');
        }

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
        const loggedUser = User.query().findOne({ mail: user.mail, password: user.password });
        if (!loggedUser) {
            throw Boom.unauthorized('Mauvaises informations');
        }

        return loggedUser;
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

