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

        const users = await userService.getAll();

        for (const user of users) {
            await mailService.sendNotification(user.mail, 'Nouveau film ajouté la team  !!!', `Le film ${movie.title} a été ajouté va voir maintenant`);
        }

        return newMovie;
    }
    async update(id, movie) {
        const { Movie } = this.server.models();
        const { favoriteMovieService, mailService } = this.server.services();

        const updatedMovie = await Movie.query().patchAndFetchById(id, movie);

        const favoriteUsers = await favoriteMovieService.getUsersByMovieId(id);

        for (const user of favoriteUsers) {
            await mailService.sendNotification(user.mail, 'Film modifié la team !!!', `Le film ${movie.title} a été modifié. Venez le voir !`);
        }

        return updatedMovie;
    }


    delete(id) {
        const { Movie } = this.server.models();

        return Movie.query().deleteById(id);
    }
};

