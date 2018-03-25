const orm = require('../models/index');
const Poster = orm.Poster;

const verifyToken = require('../verifyToken');
const verifyAdmin = require('../verifyAdmin');

module.exports = function(app){
    app.get('/posters', verifyToken, function(req, res){
        return User.all().then((users) => {
            users.map((user) => {
                delete user.dataValues.password;
                return user;
            });
            res.status(200).send(users);
        });
    });

    app.post('/posters', verifyToken, verifyAdmin, function(req, res){
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
        return Poster.destroy({where: {id: req.params.id}}).then(() => {
            res.status(200).send();
        });
    });
};
