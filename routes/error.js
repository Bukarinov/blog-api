exports.errorHandler = function(err, req, res, next) {
    "use strict";

    console.error(err.message);
    console.error(err.stack);

    res.status(500);
    res.json({error: err});
}