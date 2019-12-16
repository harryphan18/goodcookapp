
module.exports = function(app, connection, queryAsync) {
    // =====================================
    // Profile user =====================
    // =====================================
    var user_role=0;
    app.get('/my/about-me', isLoggedIn, function(req, res) {
        user_role = 2;
        res.render('profile-aboutme.ejs', {
            user : req.user,
            user_role: user_role
        });
    });

    app.get('/my/favourites', isLoggedIn, function(req, res) {
        user_role = 2;
        res.render('favourites.ejs', {
            user : req.user,
            user_role: user_role
        });
    });

    app.get('/my/friends', isLoggedIn, function(req, res) {
        user_role = 2;
        res.render('friends.ejs', {
            user : req.user,
            user_role: user_role
        });
    });

    app.get('/my/collections', isLoggedIn, function(req, res) {
        user_role = 2;
        res.render('collections.ejs', {
            user : req.user,
            user_role: user_role
        });
    });

    app.get('/my/recipes', isLoggedIn, function(req, res) {
        user_role = 2;
        res.render('personal-recipes.ejs', {
            user : req.user,
            user_role: user_role
        });
    });

    app.get('/my/add-recipe', isLoggedIn, function(req, res) {
        user_role = 2;
        res.render('add-recipe', {
            user: req.user,
            user_role: user_role
        }); //
    });

    app.get('/all-my-favourites', isLoggedIn, function (req, res) {
        var numRows;
        var numPerPage = parseInt(req.query.pagelimit, 10) || 10;
        var page = parseInt(req.query.page) || 0;
        var numPages;
        var skip = page * numPerPage;
        var limit = skip + ',' + numPerPage;

        queryAsync('SELECT count(*) as numRows FROM user_recipes WHERE user_id=' + req.user.id + ' AND is_favourite=1')
            .then(function(results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                //console.log('number of pages:', numPages);
            })
            .then(function(results) {
                var responsePayload = {results: results};
                var sql ='SELECT r.*, CONCAT(ua.firstname, " ", ua.lastname) AS author_name, ua.avatar ' +
                    'FROM recipes r INNER JOIN user_recipes ur ON r.recipe_id=ur.recipe_id ' +
                    'INNER JOIN user_accounts ua ON r.author_id=ua.id ' +
                    'WHERE ur.is_favourite=1 and ur.user_id=' + req.user.id;
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
                    console.log(responsePayload.pagination);
                    res.send({mydata: responsePayload.pagination});
                });
            });
    });

    app.get('/all-my-recipes', isLoggedIn, function (req, res) {
        var numRows;
        var numPerPage = parseInt(req.query.pagelimit, 10) || 10;
        var page = parseInt(req.query.page) || 0;
        var numPages;
        var skip = page * numPerPage;
        var limit = skip + ',' + numPerPage;

        queryAsync('SELECT COUNT(*) as numRows FROM user_recipes WHERE user_id=' + req.user.id)
            .then(function(results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                //console.log('number of pages:', numPages);
            })
            .then(function(results) {
                var responsePayload = {results: results};
                var sql ='SELECT r.*, CONCAT(ua.firstname, " ", ua.lastname) AS author_name, ua.avatar ' +
                    'FROM recipes r INNER JOIN user_recipes ur ON r.recipe_id=ur.recipe_id ' +
                    'INNER JOIN user_accounts ua ON r.author_id=ua.id ' +
                    'WHERE ur.is_posted=1 and ur.user_id=' + req.user.id;
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

    app.put('/my/add-recipe/save-recipe', isLoggedIn, function (req, res) {
        var sql = 'INSERT INTO recipes (`name`, `description`, `ingredients`, `directions`, ' +
            '`photo`, `cook_time`, `prep_time`, `num_of_servings`, `nutri_facts`, `notes`, `author_id`) VALUES ' +
            '("' + req.body.name + '", "' +
            req.body.description + '", "' +
            req.body.ingredients + '", "' +
            req.body.directions + '", "' +
            req.body.photo + '", "' +
            req.body.cook_time + '", "' +
            req.body.prep_time + '", "' +
            req.body.num_of_servings + '", "' +
            req.body.nutri_facts + '", "' +
            req.body.notes + '", "' +
            req.user.id + '")';

        // console.log(req.user.id);
        connection.query(sql, function (err) {
            if(err){
                console.log(err.message);
            }
            else{
                // console.log(req.user);
                console.log("Added successfully!");
                // alert("Thêm công thức thành công! Xem trong Công thức của tôi");
                res.redirect(303, '/my/add-recipe');
            }
        });
    });

    //========================Author UI==========================
    //========================Author UI==========================
    //========================Author UI==========================
    app.get('/cook/about/:author_id', function(req, res) {
        var id = req.params.author_id;
        if (req.isAuthenticated())
            user_role = 1;
        connection.query('SELECT * FROM user_accounts WHERE id=' + id, function (err, results) {
            res.render('profile-aboutme.ejs', {
                user: results[0],
                user_role: user_role
            });
        });
    });
    app.get('/cook/friends/:author_id', function(req, res) {
        var id = req.params.author_id;
        if (req.isAuthenticated())
            user_role = 1;
        connection.query('SELECT * FROM user_accounts WHERE id=' + id, function (err, results) {
            res.render('friends.ejs', {
                user: results[0],
                user_role: user_role
            });
        });
    });

    app.get('/cook/collections/:author_id', function(req, res) {
        var id = req.params.author_id;
        if (req.isAuthenticated())
            user_role = 1;
        connection.query('SELECT * FROM user_accounts WHERE id=' + id, function (err, results) {
            res.render('collections.ejs', {
                user: results[0],
                user_role: user_role
            });
        });
    });
    app.get('/cook/favourites/:author_id', function(req, res) {
        var id = req.params.author_id;
        if (req.isAuthenticated())
            user_role = 1;
        connection.query('SELECT * FROM user_accounts WHERE id=' + id, function (err, results) {
            // console.log(results[0].avatar + ' ec ecs');
            res.render('favourites.ejs', {
                user: results[0],
                user_role: user_role
            });
        });
    });
    app.get('/cook/recipes/:author_id', function(req, res) {
        var id = req.params.author_id;
        if (req.isAuthenticated())
            user_role = 1;
        connection.query('SELECT * FROM user_accounts WHERE id=' + id, function (err, results) {
            res.render('personal-recipes.ejs', {
                user: results[0],
                user_role: user_role
            });
        });
    });
    app.get('/cook/all-recipes/:author_id', function (req, res) {
        var id = req.params.author_id;
        var numRows;
        var numPerPage = parseInt(req.query.pagelimit, 10) || 10;
        var page = parseInt(req.query.page) || 0;
        var numPages;
        var skip = page * numPerPage;
        var limit = skip + ',' + numPerPage;

        queryAsync('SELECT COUNT(*) as numRows FROM user_recipes WHERE user_id=' + id)
            .then(function(results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                //console.log('number of pages:', numPages);
            })
            .then(function(results) {
                var responsePayload = {results: results};
                var sql ='SELECT r.*, CONCAT(ua.firstname, " ", ua.lastname) AS author_name, ua.avatar ' +
                    'FROM recipes r INNER JOIN user_recipes ur ON r.recipe_id=ur.recipe_id ' +
                    'INNER JOIN user_accounts ua ON r.author_id=ua.id ' +
                    'WHERE ur.is_posted=1 and ur.user_id=' + id;
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
    app.get('/cook/all-favourites/:author_id', function (req, res) {
        var id = req.params.author_id;
        console.log(id + 'ec ec ec');
        var numRows;
        var numPerPage = parseInt(req.query.pagelimit, 10) || 10;
        var page = parseInt(req.query.page) || 0;
        var numPages;
        var skip = page * numPerPage;
        var limit = skip + ',' + numPerPage;

        queryAsync('SELECT count(*) as numRows FROM user_recipes WHERE is_favourite=1 AND user_id=' + id)
            .then(function(results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                //console.log('number of pages:', numPages);
            })
            .then(function(results) {
                var responsePayload = {results: results};
                var sql ='SELECT r.*, CONCAT(ua.firstname, " ", ua.lastname) AS author_name, ua.avatar ' +
                    'FROM recipes r INNER JOIN user_recipes ur ON r.recipe_id=ur.recipe_id ' +
                    'INNER JOIN user_accounts ua ON r.author_id=ua.id ' +
                    'WHERE ur.is_favourite=1 and ur.user_id=' + id;
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
                    console.log(responsePayload.pagination);
                    res.send({mydata: responsePayload.pagination});
                });
            });
    });
    app.get('/cook/all-friends/:author_id', function (req, res) {
        var id = req.params.author_id;
        var numRows;
        var numPerPage = parseInt(req.query.pagelimit, 10) || 10;
        var page = parseInt(req.query.page) || 0;
        var numPages;
        var skip = page * numPerPage;
        var limit = skip + ',' + numPerPage;

        queryAsync('SELECT count(*) FROM user_friends WHERE user_id=' + id)
            .then(function(results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                //console.log('number of pages:', numPages);
            })
            .then(function(results) {
                var responsePayload = {results: results};
                var sql ='SELECT * FROM user_friends WHERE user_id=' + id;
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
                    console.log(responsePayload.pagination);
                    res.send({mydata: responsePayload.pagination});
                });
            });
    });
    app.get('/my-all-friends', isLoggedIn, function (req, res) {
        var sql ='SELECT * FROM user_friends WHERE user_id=' + req.user.id;
        connection.query(sql, function (err, results) {
            res.send({mydata: results});
        });
    });

// =====================================
// Quản lý tài khoản =====================
// =====================================
    app.get('/profile/edit', isLoggedIn, function (req, res) {
        res.render('profile_edit.ejs', {
            user: req.user // truyền đối tượng user cho profile-aboutme.ejs để hiển thị lên view
        });
    });
    app.put('/profile/edit/update', isLoggedIn, function (req, res) {
        var sql = 'UPDATE user_accounts SET email=' + '"' + req.body.email +
                                        // "', password='" + req.body.password +
                                        '", firstname="' + req.body.firstname +
                                        '", lastname="' + req.body.lastname +
                                        '", avatar="' + req.body.avatar +
                                        '", introduction="' + req.body.introduction +
                                        '", numbers="' + req.body.numbers +
                                        '", facebook="' + req.body.facebook +
                                        '", instagram="' + req.body.instagram +
                                        '" WHERE id=' + req.user.id;


        connection.query(sql, function (err) {
            if(err){
                console.log(err.message);
            }
            else{
                console.log(req.user);
                console.log("Updated successfully!");
            }
        });
    });

}

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect(303, '/login');
}