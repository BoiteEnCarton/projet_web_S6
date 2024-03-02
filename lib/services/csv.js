'use strict';

const ObjectsToCsv = require('objects-to-csv');

module.exports = class CsvService {
    async generateCsv(data) {

        const csv = new ObjectsToCsv(data);
        await csv.toDisk('./movies.csv');
        return './movies.csv';
    }
};
