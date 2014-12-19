'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.download('../../public/modules/rookie/rookie.js');
    //res.sendfile('../../public/modules/rookie/rookie.js');
};
