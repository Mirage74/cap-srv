

//export const user = "hr"
export const user = "ADMIN"

// Get the password from the environment variable
// NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
// string (not recommended), or it could be prompted for.
// Alternatively use External Authentication so that no password is
// needed.
//export const password = "Lazzio"
export const password = "3&E?u~FAJQk57h9x"

// For information on connection strings see:
// https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#connectionstrings


//export  const connectString = "capital.cya6vynvlfes.eu-central-2.rds.amazonaws.com/ORCL"
//export const connectString = "localhost:1521/xe"
export const connectString = "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.eu-zurich-1.oraclecloud.com))(connect_data=(service_name=g98d789b83f0cbe_quiz_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"

//CID = "ORCL"

// Setting externalAuth is optional.  It defaults to false.  See:
// https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#extauth
//externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,

export const mySecret = "~!T{!?aTCy-[Pg3e"

export const BCRYPT_SALT_ROUNDS = 12

// export const GOOGLE_CLIENT_ID = "1057527305597-hp1bso1403hj8hhc9c416a42hp9olhb5.apps.googleusercontent.com"

// export const GOOGLE_CLIENT_SECRET = "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"

// export const callbackURL = "https://localhost:4000/oauth2callback"