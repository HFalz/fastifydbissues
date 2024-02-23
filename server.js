import fastify from "fastify";
import fastifyMysql from "@fastify/mysql";
import { Client } from "@planetscale/database";
import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

import routes from "./routes/routes.js";

dotenv.config();

const connection = 0

const server = fastify({ 
    logger: true,
    ajv: {
        customOptions: {
            coerceTypes: false,
        }
    }
});

const planetBase = new Client({
    host: process.env.DATABASE_URL,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,

})

/**
 * Initializes a MySQL connection pool.
 */
const mysql = await mysql2.createPool({
    uri: process.env.DATABASE_URI,
    connectionLimit: 25,
    multipleStatements: false //For secruity reasons
})

// Registering the fastify mysql plugin -> use MySql2 under the hood
server.register(fastifyMysql, { 
    uri: process.env.DATABASE_URI,
    waitForConnections: true,
    promise: true, 
    multipleStatements: false,
    //Pool Config
    type: 'pool',
    connectionLimit: 25,
    queueLimit: 0,
    keepAliveInitialDelay: 10000
});

//Set up routes through plugin
server.register(routes, {f_mysql: server, p_base: planetBase, m_sql: mysql, con: connection});


try {
    await server.listen({
        port: 3333,
    })
} catch (error) {
    server.log.error(error);
    process.exit(1);
}
