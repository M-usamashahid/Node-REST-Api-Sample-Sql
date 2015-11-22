

var express         = require('express');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var errorhandler    = require('errorhandler');
var fs              = require('fs');

var config                  = require('./config/global'); // get our config file
var models                  = require ('./models');
var model                   = require('./models/index');
var ImgNum = 0;

var app            = express();

app.set('port', process.env.PORT || 8000);
app.use(morgan('dev')); 					// log every request to the console
/*app.use(bodyParser()); */
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(methodOverride()); 					// simulate DELETE and PUT
app.use(express.static(__dirname + '/static'));

if ('development' == app.get('env')) {
    app.use(errorhandler());
}



app.post('/register', function(req, res){

    var isValidEMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(req.body.e_mail);
    if(!isValidEMail){
        res.send({status: false, message : 'Invalid Email Address '});
        return;
    }
    ImgNum++;
    req.body.image = req.body.image.replace(/^data:image\/jpeg+;base64,/, "");
    req.body.image = req.body.image.replace(/ /g, '+');

    fs.writeFile('./static/images/img'+ ImgNum +'.jpeg', req.body.image, 'base64', function(err) {
        console.log(err);
    });

    console.log("Going to Save User");
    var newUser            = {};

    newUser.f_name    = req.body.f_name;
    newUser.l_name    = req.body.l_name;
    newUser.e_mail    = req.body.e_mail;
    newUser.mobile    = req.body.mobile;
    newUser.img_url   = '/images/img'+ ImgNum +'.jpeg';

    model.User
        .create(newUser)
        .then(function(data, err) {
            if(err){
                console.log("Operation failed, error in saving new Profile in DB");
                console.log(err);
                res.send({status: false, message : "Operation failed, error in saving new Profile in DB", errObj : err});
            } else {
                console.log(data)
                res.send({f_name : data.f_name, l_name : data.l_name, cust_id : data.id, img_url : 'http://'+req.headers.host+''+data.img_url });
            }
        });
});

app.get("/get", function(req, res){
    res.send("<h1>Hello</h1>");
});

models.sequelize.sync ({force:true}).then (function () {
    var server = app.listen (app.get ('port'), function () {
        console.log('Express server listening on port ' + server.address ().port);
    });
});

module.exports = app;
