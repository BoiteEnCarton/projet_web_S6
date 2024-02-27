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
    create(movie) {
        const { Movie } = this.server.models();

        return Movie.query().insertAndFetch(movie);
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

