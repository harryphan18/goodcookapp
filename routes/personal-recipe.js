
let multer = require("multer");
let path = require("path");

module.exports = function(app, connection, queryAsync) {
    //
    // ==================================================
    // ======================== Công thức cá nhân ==========================
    // ==================================================
    var user_role = 0;

    /* Xử lý upload file */
    // Set The Storage Engine
    const storage = multer.diskStorage({
        destination: './public/images/',
        filename: function(req, file, cb){
            let filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
            // cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

// Init Upload
    const upload = multer({
        storage: storage,
        limits:{fileSize: 100000000},
        fileFilter: function(req, file, cb){
            checkFileType(file, cb);
        }
    }).single('myImage');

// Check File Type
    function checkFileType(file, cb){
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if(mimetype && extname){
            return cb(null,true);
        } else {
            cb('Error: Images Only!');
        }
    }
    app.post('/my/recipes', isLoggedIn, (req, res) => {
        upload(req, res, (err) => {
            if(err){
                res.render('add-recipe', {
                    msg: err,
                    user: req.user
                });
            } else {
                if(req.file == undefined){
                    res.render('add-recipe', {
                        msg: 'Error: No File Selected!',
                        user: req.user
                    });
                } else {
                    res.render('add-recipe', {
                        msg: 'File Uploaded!',
                        file: `../public/images/${req.file.filename}`,
                        user: req.user,
                    });
                }
            }
        });
    });
    app.post('/profile/edit', isLoggedIn, (req, res) => {
        upload(req, res, (err) => {
            if(err){
                res.render('profile_edit', {
                    msg: err,
                    user: req.user
                });
            } else {
                if(req.file == undefined){
                    res.render('profile_edit', {
                        msg: 'Error: No File Selected!',
                        user: req.user
                    });
                } else {
                    res.render('profile_edit', {
                        msg: 'File Uploaded!',
                        file: `../public/images/${req.file.filename}`,
                        user: req.user,
                    });
                }
            }
        });
    });

};

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect(303, '/login');
}

