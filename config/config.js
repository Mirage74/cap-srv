export const user = "ADMIN"

export const password = "............."

// For information on connection strings see:
// https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#connectionstrings

export const connectString = "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb..........com))(connect_data=(service_name=........_quiz_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"

//CID = "ORCL"

// Setting externalAuth is optional.  It defaults to false.  See:
// https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#extauth
//externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,

export const mySecret = "................"

export const BCRYPT_SALT_ROUNDS = 12

