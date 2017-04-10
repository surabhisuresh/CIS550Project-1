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


router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Recipe Finder'});
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/sql/:num', function(req, res) {
    connection.query('SELECT title from recipes where id < '+req.params.num ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

/*router.post('/test/submit', function(req, res, next) {
    var id = req.body.id;
    res.redirect('/test/' + id);
});*/


module.exports = router;