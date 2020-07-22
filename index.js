import { GraphQLServer } from 'graphql-yoga';

import resolvers from './src/resolvers';
import db from './src/db';

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});

server.start(() => console.log('server running!'));