'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class FavoriteMovie extends Model {
    static get tableName() {

        return 'favorite-movie';
    }

    static get relationMappings() {

        const Movie = require('./movie');

        return {
            movie: {
                relation: Model.BelongsToOneRelation,
                modelClass: Movie,
                join: {
                    from: 'favorite-movie.movieId',
                    to: 'movie.id'
                }
            }
        };
    }

    static get joiSchema() {

        return Joi.object({
            movieId: Joi.number().integer().required().greater(0).example(1).description('Id of the movie'),
            userId: Joi.number().integer().required().greater(0).example(1).description('Id of the user'),
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
