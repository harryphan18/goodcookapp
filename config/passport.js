// config/passport.js
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM user_accounts WHERE id = ? ", [id],
            function(err, rows){
                done(err, rows[0]);
            });
    });

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM user_accounts WHERE email=?", [email], function (err, rows) {
                if(err) return done(err);
                if(!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No User Found'));
                }
                else if(!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Wrong Password'));

                return done(null, rows[0]);
            })
        }));


    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            connection.query("SELECT * FROM user_accounts WHERE email=?", [email], function(err, rows){
                if(err) return done(err);
                if(rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                }
                else {
                    var newUser = {
                        email: email,
                        password: bcrypt.hashSync(password, null, null)
                    };
                    var insertQuery = "INSERT INTO user_accounts (email, password) VALUES (?, ?)";
                    connection.query(insertQuery, [newUser.email, newUser.password], function (err, rows) {
                        newUser.id = rows.insertId;
                        return done(null, newUser);
                    })
                }
            })
        }));

};
