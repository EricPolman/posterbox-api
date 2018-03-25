require('dotenv').config()
const express = require('express');
const app = express();

var jwt    = require('jsonwebtoken');
app.set('superSecret', process.env.SECRET);

var passport = require('passport');
require('./config/passport.config')(passport);
app.use(passport.initialize());

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PATCH, POST, GET, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        delete req.user.password;

        const payload = {
            user: req.user
        };

        var token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 60*60*24// expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
            success: true,
            token: token
        });
    }
);

const userRoutes = require('./routes/users')(app);
const postersRoutes = require('./routes/posters')(app);
const filesRoutes = require('./routes/files')(app);

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
