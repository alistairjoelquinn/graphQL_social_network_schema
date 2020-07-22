import uuid from 'uuid/v4';

import { usersData, postsData, commentsData } from './content';

let users = usersData;
let posts = postsData;
let comments = commentsData;

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
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.id);
            if (userIndex === -1) {
                throw new Error('User not found...');
            }
            const deletedUsers = users.splice(userIndex, 1);

            posts = posts.filter(post => {
                const match = post.author === args.id;
                if (match) {
                    comments = comments.filter(comment => comment.post !== post.id);
                }
                return !match;
            });

            comments = comments.filter(comment => comment.author !== args.id);
            return deletedUsers[0];
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
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex(post => post.id === args.id);
            if (postIndex === -1) {
                throw new Error('post not found');
            }
            const deletedPosts = posts.splice(postIndex, 1);
            comments = comments.filter(comment => comment.post !== args.id);
            return deletedPosts[0];
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
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment => comment.id === args.id);
            if (commentIndex === -1) {
                throw new Error('Comment not found...')
            }
            const deletedCommets = comments.splice(commentIndex, 1);
            return deletedCommets[0];
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
