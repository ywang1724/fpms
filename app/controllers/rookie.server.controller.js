'use strict';

/**
 * Module dependencies.
 */
exports.index = function (req, res) {
    var options = {
        root: 'public/modules/rookie/',
        dotfiles: 'allow',
        headers: {
            'Content-Type': 'text/javascript; charset=UTF-8',
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile('rookie.js', options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        } else {
            console.log('Sent:', 'rookie.js');
        }
    });
};
