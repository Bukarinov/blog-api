function CommentsHandler(app, db) {
    app.get('/comments', function(req, res) {
        db.all("SELECT * FROM comments", function(err, rows) {
            if (err) {
                return res.json({error: err});
            }

            res.json(rows);
        });
    });

    app.post('/comments', function(req, res) {
        db.run("INSERT INTO comments (postId, text) VALUES ($postId, $text)", {
            $postId: req.body.postId,
            $text: req.body.text
        }, function(err) {
            if (err) {
                return res.json({error: err});
            }

            res.json(this.lastID);
        });
    });

    app.get('/comments/:id', function(req, res) {
        db.get("SELECT * FROM comments WHERE id = $id", {
            $id: req.params.id
        }, function(err, row) {
            if (err) {
                return res.json({error: err});
            }

            res.json(row);
        });
    });

    app.put('/comments/:id', function (req, res) {
        db.run("UPDATE comments SET postId = $postId, text = $text WHERE id = $id", {
            $id: req.params.id,
            $postId: req.body.postId,
            $text: req.body.text
        }, function(err) {
            if (err) {
                return res.json({error: err});
            }

            db.get("SELECT * from comments WHERE id = $id", {
                $id: req.params.id
            }, function(err, row) {
                if (err) {
                    return res.json({error: err});
                }
                res.json(row);
            });
        });
    });

    app.delete('/comments/:id', function (req, res){
        db.run("DELETE FROM comments WHERE id = $id", {
            $id: req.params.id
        }, function(err) {
            if (err) {
                return res.json({error: err});
            }

            res.json({result: !!(this.changes == 1)});
        });
    });
}

module.exports = CommentsHandler;