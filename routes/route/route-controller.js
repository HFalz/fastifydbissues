import { getRoute } from "./route-service.js";

const routeController = (fastify, options, done) => {
    console.log("Options at controller level: ", options)
    fastify.get('/', async (request, reply) => {
        return getRoute(options.ops);
    })
    done();
}

export { routeController as route };