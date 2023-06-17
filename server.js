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
import { Strategy as LocalStrategy } from 'passport-local'


import favicon from 'express-favicon'
import bodyParser from 'body-parser'
//const songSchema = require('./api/song/model')
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
//const routerPass = express.Router()
app.use(express.static('public'))
//app.use(log)
app.use(bodyParserJSON)
app.use(bodyParserURLEncoded)





app.use(session({
  secret: mySecret,
  resave: false,
  saveUninitialized: false
}))




app.use(passport.initialize())
app.use(passport.session())


const checkHash = async (pass, hashFromDB) => {
  const hashedPassword = await bcrypt.hash(pass, salt)
  const isEqual = hashedPassword === hashFromDB
  return isEqual
}


const chechAuth = async (hash, pass) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, hash, (err, data) => {
      if (err)
        return reject(err)
      return resolve(data)
    })
  })
    .catch(err => {
      console.log("chechAuth error : ", err)
    })
}

app.use((req, res, next) => {
  // req.isAuthenticated = (hash) => {
  //   bcrypt.compare(req.body.password, hash).then(result => {
  //     console.log("hash : ", hash)
  //     console.log("req.body.password : ", req.body.password)
  //     console.log("result : ", result)
  //     return result
  //   })
  // }
  req.isAuthenticated = (hash) => chechAuth(hash, req.body.password)
  next()
});


app.use('/api', router)
capsRoutes(router)



// router.post('/login', async (ctx, next) => {
//   ctx.request.body.login =   ctx.request.body.login.toLowerCase()
//   await passport.authenticate('local', function (err, user) {
//     if (user == false) {
//       ctx.body = "Login failed";
//     } else {

//       let userObj = {
//         _id: user._id,
//         displayName: user.displayName,
//         bestScore: user.bestScore,
//         lastRes: user.lastRes, 
//         debuginfo: user.debuginfo
//       } 
//     ctx.body = userObj
//   }
//   })(ctx, next);
// });








// const postLogin = async (req, res, next) => {

//   console.log("req.body.login : ", req.body.login)
//   console.log("req.body.password : ", req.body.password)

//   if (req.body.login === '' || req.body.password === '') {
//     res.json('login and password required');
//   }
//   console.log("req.isAuthenticated() : ", req.isAuthenticated())

//   if (req.isAuthenticated()) {
//     res.json("Login GOOD");
//   } else {
//     res.json("Login BAD");

//   }
// }








//   }



//routerPass.post('/login', postLogin);




//routerPass.use(checkAuthenticated)

passport.use(new LocalStrategy({
  usernameField: 'login',
  passwordField: 'password',
  session: false
},
  function (displayName, password, done) {
    User.findOne({ displayName }, (err, user) => {
      console.log("User.findOne")
      if (err) {
        return done(err);
      }

      if (!user || checkPassword(password, user.PASSWORDHASH)) {
        return done(null, false, { message: 'User does not exist or wrong password.' });
      }
      return done(null, user);
    })
  })
)


// 




const checkPassword = function (password, hash) {
  if (!password) return false;
  if (!hash) return false;

  bcrypt.compare(password, hash, function (err, result) {
    if (result) {
      return result
    }
  });
};





app.listen(process.env.PORT || 4000)