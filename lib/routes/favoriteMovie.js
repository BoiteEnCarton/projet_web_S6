'use strict';

const Joi = require('joi');

module.exports = [{
    method: 'get',
    path: '/favorite-movies/{userId}/{movieId}',
    options: {
        auth: {
            scope: ['user', 'admin']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                userId: Joi.number().integer().required().greater(0).example(1).description('Id of the user'),
                movieId: Joi.number().integer().required().greater(0).example(1).description('Id of the movie')
            })
        }
    },
    handler: async (request, h) => {

        const { favoriteMovieService } = request.services();

        return await favoriteMovieService.get(request.params.userId, request.params.movieId);
    }
}, {
    method: 'post',
    path: '/favorite-movies',
    options: {
        auth: {
            scope: ['user', 'admin']
        },
        tags: ['api'],
        validate: {
            payload: Joi.object({
                userId: Joi.number().integer().required().greater(0).example(1).description('Id of the user'),
                movieId: Joi.number().integer().required().greater(0).example(1).description('Id of the movie')
            })
        }
    },
    handler: async (request, h) => {

        const { favoriteMovieService } = request.services();

        return await favoriteMovieService.create(request.payload);
    }
}, {
    method: 'delete',
    path: '/favorite-movies/{userId}/{movieId}',
    options: {
        auth: {
            scope: ['user', 'admin']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                userId: Joi.number().integer().required().greater(0).example(1).description('Id of the user'),
                movieId: Joi.number().integer().required().greater(0).example(1).description('Id of the movie')
            })
        }
    },
    handler: async (request, h) => {

        const { favoriteMovieService } = request.services();

        return await favoriteMovieService.delete(request.params.userId, request.params.movieId);
    }
}
];
