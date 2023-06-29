import axios from 'axios'
const pathServer = "http://localhost:4000/api/createUser"


const configAx = {
  login: "Roma",
  password: "pass123"
  }
axios.post(
    pathServer,
    configAx
)
.then(res => {
    console.log(res.data)
})
.catch (err =>console.log(err))
