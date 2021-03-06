const filmapi = require('./filmapi');
const channelapi = require('./channelapi');

const List = require('../models/list');

let findById = function(id, callback){
    List.findOne({ _id: id })
    .populate('_owner')
    .populate('_films')
    .exec(function(error, list){
        if(error)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);

        callback(null, list);
    });
}

let add = function(list, callback){
    new List({
        _owner: list.owner,
        _is_open: list.is_open,
        _name: list.name,
        _films: list.films
    }).save(function(error, slist){
        if (error) return callback(error, null);

        channelapi.addList(list.owner, slist._id, function(error){
            if(error) return callback(error, null);

            return callback(null, slist);
        });
    });
}

let addAndSave = function(list, filmid, callback) {
    add(list, function(error, list){
        if(error) return callback(error, null);
        addToList(list._id, filmid, function(error, list){
            if(error) return callback(error, null);
            callback(null, list);
        });
    });
}

let remove = function(id, callback){
    List.remove({ _id: id }, function(error){
        if(error) return callback(error);
        callback(null);
    });
}

let addToList = function(listId, filmId, callback){
    filmapi.add(filmId, function(error, film){
        if(error)
            callback(error, null);

        List.findOneAndUpdate(
            { _id: listId },
            { $addToSet: { '_films': filmId } },
            { new: true }
        ).populate('_films')
        .exec(function(error, list){
            if(error)
                return callback(error, null);
            if(!list)
                return callback(new Error('List not found'), null);

            callback(null, list);
        });
    });
}

let removeFromList = function(listId, filmId, callback){
    List.findOneAndUpdate(
        { _id: listId },
        { $pull: { '_films': filmId } },
        { new: true }
    ).populate('_films')
    .exec(function(error, list){
        if(error)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);

        callback(null, list);
    });
}

module.exports.findById = findById;
module.exports.add = add;
module.exports.addAndSave = addAndSave;
module.exports.addToList = addToList;
module.exports.removeFromList = removeFromList;
