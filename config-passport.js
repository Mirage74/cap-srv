import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { User } from './sequelize.js';

// const userDB = {
//   id: 136345,
//   email: 'test@mail.ru',
//   password: '123',
// };

// passport.serializeUser((user, done) => {
//   console.log("serializeUser user : ", user)
//   done(null, user.DISPLAYNAME);
// });

// passport.deserializeUser((id, done) => {
//   User.findOneUser.findOne({ where: { DISPLAYNAME: login } }).then((user) => {
//     done(null, user);
//     return null;
//   });
// });


passport.serializeUser(function(user, done) {
  done(null, user);
});

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });


passport.deserializeUser(async (id, done) => {
  const user = await getUserFromId(id);
  return done(null, user);
});



passport.use(
  new LocalStrategy({ usernameField: 'login' }, async (login, password, done) => {
    const user = await User.findOne({ where: { DISPLAYNAME: login.toLowerCase() } })
    console.log("user passport use : ", user)
    // const user = {
    //   login: "444"
    // }
    //if (email === userDB.email && password === userDB.password) {
      if (user) {      
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);
