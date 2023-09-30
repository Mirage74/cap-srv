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
    LAST_RES: {
      type: type.STRING,
      allowNull: false
    },
    BEST_RES: {
      type: type.STRING,
      allowNull: false
    },
    BESTSCORE: {
      type: type.NUMBER,
      allowNull: true
    }
  })
};



