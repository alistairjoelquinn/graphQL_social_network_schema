import { GraphQLServer } from 'graphql-yoga';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start(() => console.log('server running!'));