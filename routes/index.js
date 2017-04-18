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
router.get('/user/:login', function(req, res, next) {
    res.render('user', {login: req.params.login});
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
    connection.query('SELECT * from Recipes' ,function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });

});

//SEARCH BY KEYWORD
router.get('/searchByKey/:key', function(req, res) {
    connection.query('SELECT ID,Title from Recipes where Title like "%'+req.params.key+'%"' ,function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0)
        {
            res.json({emptymsg: 'Sorry! There are no matches.'})
        }
        else
        {
            res.json(rows);
        }

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
        if (rows.length == 0)
        {
            res.json({emptymsg: 'Sorry! There are no matches.'})
        }
        else
        {
            res.json(rows);
        }
    });

});

//VIEW RECIPE by Non-user
router.get('/viewRecipe/:id', function(req, res) {
    //res.sendFile(path.join(__dirname, '../', 'views', 'recipe_info.html'), {test: 'hu'});
    connection.query('SELECT * from Recipes r join HasIngr h on h.ID=r.ID  where r.ID = '+req.params.id ,function (err, rows, fields) {
        if (err) throw err;
        connection.query('SELECT avg(Rate) as Rate from Rates where ID = '+req.params.id ,function (err2, rows2, fields2) {
            if (err2) throw err2;
            //res.json(rows);
            console.log(rows2);
            res.render('viewRecipe', {results: rows, avgrate: rows2});
    });
    });
});

//VIEW RECIPE by User
router.get('/viewRecipeUser/:istr', function(req, res) {
    //res.sendFile(path.join(__dirname, '../', 'views', 'recipe_info.html'), {test: 'hu'});
    var info = req.params.istr.split('&');
    connection.query('SELECT * from Recipes r join HasIngr h on h.ID=r.ID  where r.ID = '+info[0] ,function (err, rows, fields) {
        if (err) throw err;
        connection.query('select ID from Favorites where Login ="'+info[1]+'" and ID = '+info[0] ,function (err2, rows2, fields2) {
            if (err2) throw err2;
            connection.query('select Rate from Rates where Login ="'+info[1]+'" and ID = '+info[0],function (err3, rows3, fields3) {
                if (err3) throw err3;
                connection.query('SELECT avg(Rate) as Rate from Rates where ID = '+info[0],function (err4, rows4, fields4) {
                    if (err4) throw err4;
                    res.render('viewRecipeUser', {results: rows, fav: rows2, rate: rows3, login: info[1], avgrate: rows4});
    });
            });
        });
    });

});

//MY ACCOUNT
router.get('/myAccount/:login', function(req, res) {
    //res.sendFile(path.join(__dirname, '../', 'views', 'recipe_info.html'), {test: 'hu'});
    connection.query('select ID, Title, Category from Recipes where Login = "'+req.params.login+'"' ,function (err1, rows1, fields1) {
        if (err1) throw err1;
        connection.query('select ID, Title, Category from Recipes where ID in (select ID from Favorites where Login ="'+req.params.login+'")' ,function (err2, rows2, fields2) {
            if (err2) throw err2;
            res.render('myAccount', {results1:rows1, results2: rows2, login: req.params.login});
        });
    });
});

//NEW RECIPE
router.get('/newRecipe/:login', function(req, res) {
    res.render('newRecipe', {login: req.params.login});
});

//ADD FAVORITE
router.get('/addFav/:istr', function(req, res) {
    var info = req.params.istr.split('&');
    connection.query('insert into Favorites values ('+info[0]+',"'+info[1]+'")' ,function (err, rows, fields) {
        if (err) throw err;
    });
    res.redirect('/viewRecipeUser/' + req.params.istr);
});

//REMOVE FAVORITE
router.get('/delFav/:istr', function(req, res) {
    var info = req.params.istr.split('&');
    connection.query('delete from Favorites where ID= '+info[0]+' and Login="'+info[1]+'"' ,function (err, rows, fields) {
        if (err) throw err;
    });
    res.redirect('/viewRecipeUser/' + req.params.istr);
});

//ADD RATING
router.post('/addRate/:istr', function(req, res) {
    var info = req.params.istr.split('&');
    var r = req.body.rating;
    connection.query('insert into Rates values ('+info[0]+',"'+info[1]+'",'+r+')' ,function (err, rows, fields) {
        if (err) throw err;
    });
    res.redirect('/viewRecipeUser/' + req.params.istr);
});

//CHANGE RATING
router.post('/updateRate/:istr', function(req, res) {
    var info = req.params.istr.split('&');
    var r = req.body.rating;
    connection.query('update Rates set Rate='+r+' where ID='+info[0]+' and Login="'+info[1]+'"' ,function (err, rows, fields) {
        if (err) throw err;
    });
    res.redirect('/viewRecipeUser/' + req.params.istr);
});

/*router.post('/test/submit', function(req, res, next) {
 var id = req.body.id;
 res.redirect('/test/' + id);
 });*/


module.exports = router;