import { GraphQLServer } from 'graphql-yoga';

import db from './src/db';
import Query from './src/resolvers/Query';
import Mutation from './src/resolvers/Mutation';
import User from './src/resolvers/User';
import Post from './src/resolvers/Post';
import Comment from './src/resolvers/Query';

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query, Mutation, User, Post, Comment
    },
    context: {
        db
    }
});

server.start(() => console.log('server running!'));