import express from 'express'
const app = express()
import path from 'path'
import { fileURLToPath } from 'url'
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)
import logger from 'morgan';
import { mySecret } from './config/config.js';
import passport from 'passport'
import session from 'express-session'



import favicon from 'express-favicon'
import bodyParser from 'body-parser'
import { capsRoutes } from './api/caps/routes.js'
import * as dbConfig from './config/config.js';



app.use(logger('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'))
const bodyParserJSON = bodyParser.json()
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true })
const router = express.Router()
app.use(express.static('public/images'))
app.use(bodyParserJSON)
app.use(bodyParserURLEncoded)


app.use((err, req, res, next) => {
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
capsRoutes(router)

app.listen(process.env.PORT || 4000)