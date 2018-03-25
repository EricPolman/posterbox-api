var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const sequelize = require('../models/index').sequelize
const User = require('../models/index').User

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function(email, password, done) {
            User.findAll({ where: {email: email} })
                .then((user) => {
                    user = user[0].dataValues;
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
}