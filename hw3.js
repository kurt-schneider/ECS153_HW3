var http = require('http'); // Import Node.js core module
var mysql = require('mysql'); // import mysql
var fs = require('fs');
const session = require('express-session');
var querystring = require('querystring');
var url = require("url");
var express = require('express');
var ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('cookieParser', 'cookieParser');
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));
app.use(session({secret:'XASDASDA'}));
/* start server */
var server = http.createServer(app);
server.listen(8000, function () {
    console.log('listening on port 8000');
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "homework",
    multipleStatements: true
});

var ssn;


/* checks if a user is 'logged in' else redirects to the login page */
function requireLogin (req, res, next) {
    ssn = req.session;
    var admin = ssn.admin;
    if(admin){
        next();
    }
    else {
        res.redirect('/login');
    }
}

/* redirects to index if logged in */
function requireNotLoggedIn(req, res, next) {
    ssn = req.session;
    var admin = ssn.admin;
    if(admin){
        res.redirect('/index');
    }
    else {
        next();
    }
}

app.get('/index', requireLogin, function(req, res){
    res.render("index.ejs");
});

/* login page */
app.get('/login', requireNotLoggedIn, function(req, res) {
    res.render('login.ejs');
});

/* logout call */
app.get('/logout', requireLogin, function(req, res) {
    req.session.destroy(function(err) {
        if(err) return console.log(err);
        else return res.redirect('/login');
    });
});

/* call to validate login */
app.post('/validate', requireNotLoggedIn, function(req, res) {
    var nam = req.body.Username.replace('1=1', '');
    var pw = req.body.Password.replace('1=1', '');
    var sql = "SELECT isAdmin from Users where password='" + pw + "' AND name='" + nam + "';";
    console.log(sql);
    con.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            return res.json({error: "Oops! An error occurred processing your request. Please try again."});
        }
        console.log(result);
        if(result && result[0] && result[0].isAdmin == true){
            ssn = req.session;
            ssn.admin = true;
            res.redirect('/index');
        }
        else {
            res.redirect('/login');
        }
    });
});

/* adds a bug report based on description */
app.post('/add_bug', requireLogin, function(req, res) {
    var des = req.body.description;
    var sql = "Insert into Bugs(description) values('" + des + "');";
    con.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            return res.json({error: "Oops! An error occurred processing your request. Please try again."});
        }
        else return res.json({});
    });
});

/* table contents page */
app.get('/bugs', requireLogin, function (req, res) {
    res.redirect("/table?tablename=Bugs");
});

app.get('/table', requireLogin, function(req, res){
    var table = req.query.tablename;
    var sql = "SELECT * from " + table + ";";
    con.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            return res.json({error: "Oops! An error occurred processing your request. Please try again."});
        }
        res.render('table.ejs', {data: result});
    });
});

app.get("*", function(req, res){
    res.redirect("/login");
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

