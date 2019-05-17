const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }

        return db.users.filter( (user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        })
    },

    me() {
        return {
            id: '123asd',
            name: 'Fellini',
            email: 'qa@ws.com'
        };
    },

    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }

        return db.posts.filter( ({ title, body }) => {
            return title.toLowerCase().includes(args.query.toLowerCase()) || body.toLowerCase().includes(args.query.toLowerCase())
        })
    },

    comments(parent, args, { db }, info) {
        if (!args.query) {
            return db.comments;
        }

        return db.comments.filter( comment => comment.text.toLowerCase().includes(args.query.toLowerCase()) );
    }
};

export { Query as default };
