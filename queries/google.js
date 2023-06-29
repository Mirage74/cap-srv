import axios from 'axios'
const pathServer = "http://localhost:4000/google"


//const configAx = {
  //login: "Alex",
//  password: "pass123"
//  }
axios.get(
    pathServer
  //  configAx
)
.then(res => {
    console.log(res.data)
})
.catch (err =>console.log(err))
