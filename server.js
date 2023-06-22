import express from 'express'
const app = express()
import path from 'path'
import { fileURLToPath } from 'url'
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)
import Cors from 'cors';
import logger from 'morgan';
import { mySecret } from './config/config.js';
import { User } from './sequelize.js';
import bcrypt, { hash } from 'bcrypt';

import passport from 'passport'
import session from 'express-session'
//import { Strategy as LocalStrategy } from 'passport-local'


import favicon from 'express-favicon'
import bodyParser from 'body-parser'
import oracledb from 'oracledb';
import { capsRoutes } from './api/caps/routes.js'

import * as dbConfig from './config/config.js';





const BCRYPT_SALT_ROUNDS = dbConfig.BCRYPT_SALT_ROUNDS

app.use(Cors());
app.use(logger('dev'));

app.use(favicon(__dirname + '/public/favicon.ico'))
const bodyParserJSON = bodyParser.json()
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true })
const router = express.Router()
const routerLogin = express.Router()
//const routerPass = express.Router()
app.use(express.static('public'))
app.use(bodyParserJSON)
app.use(bodyParserURLEncoded)





app.use(session({
  secret: mySecret,
  resave: false,
  saveUninitialized: false
}))


import('./config-passport.js')


app.use(passport.initialize())
app.use(passport.session())



// passport.use(new LocalStrategy({
//   usernameField: 'login',
//   passwordField: 'password',
//   session: true
// }, async (displayName, password, done) => {
//     console.log("User.findOne 4tt45")
//     User.findOne({ displayName }, (err, user) => {
//       console.log("User.findOne")
//       if (err) {
//         return done(err);
//       }

//       if (!user || !checkPassword(password, user.PASSWORDHASH)) {
//         return done(null, false, { message: 'User does not exist or wrong password.' });
//       }
//       console.log("passs useeeee")
//       return done(null, user);
//     })
//   })
// )


// const localOpts = {
//   usernameField: 'login',
//   passwordField: 'password'
// };


// const localStrategy = new LocalStrategy(
//   localOpts,
//   (displayName, password, done) => {
//     try {
//       const user = User.findOne({ displayName });
//       console.log("user localstr : ", user)
//       if (!user) {
//         return done(null, false);
//       } else if (!user) {
//         return done(null, false);
//       }

//       return done(null, user);
//     } catch (e) {
//       return done(e, false);
//     }
//   },
// )

// passport.use(new LocalStrategy(
//   localOpts,
//   function(displayName, password, done) {
//     User.findOne({ DISPLAYNAME: displayName }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));


// const checkPassword = function (password, hash) {
//   console.log("checkPassword, pass, hash : ", password, hash)
//   if (!password) return false;
//   if (!hash) return false;

//   bcrypt.compare(password, hash, function (err, result) {
//     if (result) {
//       return result
//     }
//   });
// };

//const checkHash = async (pass, hashFromDB) => {
//   const checkHash = async (pass, hashFromDB) => {  
//   const hashedPassword = await bcrypt.hash(pass, salt)
//   const isEqual = hashedPassword === hashFromDB
//   return isEqual
// }





// const chechAuth = async (hash, pass) => {
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(pass, hash, (err, data) => {
//       if (err)
//         return reject(err)
//       return resolve(data)
//     })
//   })
//     .catch(err => {
//       console.log("chechAuth error : ", err)
//     })
// }

// app.use((req, res, next) => {
//   req.isAuthenticated = (hash) => chechAuth(hash, req.body.password)
//   next()
// });


// const postLogin = async  (req, res, next) => {
//   req.body.login = req.body.login.toLowerCase()
//   console.log("req.body : ", req.body)
//   req.session.user = req.body.login.toLowerCase()
//   console.log("req.session.user : ", req.session.user)
//   let userObj = {
//     displayName: req.body.login
//   } 
//   let userObj1 = {
//     displayName: "222"
//   } 
//   let userObj2 = {
//     displayName: "444"
//   } 
//   //req.user = req.body.login
//   await passport.authenticate('local', function (err, user) {
//     console.log("passport.authenticate user : ", user)
//     if (user == false) {
//       //res.json(`Login failed`);
//       return res.json(userObj);
//     } else {
//       //req.user = req.body.login
//       //req.logIn(user)

      
//       return res.json(userObj1);
//   }
//   })
//   //console.log("resPass : ", resPass())
//   console.log("req.isAuthenticated : ", req.isAuthenticated())
//   console.log("req.user : ", req.user)
//   //console.log("req.logIn : ", req.logIn)
//   //return res.json(userObj2);
  
//   next()
  
// }


app.use('/api', router)
app.use('/api', routerLogin)


// const checkLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) { 
//        next
//    }
//   next()
// }


routerLogin.post('/login', (req,res,next) => {
  // let userObj = {
  //   displayName: req.body.login
  // } 
  // let userObj1 = {
  //   displayName: "222"
  // } 
  // let userObj2 = {
  //   displayName: "444"
  // } 
  // passport.authenticate('local', (err, user) => {
  //   console.log("passport.authenticate user : ", user)

  //   if (user === false) {
  //     //res.json(`Login failed`);
  //     return res.json(userObj);
  //   } else {
  //     //req.user = req.body.login
  //     //req.logIn(user)

      
  //     return res.json(userObj1);
  // }
  // }) (req,res,next); 



  passport.authenticate('local', function(err, user) {
    let userObj1 = {
    displayName: "222"
  } 
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send('Укажите правильный email или пароль!');
    }
    req.logIn(user, function(err) {
      console.log('user : ', user)
      if (err) {
        return next(err);
      }
      return res.json(user);
      //return user;
    });
  })(req, res, next);
  
});







app.listen(process.env.PORT || 4000)