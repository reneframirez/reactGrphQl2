const { ApolloServer }= require('apollo-server');
const typeDefs =  require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

//conectar BD
conectarDB();

// servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        //console.log(req.headers['authorization'])
        const token = req.headers['authorization'];
        if (token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA );
                //console.log("usuarios--> " + usuario);

                return {
                    usuario
                }

            } catch (error) {
                console.log("hubo un error --> " + error);
            }
        }

    }
});

//Arrancar Servidor
server.listen().then( ({url}) => {
    console.log(`Por fin !!!! servidor listo en la URL ${url}`  )
} )
