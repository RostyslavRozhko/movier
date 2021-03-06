const express = require('express');
const router = express.Router();
const filmapi = require('../controllers/filmapi');
const listapi = require('../controllers/listapi');
const channelapi = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    filmapi.getFromKP(req.params.id, function(error, film){
        if(error)
            return next(error);

        if(req.session.channel){
            channelapi.findById(req.session.channel, function(error, channel){
                if(error)
                    next(error);
                channel._password = null;
                res.render('film', { film: film, authch: channel});
            });
        } else {
            res.render('film', { film : film });
        }
    });
});

//add film to list
router.post('/:id/tolist/:listid', function(req, res, next) {
    listapi.addToList(req.params.listid, req.params.id, function(error, list){
        if(error)
            return next(error);

        res.send('okay');
    });
});

//remove film from list
router.post('/:id/fromlist/:listid', function(req, res, next){
    listapi.removeFromList(req.params.listid, req.params.id, function(error, list){
        if(error)
            return next(error);

        res.send(list);
    });
});

module.exports = router;
