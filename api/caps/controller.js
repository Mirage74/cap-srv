import oracledb from 'oracledb';
import * as dbConfig from '../../config/config.js';

export async function getCaps(req, res, next)  {
  //console.log("songSSSSS param", req.param())
    let connection;
  //console.log(dbConfig);
  try {
    let sql, binds, options, result;
    connection = await oracledb.getConnection(dbConfig);
    sql = `SELECT * FROM capitals`;
    binds = {};
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
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
        caps : capsArrOfObj
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


export async function getCapsByID(req, res, next)  {
  //console.log("22222", req.params)
    let connection;
  try {
    let sql, binds, options, result;
    connection = await oracledb.getConnection(dbConfig);
    sql = `SELECT * FROM capitals WHERE ID = ${req.params.id}`;
    binds = {};
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      // extendedMetaData: true,               // get extra metadata
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };
    result = await connection.execute(sql, binds, options);
    //console.log("result.rows[0] : ", result.rows[0])
    binds = result.rows[0];
    res.json({
        capByID : binds
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


