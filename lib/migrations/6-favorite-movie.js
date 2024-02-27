'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('favorite-movie', (table) => {

            table.integer('movieId').unsigned().notNull();
            table.foreign('movieId').references('movie.id');
            table.integer('userId').unsigned().notNull();
            table.foreign('userId').references('user.id');
            table.primary(['movieId', 'userId']);
            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('favorite-movie');
    }
};
