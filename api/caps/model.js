export const UserModel = (sequelize, type) => {
  return sequelize.define('USERS', {
    DISPLAYNAME: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    }, 
    TYPELOGIN: {
      type: type.STRING,
      allowNull: false
    },
    PASSWORDHASH: {
      type: type.STRING,
      allowNull: false
    },
    BESTSCORE0: {
      type: type.NUMBER,
      allowNull: true
    },     
    BESTSCORE1: {
      type: type.NUMBER,
      allowNull: true
    },     
    BESTSCORE2: {
      type: type.NUMBER,
      allowNull: true
    }
  })
};



