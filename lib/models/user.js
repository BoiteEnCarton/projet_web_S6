'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get jsonAttributes() {

        return ['scope'];
    }

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('Banane').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Gif').description('Lastname of the user'),
            password: Joi.string().min(8).example('JeSuisPasBanRiot').description('Password of the user'),
            mail: Joi.string().email().example('banane.gif@pixul.fr').description('Mail of the user'),
            username: Joi.string().min(3).example('BoiteEnCarton').description('Username of the user'),
            scope: Joi.array().example('user').description('Scope of the user').default(['user']),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }
};
