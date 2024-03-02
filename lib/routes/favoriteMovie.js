'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');

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
},
{
    method: 'get',
    path: '/favorite-movies/{userId}',
    options: {
        auth: {
            scope: ['user', 'admin']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                userId: Joi.number().integer().required().greater(0).example(1).description('Id of the user')
            })
        }
    },
    handler: async (request, h) => {
        try {
            const { favoriteMovieService } = request.services();
            return await favoriteMovieService.getByUserId(request.params.userId);
        }
        catch (error) {
            console.error('Error in GET /favorite-movies/{userId} handler:', error);
            throw Boom.badImplementation('500 foired - Internal server error');
        }
    }
},
{
    method: 'get',
    path: '/favorite-movies/{movieId}/users',
    options: {
        auth: {
            scope: ['user', 'admin']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                movieId: Joi.number().integer().required().greater(0).example(1).description('Id of the movie')
            })
        }
    },
    handler: async (request, h) => {
        try {
            const { favoriteMovieService } = request.services();
            return await favoriteMovieService.getUsersByMovieId(request.params.movieId);
        }
        catch (error) {
            console.error('Error in GET /favorite-movies/{movieId}/users handler:', error);
            throw Boom.badImplementation('500 foired - Internal server error');
        }
    }
},
{
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
        try {
            const { favoriteMovieService } = request.services();

            return await favoriteMovieService.create(request.payload);
        }
        catch (error) {
            if (error.constraint === 'favorite-movie.PRIMARY') {
                throw Boom.conflict('Ce film est déjà ajouté aux favoris.');
            }

            throw error;
        }
    }
},
{
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
        const result = await favoriteMovieService.delete(request.params.userId, request.params.movieId);
        if (!result) {
            throw Boom.notFound('The movie is not in the user\'s favorites.');
        }

        return result;
    }
}
];
