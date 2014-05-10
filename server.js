var http = require('http'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    auth = require('./auth'),
    handlebars = require('express3-handlebars'),
    moment = require('moment');
var app = express();

app.use(express.static('public'));
app.use(cookieParser())
app.use(session({secret: 'winter is coming' }));
app.use(bodyParser());

app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    extname: '.hbs',
    helpers: {
        eq: function (obj1, obj2, options) {
            if (obj1 === obj2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        dueDate: function(datetime) {
            return moment(datetime).fromNow();
            //return moment(datetime).format("HH:mm");
        },
        formatDate: function(datetime) {
            return moment(datetime).format("dddd DD MMMM YYYY - HH:mm");
        },
        getMarkPercentage: function(mark) {
            return Math.round(mark.mark / mark.total * 1000) / 10;
        }
    },
}));

app.set('view engine', '.hbs');
app.set('views', 'views/');

app.get('/', function(req, res){
    res.redirect('/attendance');
});
app.get('/login', routes.login_get);
app.get('/logout', routes.logout);
app.post('/login', routes.login_post);
app.get('/modules', auth, routes.modules);
app.get('/coursework', auth, routes.coursework);
app.get('/coursework/calendar', auth, routes.coursework.calendar);
app.get('/attendance', auth, routes.attendance);

// throw a 404 if we get to here
app.use(function(req, res, next) {
    res.locals.title = '404 - Not Found';
    res.locals.error = 'Could not find this page'
    if (req.session.user && req.session.user.name) {
        res.locals.user = req.session.user;
    }
    else {
        res.locals.layout = 'login';
    }
    res.status(404).render('error');
    return;
});

app.listen(8080);
