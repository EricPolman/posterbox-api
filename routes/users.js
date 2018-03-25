const orm = require('../models/index');
const sequelize = orm.sequelize;
const User = orm.User;
const bcrypt = require('bcrypt');
const uuid = require('uuid');

var verifyToken = require('../verifyToken');
var verifyAdmin = require('../verifyAdmin');

module.exports = function(app){
    app.get('/users', verifyToken, verifyAdmin, function(req, res){
        return User.all().then((users) => {
            users.map((user) => {
                delete user.dataValues.password;
                return user;
            });
            res.status(200).send(users);
        });
    });

    app.post('/users', verifyToken, verifyAdmin, function(req, res){
        var saltRounds = 10;
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(req.body.password, salt);

        return User.create({
            name: req.body.name,
            email: req.body.email,
            role: 'customer',
            password: hash,
        }).then(user => {
            delete user.dataValues.password;
            res.status(200).send(user)
        });
    });

    app.delete('/users/:id', verifyToken, verifyAdmin, function(req, res){
        console.log(req.params);
        return User.destroy({where: {id: req.params.id}}).then(() => {
            res.status(200).send();
        });
    });

    app.patch('/users/:id', verifyToken, verifyAdmin, function(req, res){
        var id = req.params.id;
        return User.find({where: {id: id}}).then(user => {
            if(req.body.password) {
                var saltRounds = 10;
                var salt = bcrypt.genSaltSync(saltRounds);
                var hash = bcrypt.hashSync(req.body.password, salt);
                req.body.password = hash;
            }
            return user.update(req.body).then((user) => {
                res.status(200).send(user);
            })
        });

    });

}