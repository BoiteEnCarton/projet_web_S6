'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.alterTable('user', (table) => {
            table.dropColumn('scope');
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
