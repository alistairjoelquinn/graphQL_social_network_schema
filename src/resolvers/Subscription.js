export default {
    comment: {
        subscribe(parent, { postId }, { pubsub, db }, info) {
            const post = db.posts.find(post => post.id === postId);
            if (!post) {
                throw new Error('Post not found...');
            }
            return pubsub.asyncIterator(`comment_${postId}`);
        }
    },
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post');
        }
    }
};