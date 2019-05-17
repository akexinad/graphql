const Post = {
    author(parent, args, { db }, info) {
        // console.log('PARENT:', parent);
        // console.log('USERS:', users);
        return db.users.find( user => user.id === parent.author );
    },

    comments(parent, args, { db }, info) {
        return db.comments.filter( comment => comment.post === parent.id )
    }
};

export { Post as default };
