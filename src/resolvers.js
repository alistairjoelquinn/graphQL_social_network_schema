import uuid from 'uuid/v4';

import { users, posts, comments } from './content';

export default {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }
            return users.filter(user => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter(post => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        comments(parent, args, ctx, info) {
            return comments;
        },
        me() {
            return {
                id: '123098',
                name: 'Mike',
                email: 'mike@example.com',
                age: 28
            }
        },
        post() {
            return {
                id: 'abg567',
                title: 'interesting things',
                body: 'things are interesting',
                published: true
            }
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email);
            if (emailTaken) {
                throw new Error('email address taken');
            }
            const user = {
                id: uuid(),
                ...args.data
            };
            users.push(user);
            return user;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author);
            if (!userExists) {
                throw new Error('user doesnt exist!');
            }
            const post = {
                id: uuid(),
                ...args.data
            }
            posts.push(post);
            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author);
            const postExists = posts.some(post => post.id === args.data.post);
            if (!postExists || !userExists) {
                throw new Error('something doesnt exist');
            }
            const comment = {
                id: uuid(),
                ...args.data
            }
            comments.push(comment);
            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => {
                return user.id === parent.author;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.post === parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => {
                return user.id === parent.author
            });
        },
        post(parent, args, ctx, info) {
            return posts.find(post => {
                return post.id === parent.post;
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.author === parent.id;
            })
        }
    }
};
