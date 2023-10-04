import oracledb from 'oracledb';
import * as dbConfig from '../../config/config.js';
import { User } from '../../sequelize.js';
import bcrypt from 'bcrypt';
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
  if (!req.params.id) {
    res.json(`CODE GET_CAPS_BY_ID_ERROR: No 'ID' provided`);
  } else {
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
}


export const postRegUser = async (req, res) => {

  if (!req.body.login || !req.body.password || req.body.login === '' || req.body.password === '') {
    res.json(`CODE REG_USER_01 login and password required`);
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
    if (newUser.DISPLAYNAME.search("is already exist") > -1 || newUser.DISPLAYNAME.search("\"") > -1) {
      res.json(`CODE REG_USER_03 Illegal Username "${req.body.login}"`);
    }
    newUser.TYPELOGIN = 'local'
    newUser.BESTSCORE = 0
    newUser.LAST_RES = "0"
    newUser.BEST_RES = "0"
    console.log('newUser : ', newUser);
    bcrypt.genSalt(BCRYPT_SALT_ROUNDS, (err, salt) => {

      bcrypt.hash(req.body.password, salt)
        .then((hashedPassword) => {
          newUser.PASSWORDHASH = hashedPassword
          User.create(newUser)
        })
        .then(() => {
          res.json(`CODE REG_USER_01 User : "${req.body.login}" is successfully created`);
        })
    })
  }
}


export const postUpdateUser = async (req, res) => {
  if (!req.body.login || req.body.login === '' || (!req.body.BESTSCORE && !req.body.LAST_RES) || (req.body.BESTSCORE === '' && req.body.LAST_RES === '')) {
    res.json(`CODE UPDATE_USER_02 login and one of "BESTSCORE" or "LAST_RES" required`);
  } else {
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
      if (req.body.BESTSCORE && user.BESTSCORE < req.body.BESTSCORE) {
        newUser.BESTSCORE = parseInt(req.body.BESTSCORE)
        newUser.BEST_RES = req.body.LAST_RES
      } else {
        newUser.BESTSCORE = user.BESTSCORE
        newUser.BEST_RES = user.BEST_RES
      }

      if (req.body.LAST_RES) { newUser.LAST_RES = req.body.LAST_RES } else { newUser.LAST_RES = user.LAST_RES }
      if (isNaN(newUser.BESTSCORE)) {
        res.json(`CODE UPDATE_USER_04 one of "BESTSCORE" is not a number`);
      }

      const updatedUser = await User.update(
        { BESTSCORE: newUser.BESTSCORE, LAST_RES: newUser.LAST_RES, BEST_RES: newUser.BEST_RES },
        {
          where: {
            DISPLAYNAME: newUser.DISPLAYNAME
          }
        })
        .catch(err => {
          console.log('problem updatedUser : ', err);
          res.status(500).json(err);
        })

      res.json(`UPDATE_USER_01 Username "${req.body.login}" is successfully updated, number updated row: ${updatedUser}`);
    } else {
      res.json(`UPDATE_USER_03 Username "${req.body.login}" is not exist`);
    }
  }
}

export const postUserScore = async (req, res) => {
  if (!req.body.username) {
    res.json(`CODE POST_USER_SCORE_ERROR: 'username' is required`);
  } else {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const user = await User.findOne({ where: { DISPLAYNAME: req.body.username.toLowerCase() } })
      if (user) {
        let newUser = {}
        newUser.DISPLAYNAME = user.DISPLAYNAME
        newUser.BESTSCORE = user.BESTSCORE
        newUser.LAST_RES = user.LAST_RES
        newUser.BEST_RES = user.BEST_RES
        res.json({
          userScore: newUser
        })
      } else {
        res.json({
          userScore: {}
        })
      }
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

}

