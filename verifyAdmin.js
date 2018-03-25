var jwt = require('jsonwebtoken');
require('dotenv').config()

function verifyAdmin(req, res, next) {
    var isAdmin = req.user.role  === 'admin';

    if(isAdmin) {
        next();
    } else {
        return res.status(403).send({ auth: false, message: 'Not an admin.' });
    }
}
module.exports = verifyAdmin;