// app/routes.js
module.exports = function(app, passport) {

    var mysql   = require('mysql');
    var Promise = require('bluebird');

    var dbconfig = require('../config/database');
    var connection = mysql.createConnection(dbconfig.connection);
    var queryAsync = Promise.promisify(connection.query.bind(connection));
    connection.connect();

    require('./profile')(app, connection, queryAsync);
    require('./recipe')(app, connection, queryAsync);
    require('./personal-recipe')(app, connection, queryAsync);

    // =====================================
    // Trang chủ ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); //
    });
    // Query dữ liệu =========================
    app.get('/allrecipes', function (req, res) {
        var numRows;
        var numPerPage = parseInt(req.query.pagelimit, 10) || 10;
        var page = parseInt(req.query.page) || 0;
        var numPages;
        var skip = page * numPerPage;
        var limit = skip + ',' + numPerPage;

        queryAsync('SELECT count(*) as numRows FROM recipes')
            .then(function(results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                //console.log('number of pages:', numPages);
            })
            .then(function(results) {
                var responsePayload = {results: results};
                connection.query('SELECT r.*, CONCAT(ua.firstname, " ", ua.lastname) AS author_name, ua.avatar FROM recipes r INNER JOIN user_accounts ua ON r.author_id=ua.id ORDER BY r.recipe_id', function (err, results) {
                // connection.query('SELECT * FROM recipes LIMIT ' + limit, function (err, results) {
                    if (page < numPages) {
                        responsePayload.pagination = {
                            data: results,
                            page: page+1,
                            pagelimit: numPerPage,
                            fetched: (page+1)*numPerPage < numRows ? numPerPage : numRows - page*numPerPage,
                            totalRecord: numRows
                        };
                    }
                    res.send({mydata: responsePayload.pagination});
                });
            });
    });

    // =====================================
    // Đăng nhập ===============================
    // =====================================
    // hiển thị form đăng nhập
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/my/about-me',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // =====================================
    // Đăng ký ==============================
    // =====================================
    // hiển thị form đăng ký
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // Xử lý form đăng ký ở đây
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/my/about-me', // Điều hướng tới trang hiển thị profile
        failureRedirect : '/signup', // Trở lại trang đăng ký nếu lỗi
        failureFlash : true
    }));

    // =====================================
    // Đăng xuất ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    // =====================================
    // Về chúng tôi ==============================
    // =====================================
    app.get('/about', function(req, res, next) {
        res.render('about');
        // , {
        //     id: req.user.id,
        // });
    });

    // =====================================
    // Tin tức ==============================
    // =====================================
    app.get('/news', function(req, res, next) {
        res.render('news');
    });

    app.get('/search/results/:keyword', function(req, res, next) {
        var keyword = req.params.keyword;
        var numRows;
        var numPerPage = parseInt(req.query.pagelimit, 10) || 10;
        var page = parseInt(req.query.page) || 0;
        var numPages;
        var skip = page * numPerPage;
        var limit = skip + ',' + numPerPage;

        queryAsync('SELECT COUNT(*) as numRows FROM recipes r WHERE r.search_index LIKE "%' + keyword + '%"')
            .then(function(results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                //console.log('number of pages:', numPages);
            })
            .then(function(results) {
                var responsePayload = {results: results};
                var sql ='SELECT * FROM recipes r WHERE r.search_index LIKE "%' + keyword + '%"';
                connection.query(sql, function (err, results) {
                    // connection.query('SELECT * FROM recipes LIMIT ' + limit, function (err, results) {
                    if (page < numPages) {
                        responsePayload.pagination = {
                            data: results,
                            page: page+1,
                            pagelimit: numPerPage,
                            fetched: (page+1)*numPerPage < numRows ? numPerPage : numRows - page*numPerPage,
                            totalRecord: numRows
                        };
                    }
                    res.send({mydata: responsePayload.pagination});
                });
            });
    });

};

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}