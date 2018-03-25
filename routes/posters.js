const orm = require('../models/index');
const Poster = orm.Poster;

const verifyToken = require('../verifyToken');
const verifyAdmin = require('../verifyAdmin');

module.exports = function(app){
    app.get('/posters', verifyToken, function(req, res){
        if(req.user.role === 'admin') {
            return Poster.all().then((posters) => {
                res.status(200).send(posters);
            });
        } else {
            return Poster.all({where: {customerId: req.user.id}}).then((posters) => {
                res.status(200).send(posters);
            });
        }
    });

    app.post('/posters', verifyToken, verifyAdmin, function(req, res){
        return Poster.create({
            title: req.body.title,
            tags: req.body.tags,
            thumbnail: req.body.thumbnail,
            files: req.body.files,
            customerId: req.body.customerId
        }).then(poster => {
            res.status(200).send(poster)
        });
    });

    app.delete('/posters/:id', verifyToken, verifyAdmin, function(req, res){
        return Poster.destroy({where: {id: req.params.id}}).then(() => {
            res.status(200).send();
        });
    });
};
