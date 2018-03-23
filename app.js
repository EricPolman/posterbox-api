const express = require('express');
const _ = require('lodash');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt   = require('bcrypt');
require('dotenv').config()

const app = express();

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        charset  : 'utf8'
    }
});
var bookshelf = require('bookshelf')(knex);
var User = bookshelf.Model.extend({
    tableName: 'users'
});
var Poster = bookshelf.Model.extend({
    tableName: 'posters'
});


var jwt    = require('jsonwebtoken');
var saltRounds = 10;
app.set('superSecret', process.env.SECRET);

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.where('email',email).fetch()
            .then((user) => {
                user = user.attributes;
                console.log(email);
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
    }
));
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
    User.where('id', id).then(function (admin) {
        done(null, admin)
    })
});
app.use(passport.initialize());

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
        User.where('id',req.user.id).fetch().then((response) => {
            const payload = {
                user: response
            };

        var token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 60*60*24// expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
            success: true,
            token: token
        });
    });
    });

// Image POST handler.
app.post("/images", function (req, res) {
    upload_image(req, function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }

        data.link = req.protocol + '://' + req.get('hostname') + data.link;
        res.send(data);
    });
});

var secureRoutes = express.Router();
app.use(secureRoutes);
app.listen(3000, () => {
    console.log("Listening");
});
