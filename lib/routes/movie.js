'use strict';

const Joi = require('joi');


module.exports = [{
    method: 'get',
    path: '/movie/{id}',
    options: {
        tags: ['api'], validate: {
            'params': Joi.object({
                'id': Joi.number().integer().greater(0)
            })
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.get(request.params.id);
        }
    }
},
{
    method: 'post',
    path: '/movie',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'], validate: {
            payload: Joi.object({
                title: Joi.string().required().min(3).example('The Lord of The Ring').description('Title of the movie'),
                description: Joi.string().required().min(3).example('The Lord of The Ring is a film series of three epic fantasy adventure films directed by Peter Jackson, based on the novel written by J. R. R. Tolkien.').description('Description of the movie'),
                year: Joi.number().integer().required().min(1900).max(2030).example(2001).description('Year of the movie'),
                producer: Joi.string().required().min(3).example('Peter Jackson').description('Producer of the movie')
            })
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.create(request.payload);
        }
    }
},
{
    method: 'put',
    path: '/movie/{id}',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'], validate: {
            params: Joi.object({
                id: Joi.number().integer().greater(0)
            }), payload: Joi.object({
                title: Joi.string().min(3).example('The Lord of The Ring').description('Title of the movie'),
                description: Joi.string().min(3).example('The Lord of The Ring is a film series of three epic fantasy adventure films directed by Peter Jackson, based on the novel written by J. R. R. Tolkien.').description('Description of the movie'),
                year: Joi.number().integer().min(1900).max(2030).example(2001).description('Year of the movie'),
                producer: Joi.string().min(3).example('Peter Jackson').description('Producer of the movie')
            })
        }
    },
    handler: async (request, h) => {

        const { movieService } = request.services();

        return await movieService.update(request.params.id, request.payload);
    }
},
{
    method: 'delete',
    path: '/movie/{id}',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'], validate: {
            params: Joi.object({
                id: Joi.number().integer().greater(0)
            })
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.delete(request.params.id);
        }
    }
}]
;
