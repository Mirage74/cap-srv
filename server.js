import express from 'express'
//const express = require('express')
const app = express()
import path from 'path'
import { fileURLToPath } from 'url'
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

import log from 'morgan'
//const log = morgan.dev
import favicon from 'express-favicon'
import bodyParser from'body-parser'
//const songSchema = require('./api/song/model')
import oracledb from'oracledb';
import {capsRoutes} from './api/caps/routes.js'

import * as dbConfig from './config/config.js';

app.use(favicon(__dirname + '/public/favicon.ico'))
const bodyParserJSON = bodyParser.json()
const bodyParserURLEncoded = bodyParser.urlencoded({extended:true})
const router = express.Router()
app.use(express.static('public'))
//app.use(log)
app.use(bodyParserJSON)
app.use(bodyParserURLEncoded)



app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
   res.setHeader("Access-Control-Allow-Credentials", "true")
   res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE")
   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization")
 next()
});



app.use('/api', router)
capsRoutes(router)


async function run() {
  let connection;
  //console.log(dbConfig);

  try {

    let sql, binds, options, result;

    connection = await oracledb.getConnection(dbConfig);
    //connection = await oracledb.getConnection({ user: "xe", password: "xe", connectionString: "localhost:1521/xe" });

    sql = `SELECT * FROM capitals`;


    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      // extendedMetaData: true,               // get extra metadata
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);

    // Column metadata can be shown, if desired
    // console.log("Metadata: ");
    // console.dir(result.metaData, { depth: null });

    //console.log("Query results: ");
    //console.log(" server result.rows[0] ", result.rows[0]);
    //console.dir(result.rows, { depth: null });

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
run();


app.listen(process.env.PORT || 4000)