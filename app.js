var express=require('express')
var app=express()
var index=require('./routes/index')
//var signUp=require('./routes/signUpResults')
//var verifyMe=require('./routes/verifications')
var path=require('path')
var mysql=require('mysql')
var myConnection=require('express-myconnection')
var configurations=require('./mysqlConfig')
var expressValidator=require('express-validator');
var bodyParser=require('body-parser')
var flash=require('express-flash')
var cookyParser=require('cookie-parser');
var session=require('express-session') //replaced by cookie-session for it is not for production enviromnment
var passport=require('passport')
var MySQLStore=require('express-mysql-session')(session);//wiil be used to store our session into the db
//var cookieSession=require('cookie-session')
var fileUpload=require('express-fileupload')
var dbOptions={
  host:configurations.database.host,
  user:configurations.database.user,
  password:configurations.database.password,
  port:configurations.database.port,
  database:configurations.database.database,
}
var sessionStore=new MySQLStore(dbOptions);
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'/Public')))//this is mainly used to view stuffs
//app.use(express.static(__dirname+'/Public'))//this will be usefull while we need to upload images
app.use(expressValidator())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(cookyParser('keyboard cat'))
app.use(flash());
app.use(session({
	secret: 'we never give up and we always reach our destination everytime',
  store:sessionStore,
	resave: false,
	saveUninitialized: true,
	 saveUninitialized: false
})) // not used due to the fact that it is not for production environment
app.use(passport.initialize())
app.use(passport.session())
 /*app.use(cookieSession({
  name: 'session',
  keys: [ 'karibuni kwetu'/* secret keys *///],

  // Cookie Options
// maxAge: 24 * 60 * 60 * 1000 // 24 hours
//})) *///this one is used to replace session
app.listen(8980);

app.use(myConnection(mysql,dbOptions,'pool'));
app.use('/',index)
//app.use('/signUpResults',signUp)
//app.use('/verify',verifyMe)
console.log('The server is started and listening on port:8980 :)')
