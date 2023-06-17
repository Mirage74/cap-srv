import oracledb from 'oracledb';
import * as dbConfig from '../../config/config.js';
import { User } from '../../sequelize.js';
import bcrypt from 'bcrypt';
oracledb.autoCommit = true;

const BCRYPT_SALT_ROUNDS = dbConfig.BCRYPT_SALT_ROUNDS

export const getCaps = async (req, res, next) => {
  let connection;
  try {
    let sql, binds, options, result;
    connection = await oracledb.getConnection(dbConfig);
    sql = `SELECT * FROM capitals`;
    binds = {};
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT
      // extendedMetaData: true,               // get extra metadata
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };
    result = await connection.execute(sql, binds, options);
    //console.log("binds : ", binds)
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


    //console.log("capsArrOfObj : ", capsArrOfObj[0])
    //console.log("capsArrOfObj : ", capsArrOfObj.length)

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


export const getCapsByID = async (req, res, next) => {
  //console.log("22222", req.params)
  let connection;
  try {
    let sql, binds, options, result;
    connection = await oracledb.getConnection(dbConfig);
    sql = `SELECT * FROM capitals WHERE ID = ${req.params.id}`;
    binds = {};
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
      // extendedMetaData: true,               // get extra metadata
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };
    result = await connection.execute(sql, binds, options);
    //console.log("result.rows[0] : ", result.rows[0])
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



export const postRegUser = async (req, res, next) => {
  //let connection;
  //  console.log("req.body.login : ", req.body.login)
  //  console.log("req.body.password : ", req.body.password)

  if (req.body.login === '' || req.body.password === '') {
    res.json('login and password required');
  }

  let newUser = {}
  newUser.DISPLAYNAME = req.body.login.toLowerCase(),
    newUser.BESTSCORE0 = 0,
    newUser.BESTSCORE1 = 0,
    newUser.BESTSCORE2 = 0


  User.findOne({
    where: {
      DISPLAYNAME: req.body.login.toLowerCase()
    }
  })

    .then(user => {

      if (user !== null) {
        res.json('username already taken');
      } else {

        bcrypt.genSalt(BCRYPT_SALT_ROUNDS, (err, salt) => {

          bcrypt.hash(req.body.password, salt)
            .then((hashedPassword) => {
              //console.log("hashedPassword : ", hashedPassword)
              newUser.PASSWORDHASH = hashedPassword
              User.create(newUser)
            })
            .then(() => {
              console.log('user created');
              res.json('user created');
            })
        })
      }
    })
    .catch(err => {
      console.log('problem communicating with db');
      res.status(500).json(err);
    })

}




// const checkHash = async (pass, hashFromDB) => {
//   const hashedPassword = await bcrypt.hash(pass, salt)
//   const isEqual = hashedPassword === hashFromDB
//   return isEqual
// }

export const postLogin = async (req, res, next) => {

  console.log("req.body.login : ", req.body.login)
  console.log("req.body.password : ", req.body.password)

  if (req.body.login === '' || req.body.password === '') {
    res.json('login and password required');
  }



  // 


  User.findOne({
    where: {
      DISPLAYNAME: req.body.login.toLowerCase()
    }
  })

    .then(async user => {

      // passport.authenticate('local', function (err, user) {
      //   if (user == false) {
      //     //ctx.body = "Login failed";
      //     res.json('login fall 1111');
      //   } else {
      //     res.json('login good 33333');

      //     // let userObj = {
      //     //   _id: user._id,
      //     //   displayName: user.displayName,
      //     //   bestScore: user.bestScore,
      //     //   lastRes: user.lastRes,
      //     //   debuginfo: user.debuginfo
      //     // }
      //   return user  
      //   }
      // })



      //console.log('user exist', user.dataValues);


      if (req.isAuthenticated) {
        let flag = await req.isAuthenticated(user.dataValues.PASSWORDHASH)
        //console.log("flag : ", flag)
        if (typeof flag !== 'undefined') {
          console.log("flag 111: ", flag)
          if (flag) {
            res.json("Authenticated");
          } else {
            console.log("flag : ", flag)
            res.json("Not Authenticated");
          }
        }
      }

    })

    .catch(err => {
      console.log("err : ", err)
      console.log('problem communicating with db');
      res.status(500).json(err);
    })
}