const express = require('express');
const router = express.Router();
const channelapi = require('../controllers/channelapi');
const listapi = require('../controllers/listapi');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

//log in
router.post('/', function(req, res, next) {
    channelapi.findById(req.body.login, function(error, channel){
        if(error)
            return next(error);
        if(channel._password != req.body.password)
            return next(new Error('Wrong password'));

        req.session.channel = channel._id;
        res.redirect('/channel/' + channel._id);
    });
});

//register
router.post('/new', function(req, res, next){
    let channel = {
        id: req.body.login,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        image: null,
        lists: [],
        saved_lists: []
    }

    //check if exists
    channelapi.findById(channel.id, function(error, channel){
        if(!error)
            return next(new Error('Login already exists'));

        saveImageLocally();
    });

    const path = './public/images/temp/' + channel.id + req.files.image.name;
    let file = req.files.image;

    //save image localy
    function saveImageLocally(){
        file.mv(path, function(error) {
            if (error)
                return next(error);

            saveImageToCloud();
        });
    }

    //save image to cloudinary
    function saveImageToCloud(){
        cloudinary.v2.uploader.upload(path,
            { crop : "fill", aspect_ratio: "1:1" },
            function(error, result) {
                if(error)
                    return next(error);

                channel.image = result.url;
                saveChannel();
        });
    }

    //save channel to db
    function saveChannel(){
        channelapi.add(channel, function(error, channel){
            if(error)
                return next(error);

            redirect();
        });
    }

    //save session var and redirect to channel
    function redirect(){
        req.session.channel = channel.id;
        res.redirect('/channel/' + channel.id);
    }

});

module.exports = router;
