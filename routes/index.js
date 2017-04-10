var express = require('express');
var router = express.Router();
var path = require('path');

//Connect to MySQL
var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'x',
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

/*router.post('/test/submit', function(req, res, next) {
    var id = req.body.id;
    res.redirect('/test/' + id);
});*/


module.exports = router;