const localStratergy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('./database');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports = (passport) => {
    passport.use(new localStratergy(function(username, password, done){
        //match username
        let query = {username: username};
        User.findOne(query, (err,user) => {
            if(err)
            {
                throw err;
            }
            if(!user)
            {
                return done(null, false, {message: 'No user found'});
            }

            //match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch)
                {
                    return done(null, user);
                }
                else
                {
                    return done(null, false, {message: 'Password is not correct.'});
                }
            });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}