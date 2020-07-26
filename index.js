import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './src/db';
import Query from './src/resolvers/Query';
import Mutation from './src/resolvers/Mutation';
import User from './src/resolvers/User';
import Post from './src/resolvers/Post';
import Comment from './src/resolvers/Comment';
import Subscription from './src/resolvers/Subscription';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query, Mutation, User, Post, Comment, Subscription
    },
    context: {
        db,
        pubsub
    }
});

server.start(() => console.log('server running!'));