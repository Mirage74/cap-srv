import axios from 'axios'
const pathServer = "http://localhost:4000/api/updateUser"


const configAx = {
  login: "Aksana",
  BESTSCORE2: "11"
  }
axios.post(
    pathServer,
    configAx
)
.then(res => {
    console.log(res.data)
})
.catch (err =>console.log(err))
