import {getCaps} from './controller.js';
import {getCapsByID} from './controller.js';
import {postRegUser} from './controller.js';
import {postUpdateUser} from './controller.js';
import {postUserScore} from './controller.js';
import {postLogin} from '../../config-passport.js';
import passport from 'passport'
import {getLoginFacebook, getLoginFB_CB} from '../../config-passport.js';



const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }

export const capsRoutes = (router) => {
    router.get('/get', getCaps);
    router.get('/get/:id', getCapsByID);
    router.post('/createUser', postRegUser);
    router.post('/updateUser', postUpdateUser);
    router.post('/userScore', postUserScore);
    router.post('/login', postLogin);

    router.get('/loginFacebook', getLoginFacebook);
    //router.get('/facebook/callback', getLoginFB_CB);

   router.get('/', function (req, res) {
    res.render('pages/index.ejs'); // load the index.ejs file
  });
  
  router.get('/profile', isLoggedIn, function (req, res) {
    console.log("router.get('/profile req.user ", req.user)
    res.render('pages/profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
    //return res.json({user : req.user});
  });
  
  router.get('/error', isLoggedIn, function (req, res) {
    res.render('pages/error.ejs');
  });
  
//   router.get('/loginFacebook', passport.authenticate('facebook',
//   ));
  
  router.get('/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/api/profile',
      failureRedirect: '/api/error'
    }),
    (req, res) => {
        // Successful authentication, redirect home.
        return res.json({user : req.user});
    }
    );
  
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
   
}


