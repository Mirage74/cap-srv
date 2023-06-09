import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
//import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import { User } from './sequelize.js';
import bcrypt, { hash } from 'bcrypt';
//import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, callbackURL } from './config/config.js'


passport.serializeUser((user, done) => {
  //done(null, user.DISPLAYNAME);
  done(null, user);
});

// passport.deserializeUser( (user, done) => {
//   done(null, DISPLAYNAME);
// });


const chechAuth = async (hash, pass) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, hash, (err, data) => {
      if (err) {
        return reject(err)
      }
      //console.log("chechAuth data : ", data)
      return resolve(data)
    })
  })
    .catch(err => {
      console.log("chechAuth error : ", err)
    })
}




passport.use(
  new LocalStrategy({ usernameField: 'login' }, async (login, password, done) => {
    const user = await User.findOne({ where: { DISPLAYNAME: login.toLowerCase() } })

    if (user && login.toLowerCase() === user.DISPLAYNAME) {
      chechAuth(user.PASSWORDHASH, password)
        .then(data => {
          if (data) {
            let userCut = {}
            userCut.DISPLAYNAME = user.DISPLAYNAME
            userCut.TYPELOGIN = user.TYPELOGIN
            userCut.BESTSCORE0 = user.BESTSCORE0
            userCut.BESTSCORE1 = user.BESTSCORE1
            userCut.BESTSCORE2 = user.BESTSCORE2
            return done(null, userCut);
          } else {
            return done(null, false);
          }

        })

    } else {
      return done(null, false);
    }

  })
);


// passport.use(new GoogleStrategy({
//   clientID: GOOGLE_CLIENT_ID,
//   clientSecret: GOOGLE_CLIENT_SECRET,
//   callbackURL: callbackURL,
//   passReqToCallback: true
// },
//   function (request, accessToken, refreshToken, profile, done) {
//     console.log("GoogleStrategy profile : ", profile)
//     //return done(null, profile);
//   }
// ));


export const postLogin = async (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }
    // console.log("req.body : ", req.body)
    // console.log("user : ", user)
    if (!user) {
      return res.json('CODE LOGIN_USER_02 Wrong login or password !');
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      // console.log("req.session.passport.user ", req.session.passport.user)
      // console.log("req.user ", req.user)
      return res.json({user : user.DISPLAYNAME});
      //return user;
    });
  })(req, res, next);
}


// export const getGoogleLogin = async (req, res, next) => {
//   passport.authenticate('google', {
//     scope:
//       ['email', 'profile']
//   })(req, res, next);
// }


// export const getGoogleCallback = async (req, res, next) => {
//   passport.authenticate('google', {
//     failureRedirect: '/failed',
//   }),
//     function (req, res) {
//       res.redirect('/success')

//     }(req, res, next);
// }

