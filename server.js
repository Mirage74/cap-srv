import express from 'express'
const app = express()
import path from 'path'
import { fileURLToPath } from 'url'
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)
//import Cors from 'cors';
import logger from 'morgan';
import { mySecret } from './config/config.js';
//import { User } from './sequelize.js';
//import('./config-passport.js')
import bcrypt, { hash } from 'bcrypt';

import passport from 'passport'
import session from 'express-session'



import favicon from 'express-favicon'
import bodyParser from 'body-parser'
//import oracledb from 'oracledb';
import { capsRoutes } from './api/caps/routes.js'

import * as dbConfig from './config/config.js';





const BCRYPT_SALT_ROUNDS = dbConfig.BCRYPT_SALT_ROUNDS

//app.use(Cors());
app.use(logger('dev'));

app.use(favicon(__dirname + '/public/favicon.ico'))
const bodyParserJSON = bodyParser.json()
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true })
const router = express.Router()
//const routerLogin = express.Router()
//const routerPass = express.Router()
app.use(express.static('public/images'))
app.use(bodyParserJSON)
app.use(bodyParserURLEncoded)


app.use((err, req, res, next) => {
  // This check makes sure this is a JSON parsing issue, but it might be
  // coming from any middleware, not just body-parser:

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error(err);
      return res.status(400).json({status: false, error: 'Enter valid json body'}); // Bad request
  }

  next();
});



app.use(session({
  secret: mySecret,
  resave: false,
  saveUninitialized: false
}))





app.use(passport.initialize())
app.use(passport.session())




app.use('/api', router)
//app.use('/api', routerLogin)

capsRoutes(router)



// routerLogin.post('/login', (req, res, next) => {
//     passport.authenticate('local', (err, user) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.json('Wrong login or password !');
//     }
//     req.login(user, (err) => {
//       if (err) {
//         return next(err);
//       }
//       console.log("req.session.passport.user ", req.session.passport.user)
//       console.log("req.user ", req.user)
//       return res.json(user.DISPLAYNAME);
//       //return user;
//     });
//   })(req, res, next);
  
// });




app.listen(process.env.PORT || 4000)