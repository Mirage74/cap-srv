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
            userCut.DISPLAYNAME = user.DISPLAYNAME.trim()
            userCut.TYPELOGIN = user.TYPELOGIN.trim()
            userCut.LAST_RES = user.LAST_RES.trim()
            userCut.BESTSCORE = user.BESTSCORE
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


passport.use(
  new FacebookStrategy({ clientID: '752422980059748', clientSecret: '39cbca8c12ea0864b1b6b0407f85b801', callbackURL: "http://localhost:4000/api/facebook/callback"}, async (accessToken, refreshToken, profile, cb) => {
    console.log("passport.use: ", accessToken, refreshToken, profile, cb)
    // const user = await User.findOne({ where: { DISPLAYNAME: login.toLowerCase() } })

    // if (user && login.toLowerCase() === user.DISPLAYNAME) {
    //   chechAuth(user.PASSWORDHASH, password)
    //     .then(data => {
    //       if (data) {
    //         let userCut = {}
    //         userCut.DISPLAYNAME = user.DISPLAYNAME.trim()
    //         userCut.TYPELOGIN = user.TYPELOGIN.trim()
    //         userCut.LAST_RES = user.LAST_RES.trim()
    //         userCut.BESTSCORE = user.BESTSCORE
    //         return done(null, userCut);
    //       } else {
    //         return done(null, false);
    //       }

    //     })

    // } else {
    //   return done(null, false);
    // }

  })
);





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
      return res.json({user : user});
      //console.log("req.user ", req.user)
      //return res.user;
    });
  })(req, res, next);
}


export const getLoginFacebook = async (req, res, next) => {
  passport.authenticate('facebook', (err, user) => {
    if (err) {
      return next(err);
    }
    console.log("req.body getLoginFacebook: ", req.body)
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
      return res.json({user : user});
      //console.log("req.user ", req.user)
      //return res.user;
    });
  })(req, res, next);
}




