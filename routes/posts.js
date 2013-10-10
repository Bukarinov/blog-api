function PostsHandler(app, db) {
    app.get('/posts', function(req, res) {
        db.all("SELECT * FROM posts", function(err, rows) {
            if (err) {
                return res.json({error: err});
            }

            res.json(rows);
        });
    });

    app.post('/posts', function(req, res) {
        db.run("INSERT INTO posts (title, description) VALUES ($title, $description)", {
            $title: req.body.title,
            $description: req.body.description
        }, function(err) {
            if (err) {
                return res.json({error: err});
            }

            res.json(this.lastID);
        });
    });

    app.get('/posts/:id', function(req, res) {
        db.get("SELECT * FROM posts WHERE id = $id", {
            $id: req.params.id
        }, function(err, post) {
            if (err) {
                return res.json({error: err});
            }

            db.all("SELECT * FROM comments WHERE postId = $postId", {
                $postId: req.params.id
            }, function(err, comments) {
                if (err) {
                    return res.json({error: err});
                }

                post.comments = comments;

                res.json(post);
            });
        });
    });

    app.put('/posts/:id', function(req, res) {
        db.run("UPDATE posts SET title = $title, description = $description WHERE id = $id", {
            $id: req.params.id,
            $title: req.body.title,
            $description: req.body.description
        }, function(err) {
            if (err) {
                return res.json({error: err});
            }

            db.get("SELECT * from posts WHERE id = $id", {
                $id: req.params.id
            }, function(err, row) {
                if (err) {
                    return res.json({error: err});
                }
                res.json(row);
            });
        });
    });

    app.delete('/posts/:id', function(req, res) {
        db.run("DELETE FROM posts WHERE id = $id", {
            $id: req.params.id
        }, function(err) {
            if (err) {
                return res.json({error: err});
            }

            res.json({result: !!(this.changes == 1)});
        });
    });
}

module.exports = PostsHandler;