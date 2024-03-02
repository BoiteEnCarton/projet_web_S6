'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoriteMovieService extends Service {

    async get(userId, movieId) {
        const { FavoriteMovie } = this.server.models();

        const favoriteMovie = await FavoriteMovie.query()
            .where({ userId, movieId })
            .withGraphFetched('movie')
            .first();

        if (!favoriteMovie) {
            throw Boom.notFound('Favorite movie not found');
        }

        if (!favoriteMovie.movie) {
            throw Boom.notFound('Movie not found');
        }

        return favoriteMovie.movie;
    }

    async getByUserId(userId) {
        const { FavoriteMovie } = this.server.models();

        return await FavoriteMovie.query().where({ userId }).withGraphFetched('movie');
    }

    async getUsersByMovieId(movieId) {
        const { FavoriteMovie, User } = this.server.models();

        const userIds = await FavoriteMovie.query().where({ movieId }).pluck('userId');

        const users = await User.query().whereIn('id', userIds);

        return users;
    }



    async create(favoriteMovie) {
        const { FavoriteMovie } = this.server.models();

        return await FavoriteMovie.query().insert(favoriteMovie);
    }

    async delete(userId, movieId) {
        const { FavoriteMovie } = this.server.models();

        if (!userId) {
            throw Boom.notFound('L\'utilisateur spécifié n\'existe pas.');
        }

        if (!movieId) {
            throw Boom.notFound('Le film spécifié n\'existe pas.');
        }

        if (!await FavoriteMovie.query().findOne({ userId, movieId })) {
            throw Boom.notFound('Ce film n\'est pas dans vos favoris');
        }

        return await FavoriteMovie.query().where({ userId, movieId }).delete();
    }
};

