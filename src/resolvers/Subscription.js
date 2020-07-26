export default {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;

            setInterval(() => {
                count++;
                pubsub.publish('count', { count });
            }, 1000);

            return pubsub.asyncIterator('count');
        }
    },
    comment: {
        subscribe(parent, { postId }, { pubsub, db }, info) {
            const post = db.posts.find(post => post.id === postId);
            if (!post) {
                throw new Error('Post not found...');
            }
            return pubsub.asyncIterator(`comment_${postId}`);
        }
    }
};