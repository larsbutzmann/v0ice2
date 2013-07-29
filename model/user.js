var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    email: {type: String, default: ''},
    signup_date: {type: Date, default: Date.now}
});

// adds username und password
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
