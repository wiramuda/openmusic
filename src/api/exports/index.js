const ExportsHandler = require('./handler');
const route = require('./route');
module.exports = {
    version: '1.0.0',
    name: 'exports',
    register: async (server, {service, validator}) => {
        const exportsHandler = new ExportsHandler(service, validator);
        await server.route(route(exportsHandler));
    }
}