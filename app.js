var express = require('express'),
    app = express(),
    ErrorHandler = require('./routes/error').errorHandler,
    postsHandler = require('./routes/posts'),
    commentsHandler = require('./routes/comments'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(':memory:');

db.serialize(function() {
    "use strict";

    db.run("CREATE TABLE posts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), description TEXT)");
    db.run("CREATE TABLE comments (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, post_id INTEGER, text TEXT)");

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(ErrorHandler);

    postsHandler(app, db);
    commentsHandler(app, db);

    app.listen(3001, function() {
        console.log('Blog API server listening on port 3001');
    });
});

//db.close();