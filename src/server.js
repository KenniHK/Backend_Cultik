const Hapi = require('@hapi/hapi');
const routes = require('./routes');
require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
      port: process.env.PORT || 8000,
      host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
          },
    });

server.route(routes);

await server.start();
console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
