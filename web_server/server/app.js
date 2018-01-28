let express = require('express');
let app = express();

let index = require('./routes/index');
let courses = require('./routes/courses');
let profile = require('./routes/profile');
let summery = require('./routes/summery');
let auth = require('./routes/auth');

var rpc_client = require('./rpc_client/rpc_client');

let mongoose = require('mongoose');
var passport = require('passport');

let path = require('path');
let http = require('http');
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let config = require('./config/config.json');
require('./models/main.js').connect(config.mongoDbUri);

// view engine setup
app.set('views', path.join(__dirname, '../client/build/'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

// TODO: remove this after development is done
app.all('*', function(req, res, next) {
    //Access-Control-Allow-Headers
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With");
    next();
});

// load passport strategies
app.use(passport.initialize());
let localSignupStrategy = require('./passport/signup_passport');
let localLoginStrategy = require('./passport/login_passport');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

let Pusher = require('pusher');
let pusher = new Pusher({
    appId: '333442',
    key: 'f4a5f819abf18922c4e7',
    secret: 'bbf4266f4f9469e04653',
    cluster : "mt1",
    encrypted: true
});

app.post('/pusher/auth', function(req, res) {
    let socketId = req.body.socket_id;
    let channel = req.body.channel_name;
    let presenceData = {
        user_id: "1",
        user_info: {
            name: 'Mr Pusher',
            twitter_id: '@pusher'
        }
    };
    let auth = pusher.authenticate(socketId, channel, presenceData);
    console.log(auth);
    res.send(auth);
});

app.get("/pusher/auth", function(req, res) {
    var query = req.query;
    var socketId = query.socket_id;
    var channel = query.channel_name;
    var callback = query.callback;

    var presenceData = {
        user_id: "some_id",
        user_info: {
            name: "John Smith"
        }
    };

    var auth = JSON.stringify(pusher.authenticate(socketId, channel, presenceData));
    var cb = callback.replace(/\"/g,"") + "(" + auth + ");";

    res.set({
        "Content-Type": "application/javascript"
    });

    res.send(cb);
});

app.use('/', index);
app.use('/auth', auth);
app.use('/courses', courses);
// app.use('/profile', profile);

app.use('/courses/:id/userId/:email', function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('ID:', req.params.id);
    console.log('email:', req.params.email);
    next();
}, function (req, res, next) {
    rpc_client.logCoursesClick(req.params.email,req.params.id);
});

app.use('/courses/:id', function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('ID:', req.params.id);
    console.log('Request Type:', req.method);
    next();
}, function (req, res, next) {
    rpc_client.getCourse(req.params.id,function (response) {
        console.log(response);
        res.json(response);
    });
});


app.post('/notification', function (req, res) {
    console.log("post notification by admin");
    let receiver = req.body.user_id;
    if (receiver) {
        let message = {
            title: req.body.message.title,
            topic: req.body.message.topic,
            text: req.body.message.text,
            status: req.body.message.status,
            message_id:req.body.message.message_id,
            time: req.body.message.time
        };
        rpc_client.postNotification(receiver ,message, function (response) {
            console.log(response);
            res.send(response);
        });
        pusher.trigger('private-channel',receiver, message);
    }
});

app.get('/notification/:id', function (req, res) {
    let me = req.params.id;
    console.log(me);
    rpc_client.getNotification(me, function (response) {
        console.log(response);
        res.send(response);
    });
});

app.post('/notification/:id', function (req, res) {
    let me = req.params.id;
    let message_id = req.body.message_id;
    rpc_client.changeNotificationStatus(me, message_id, function (response) {
        console.log(response);
        res.send(response);
    });
});

app.get('/chat/:id', function (req,res) {
    // console.log("get chat room history");
    let id = req.params.id;
    // console.log(id);
    rpc_client.getChatHistory(id, function (response) {
        console.log(response);
        res.send(response);
    })
});
app.post('/chat/:id', function (req,res) {
    console.log("post chat room history");
    let id = req.params.id;
    let message = req.body;
    console.log(id);
    console.log(message);
//    record message
    rpc_client.postChatRecord(id, message, function (response) {
        console.log(response);
        res.send(response);
    })
});

app.get('/summery', function(req, res) {
    console.log('Fetching summery...');
    rpc_client.getClickLogs(function (response) {
        console.log(response);
        res.send(response);
    })
});

app.get('/email', function (req, res) {
    console.log("send email");
    let user_email = req.body.email;
    let title = req.body.title;
    console.log(title);
    let description = req.body.description;
    rpc_client.sendEmail(user_email, title, description, function (response) {
        console.log(response);
        res.send(response);
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.send('404 Not Found');
});

module.exports = app;