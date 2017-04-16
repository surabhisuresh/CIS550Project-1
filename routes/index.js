var express = require('express');
var router = express.Router();
var path = require('path');

//Connect to MySQL
var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'dbcluster.cluster-cmscsvr5od93.us-east-1.rds.amazonaws.com',
    user     : 'group11',
    password : 'funkymonkey123*',
    database : 'RecipeData'
});
connection.connect();

//HOME PAGE
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Recipe Finder'});
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

//SIGN-IN PAGE
router.get('/signIn', function(req, res, next) {
    res.render('signIn');
    //res.sendFile(path.join(__dirname, '../', 'views', 'signIn.html'));
});

//SIGN-UP Page
router.get('/signUp', function(req, res, next) {
    res.render('signUp');
    //res.sendFile(path.join(__dirname, '../', 'views', 'signUp.html'));
});

//ADMIN Page
router.get('/admin_recipe', function(req, res, next) {
    res.render('admin_recipe');
    //res.sendFile(path.join(__dirname, '../', 'views', 'admin_recipe.html'));
});

//USER Page

router.get('/user', function(req, res, next) {
    res.render('user');
    //res.sendFile(path.join(__dirname, '../', 'views', 'user.html'));
});

//Validate User
router.get('/validate/:creden', function(req, res) {
    console.log("Inside index");
    var creds = req.params.creden.split('&');
    connection.query('SELECT IsAdmin from Users where Login="'+creds[0]+'" AND Password ="'+creds[1]+'" ' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

router.get('/get_recipes', function(req, res) {
    console.log("Inside recipes");
    connection.query('SELECT * from Recipes r join HasIngr h on h.ID=r.ID LIMIT 100' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

//SEARCH BY KEYWORD
router.get('/searchByKey/:key', function(req, res) {
    connection.query('SELECT ID,Title from Recipes where Title like "%'+req.params.key+'%"' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

//SEARCH BY CATEGORY
router.get('/get_cat', function(req, res) {
    connection.query('SELECT distinct(Category) from Recipes' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);

    });

});

router.get('/searchByCat/:cat', function(req, res) {
    connection.query('SELECT ID,Title from Recipes where Category = "'+ req.params.cat+'"' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

//SEARCH BY INGREDIENT
router.get('/searchByIngr/:istr', function(req, res) {
    var ingredients = req.params.istr.split('&');
    var query = 'SELECT distinct(r.ID), r.Title from Recipes r join HasIngr h on h.ID = r.ID where exists( select 1 from HasIngr h2 where h2.Ingredient like "%'+ingredients[0]+'%" and h2.ID=r.ID) ';
    if (ingredients[1]!='')
    {
        query += ' and exists( select 1 from HasIngr h2 where h2.Ingredient like "%'+ingredients[1]+'%" and h2.ID=r.ID) ';
        if (ingredients[2]!='')
        {
            query += ' and exists( select 1 from HasIngr h2 where h2.Ingredient like "%'+ingredients[2]+'%" and h2.ID=r.ID) ';
        }
    }
    connection.query( query,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

//VIEW RECIPE
router.get('/viewRecipe/:id', function(req, res) {
    //res.sendFile(path.join(__dirname, '../', 'views', 'recipe_info.html'), {test: 'hu'});
    connection.query('SELECT * from Recipes r join HasIngr h on h.ID=r.ID  where r.ID = '+req.params.id ,function (err, rows, fields) {
        if (err) throw err;
        //res.json(rows);
        res.render('recipe_info', {results: rows});
    });

});

/*router.post('/test/submit', function(req, res, next) {
 var id = req.body.id;
 res.redirect('/test/' + id);
 });*/


module.exports = router;