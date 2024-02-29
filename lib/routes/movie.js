'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');


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
            return await movieService.create(request.payload, request.auth.credentials.id);
        }
    }
},
{
    method: 'GET',
    path: '/export-csv',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api']
    },
    handler: async (request, h) => {
        try {
            const { userService, csvService, mailService } = request.services();

            const { Movie } = request.server.models();
            const movies = await Movie.query();

            const adminEmail = request.auth.credentials.mail;
            console.log('current admin email :', adminEmail);
            const csvFilePath = await csvService.generateCsv(movies);

            await mailService.sendCsvEmail(adminEmail, 'Export CSV des films', 'Voici le fichier CSV contenant la liste des films, amuse toi bien.', csvFilePath);

            return { message: 'Export CSV en cours mon gars. Le fichier CSV sera envoyé à ton adresse e-mail bientôt beau gosse.' };
        }
        catch (error) {
            console.error('Erreur lors de l\'export CSV :', error);
            throw Boom.badImplementation('Une erreur s\'est produite lors de l\'export CSV.');
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
        return await movieService.update(request.params.id, request.payload, request.auth.credentials.id);
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
            return await movieService.delete(request.params.id, request.auth.credentials.id);
        }
    }
}]
;
