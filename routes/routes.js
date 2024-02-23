import { route } from './route/route-controller.js'

const routes = (fastify, options, done) => {
    
    //Route
    fastify.register( route, { prefix: '/route', ops: options })

    done();
}

export default routes;