import oracledb from 'oracledb';
import * as dbConfig from '../../config/config.js';
import { User } from '../../sequelize.js';
import bcrypt from 'bcrypt';
import passport from 'passport'
oracledb.autoCommit = true;

const BCRYPT_SALT_ROUNDS = dbConfig.BCRYPT_SALT_ROUNDS

export const getCaps = async (req, res) => {
  let connection;
  try {
    let sql, binds, options, result;
    connection = await oracledb.getConnection(dbConfig);
    sql = `SELECT * FROM capitals`;
    binds = {};
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    result = await connection.execute(sql, binds, options);
    result = result.rows;
    let capsCut = []
    let capsArrOfObj = []
    let obj = {}
    capsCut = result.map(item =>
      [
        item.ID,
        item.COUNTRY_NAME,
        item.CAPITAL_NAME,
        item.DIFFICULT_LVL,
        item.IMAGE_NAME
      ])
    for (let i = 0; i < capsCut.length; i++) {
      obj = {}
      obj.id = capsCut[i][0]
      obj.countryName = capsCut[i][1]
      obj.capitalName = capsCut[i][2]
      obj.diffLvl = capsCut[i][3]
      obj.imageName = capsCut[i][4]
      capsArrOfObj.push(obj)
    }
    res.json({
      caps: capsArrOfObj
    })
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


export const getCapsByID = async (req, res) => {
  let connection;
  try {
    let sql, binds, options, result;
    connection = await oracledb.getConnection(dbConfig);
    sql = `SELECT * FROM capitals WHERE ID = ${req.params.id}`;
    binds = {};
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
    result = await connection.execute(sql, binds, options);
    binds = result.rows[0];
    res.json({
      capByID: binds
    })
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


export const postRegUser = async (req, res) => {

  if (req.body.login === '' || req.body.password === '') {
    res.json(`CODE REG_USER_03 login and password required`);
  }

  const user = await User.findOne({
    where: {
      DISPLAYNAME: req.body.login.toLowerCase()
    }
  })
    .catch(err => {
      console.log('problem communicating with db');
      res.status(500).json(err);
    })
  if (user !== null) {
    res.json(`CODE REG_USER_02 Username "${req.body.login}" is already exist`);
  } else {

    let newUser = {}
    newUser.DISPLAYNAME = req.body.login.toLowerCase()
    newUser.BESTSCORE0 = 0
    newUser.BESTSCORE1 = 0
    newUser.BESTSCORE2 = 0
    bcrypt.genSalt(BCRYPT_SALT_ROUNDS, (err, salt) => {

      bcrypt.hash(req.body.password, salt)
        .then((hashedPassword) => {
          newUser.PASSWORDHASH = hashedPassword
          User.create(newUser)
        })
        .then(() => {
          res.json(`CODE REG_USER_01 User "${req.body.login}" is successfully created`);
        })
    })
  }
}


export const postUpdateUser = async (req, res) => {

  if (req.body.login === '' || (req.body.BESTSCORE0 === '' && req.body.BESTSCORE1 === '' && req.body.BESTSCORE2 === '')) {
    res.json(`CODE UPDATE_USER_02 login and one of "BESTSCORE" required`);
  }
  const user = await User.findOne({
    where: {
      DISPLAYNAME: req.body.login.toLowerCase()
    }
  })
    .catch(err => {
      console.log('problem communicating with db');
      res.status(500).json(err);
    })
  if (user !== null) {

    let newUser = {}
    newUser.DISPLAYNAME = req.body.login.toLowerCase()
    if (req.body.BESTSCORE0) { newUser.BESTSCORE0 = parseInt(req.body.BESTSCORE0) } else {newUser.BESTSCORE0 = user.BESTSCORE0}
    if (req.body.BESTSCORE1) { newUser.BESTSCORE1 = parseInt(req.body.BESTSCORE1) } else {newUser.BESTSCORE1 = user.BESTSCORE1}
    if (req.body.BESTSCORE2) { newUser.BESTSCORE2 = parseInt(req.body.BESTSCORE2) } else {newUser.BESTSCORE2 = user.BESTSCORE2}
    if (isNaN(newUser.BESTSCORE0) || isNaN(newUser.BESTSCORE1) || isNaN(newUser.BESTSCORE2)) {
      res.json(`CODE UPDATE_USER_04 one of "BESTSCORE" is not a number`);
    }
    
    const updatedUser = await User.update({ BESTSCORE0: newUser.BESTSCORE0, BESTSCORE1: newUser.BESTSCORE1, BESTSCORE2: newUser.BESTSCORE2 }, {
      where: {
        DISPLAYNAME: newUser.DISPLAYNAME
      }
    });

    res.json(`UPDATE_USER_01 Username "${req.body.login}" is successfully updated, number updated row: ${updatedUser}`);
  } else {
    res.json(`UPDATE_USER_03 Username "${req.body.login}" is not exist`);
  }

}

// export const postLogin = async (req, res) => {

//   if (req.body.login === '' || req.body.password === '') {
//     res.json('login and password required');
//   }

//   let user = await User.findOne({
//     where: {
//       DISPLAYNAME: req.body.login.toLowerCase()
//     }
//   })
//     .catch(err => {
//       console.log("err : ", err)
//       console.log('problem communicating with db');
//       res.status(500).json(err);
//     })
  
//   if (user !== null) {
//     let flag = await req.isAuthenticated(user.dataValues.PASSWORDHASH)
//     if (typeof flag !== 'undefined') {
//       if (flag) {
//         res.json(`CODE LOG_01, user "${user.DISPLAYNAME}" is authentificated`);
//       } else {
//         res.json(`CODE LOG_02, user "${user.DISPLAYNAME}" is exist, but not authentificated`);
//       }
//     }
//   } else {
//     res.json(`CODE LOG_03, user "${req.body.login}" is not exist`);
//   }
// }

