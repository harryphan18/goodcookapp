module.exports = function(app, connection, queryAsync) {

    app.put('/recipe/user-review/save-review', isLoggedIn, function (req, res) {
        // var id = req.body.recipe_id;
        var sql = 'INSERT INTO recipe_review (`recipe_id`, `comment`, `rate`, `authors_reviews_id`) VALUES ' +
            '("' + req.body.recipe_id + '", ' +
            '"' + req.body.comment + '", ' +
            '"' + req.body.rate + '", ' +
            '"' + req.user.id +
            '")';
        // console.log(req.user.id);
        connection.query(sql, function (err) {
            if(err){
                console.log(err.message);
            }
            else{
                console.log("Added successfully!");
                res.render('about');
                // res.redirect(303, '/about');
                // sql = 'SELECT r.*, ua.avatar ' +
                //     'FROM recipes r INNER JOIN user_accounts ua ON r.author_id=ua.id ' +
                //     'WHERE recipe_id=' + req.body.recipe_id;
                // connection.query(sql, function (err, results) {
                //     console.log("hihihih");
                //     res.render('recipe', {
                //         recipe: results[0]
                //     });
                // });
                // res.redirect(303, '/recipe/' + req.body.recipe_id + '#recipe-reviews');
            }
        });
    });

    app.get('/recipe/reviews/:recipe_id', isLoggedIn, function(req, res) {
        var id = req.params.recipe_id;
        console.log(id + " ahihi");
        res.render('recipe-reviews.ejs', {
            recipe_id: id,
        });
    });
    app.get('/recipe/photos/:recipe_id', function(req, res) {
        var id = req.params.recipe_id;
        console.log(id + " ahihi");
        connection.query('SELECT * FROM recipes WHERE recipe_id=' + id, function (err, results) {
            res.render('recipe-photos.ejs', {
                title: 'Recipe',
                recipe_id: results[0].recipe_id,
                name: results[0].name,
                photo: results[0].photo,
                rating_star_photo: results[0].rating_star_photo,
                time: results[0].time,
                serving: results[0].serving,
                level: results[0].level,
                post_date: results[0].post_date,
                last_update: results[0].last_update,
                author_id: results[0].author_id,
                reviews: results[0].reviews,
            });
        });
    });
    // =====================================
    // Công thức ==============================
    // =====================================
    app.get('/recipe/:recipe_id', function(req, res, next) {
        var id = req.params.recipe_id;
        // console.log(id);
        var user_role=0;
        if (req.isAuthenticated())
            user_role = req.user.role;
        var sql = 'SELECT r.*, CONCAT(ua.firstname, " ", ua.lastname) AS author_name, ua.avatar ' +
            'FROM recipes r INNER JOIN user_accounts ua ON r.author_id=ua.id ' +
            'WHERE recipe_id=' + id;
        connection.query(sql, function (err, results) {
            res.render('recipe.ejs', {
                recipe: results[0],
                user_role: user_role
            });
        });
    });

    app.get('/recipe/allreviews/:recipe_id', function (req, res) {
        var recipe_id = req.params.recipe_id;
        console.log(recipe_id);
        var numRows;
        var numPerPage = parseInt(req.query.pagelimit, 10) || 10;
        var page = parseInt(req.query.page) || 0;
        var numPages;
        var skip = page * numPerPage;
        var limit = skip + ',' + numPerPage;

        var sql = 'SELECT rr.* , CONCAT(uc.firstname, " ", uc.lastname) AS authors_fullname, uc.avatar\n' +
            'FROM recipe_review rr INNER JOIN user_accounts uc ON rr.authors_reviews_id=uc.id\n' +
            'WHERE rr.recipe_id=' + recipe_id + ' ORDER BY rr.review_date DESC';
        queryAsync('SELECT count(*) as numRows FROM recipe_review WHERE recipe_id=' + recipe_id)
            .then(function(results) {
                numRows = results[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                //console.log('number of pages:', numPages);
            })
            .then(function(results) {
                var responsePayload = {results: results};
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

    app.put('/save/recipe/:recipe_id', isLoggedIn, function (req, res) {
        var recipe_id = req.params.recipe_id;
        var sql = 'INSERT INTO user_recipes (`recipe_id`, `user_id`, `is_favourite`) VALUES (' + recipe_id + ', ' + req.user.id+ ', ' + "1" + ')';
        connection.query(sql, function (err, result) {
            console.log("Added successfully! ec ec");
        })
    });
}

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect(303, '/login');
}