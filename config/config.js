

export const  user = "hr"

  // Get the password from the environment variable
  // NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
  // string (not recommended), or it could be prompted for.
  // Alternatively use External Authentication so that no password is
  // needed.
export const password = "Lazzio"

  // For information on connection strings see:
  // https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#connectionstrings


//export  const connectString = "capital.cya6vynvlfes.eu-central-2.rds.amazonaws.com/ORCL"
export  const connectString = "localhost:1521/xe"
  //CID = "ORCL"

  // Setting externalAuth is optional.  It defaults to false.  See:
  // https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#extauth
  //externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,

  export const mySecret = "smNz2kOL!8$4"

  export const BCRYPT_SALT_ROUNDS = 12