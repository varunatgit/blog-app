const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

let RemoteMongoDB =  'mongodb+srv://varun:pass12345@cluster0.s3f3r.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(RemoteMongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(connection => {
    console.log('mongoDB connected to ' + connection.connection.host)
  }).catch(err => {
    console.log(err)
    process.exit(1)
  })

// mongoose.connect(process.env.MONGODB_URI || config.database);
// let db = mongoose.connection;

// db.once('open', () => {
//     console.log('Connected to mongodb');
// });

// db.on('err', () => {
//     console.log(err);
// });

//init app
const app = express();

//bring in models
let Article = require('./models/article');
const bodyParser = require('body-parser');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: {secure: true}
}))

//express messages middleware
app.use(require('connect-flash')());
app.use(function(req,res,next) {
    res.locals.messages = require('express-messages')(req,res);
    next();
});

//express validator middleware
app.use(expressValidator({
    errorFormatter: (param,msg,value) => {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg : msg,
            value : value
        };
    }
}));

// passport config
require('./config/passport')(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req,res,next) => {
    res.locals.user = req.user || null;
    next();
});

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.get('/', (req,res) => {
    Article.find({}, (err, articles) => {
        if(err) {
            console.log(err);
        }
        else{
            res.render('index', {
                title: 'Articles',
                articles
            });
        }
    })
});

//route files
let articles = require('./routes/articles');
app.use('/articles', articles);

let users = require('./routes/users');
app.use('/users', users);

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Server started');
});