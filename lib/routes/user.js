'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = [{
    method: 'delete', path: '/user/{id}', options: {
        auth:
            {
                scope: ['admin']
            },
        tags: ['api'], validate: {
            params: Joi.object({
                id: Joi.number().integer().greater(0)
            })
        }, handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.delete(request.params.id);
        }
    }
}, {
    method: 'post', path: '/user', options: {
        auth: false,
        tags: ['api'], validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                username: Joi.string().required().min(3).example('Maxou').description('Username of the user'),
                mail: Joi.string().required().email().example('maxime.crapule@gmail.com').description('Mail of the user'),
                password: Joi.string().required().min(8).example('12345678').description('Password of the user'),
                scope: Joi.array().example('["user", "admin"]').description('Scope of the user').default(['user'])
            })
        }
    }, handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.create(request.payload);
    }
}, {
    method: 'patch', path: '/user/{id}', options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'], validate: {
            params: Joi.object({
                id: Joi.number().integer().greater(0)
            }), payload: Joi.object({
                firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                username: Joi.string().min(3).example('Maxou').description('Username of the user'),
                password: Joi.string().min(8).example('12345678').description('Password of the user'),
                scope: Joi.array().example('user').description('Scope of the user').default('user').valid('admin', 'user')
                // mail: Joi.string().email().example('maxime.crapule@gmail.com').description('Mail of the user'),
            })
        }, handler: async (request, h) => {

            const { userService } = request.services();

            return await userService.update(request.params.id, request.payload);
        }
    }
}, {
    method: 'post', path: '/user/login', options: {
        auth: false,
        tags: ['api'], validate: {
            payload: Joi.object({
                mail: Joi.string().required().email().example('maxime.crapule@gmail.com').description('Mail of the user'),
                password: Joi.string().required().min(8).example('12345678').description('Password of the user')
            })
        }
    }, handler: async (request, h) => {

        const { userService } = request.services();

        const user = await userService.verifyPassword(request.payload.mail, request.payload.password);
        if (await userService.login(user)) {
            return h.response('Login: successful').code(200);
        }

        throw Boom.unauthorized('Login: failed');

    }
}];
