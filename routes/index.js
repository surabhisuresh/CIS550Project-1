var express = require('express');
var router = express.Router();
var path = require('path');

//Connect to MySQL
var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'dbcluster.cluster-cmscsvr5od93.us-east-1.rds.amazonaws.com',
    user     : 'group11',
    password : 'funkymonkey123*',
    database : 'recipe'
});
connection.connect();

//HOME PAGE
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Recipe Finder'});
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

//SIGN-IN PAGE
router.get('/signIn', function(req, res, next) {
    //res.render('index', { title: 'Recipe Finder'});
    res.sendFile(path.join(__dirname, '../', 'views', 'signIn.html'));
});

//SIGN-UP Page
router.get('/signUp', function(req, res, next) {
    //res.render('index', { title: 'Recipe Finder'});
    res.sendFile(path.join(__dirname, '../', 'views', 'signUp.html'));
});

//ADMIN Page
router.get('/admin', function(req, res, next) {
    //res.render('index', { title: 'Recipe Finder'});
    res.sendFile(path.join(__dirname, '../', 'views', 'admin.html'));
});

//USER Page

router.get('/user', function(req, res, next) {
    //res.render('index', { title: 'Recipe Finder'});
    res.sendFile(path.join(__dirname, '../', 'views', 'user.html'));
});

//Validate User
router.get('/validate/:creden', function(req, res) {
    console.log("Inside index");
    var creds = req.params.creden.split('&');
    connection.query('SELECT role from User where Login="'+creds[0]+'" AND Password ="'+creds[1]+'" ' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

//SEARCH BY KEYWORD
router.get('/searchByKey/:key', function(req, res) {
    connection.query('SELECT title from recipes where title like "%'+req.params.key+'%"' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

//SEARCH BY CATEGORY
router.get('/get_cat', function(req, res) {
    connection.query('SELECT distinct(category) from recipes' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);

    });

});

router.get('/searchByCat/:cat', function(req, res) {
    connection.query('SELECT title from recipes where category = "'+ req.params.cat+'"' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

//SEARCH BY INGREDIENT
router.get('/searchByIngr/:istr', function(req, res) {
    var ingredients = req.params.istr.split('_');
    var query = 'SELECT title from recipes where ingredients like "%'+ingredients[0]+'%"';
    if (ingredients[1]!='')
    {
        query += ' AND ingredients like "%'+ingredients[1]+'%"';
        if (ingredients[2]!='')
        {
            query += ' AND ingredients like "%'+ingredients[2]+'%"';
        }
    }
    connection.query( query,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

/*router.post('/test/submit', function(req, res, next) {
 var id = req.body.id;
 res.redirect('/test/' + id);
 });*/


module.exports = router;