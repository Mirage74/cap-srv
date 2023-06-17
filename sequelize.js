import Sequelize from 'sequelize';
import * as dbConfig from './config/config.js';
import {UserModel} from './api/caps/model.js';


const sequelize = new Sequelize({
  dialect: 'oracle',
  username: dbConfig.user,
  password: dbConfig.password,
  logging: false,
  "define":
    { "id": false,
      "freezeTableName": true,
      "createdAt": true, 
      "updatedAt": true },
  dialectOptions: {connectString: dbConfig.connectString}});


sequelize.sync()
  .then(() => {
    //console.log('This is message from "sequelize.js", connected to DB');
  });

export const User = UserModel(sequelize, Sequelize);