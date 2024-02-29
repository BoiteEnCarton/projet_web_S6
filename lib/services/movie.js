'use strict';

const { Service } = require('@hapipal/schmervice');
const { Boom } = require('@hapi/boom');

module.exports = class MovieService extends Service {

    async get(id) {
        const { Movie } = this.server.models();

        const movie = await Movie.query().findById(id);

        if (!movie) {
            throw Boom.notFound('Movie not found');
        }

        return movie;
    }
    async create(movie) {
        const { Movie } = this.server.models();

        const newMovie = Movie.query().insertAndFetch(movie);

        const { mailService, userService } = this.server.services();

        // Récupérer tous les utilisateurs
        const users = await userService.getAll();

        // Parcourir la liste des utilisateurs et envoyer un e-mail à chacun
        for (const user of users) {
            await mailService.sendNotification(user.mail, 'Nouveau film ajouté la team  !!!', `Le film ${movie.title} a été ajouté va voir maintenant`);
        }

        return newMovie;
    }
    update(id, movie) {
        const { Movie } = this.server.models();

        return Movie.query().patchAndFetchById(id, movie);
    }
    delete(id) {
        const { Movie } = this.server.models();

        return Movie.query().deleteById(id);
    }
};

