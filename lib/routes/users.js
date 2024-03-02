'use strict';

module.exports = {
    method: 'get',
    path: '/users',
    options: {
        auth: {
            scope: ['user', 'admin']
        },
        tags: ['api']
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.getAll();
    }
};
