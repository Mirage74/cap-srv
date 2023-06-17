import axios from 'axios'
const pathServer = "http://localhost:4000/api/login"


const configAx = {
  login: "login0207243",
  password: "password123"
  }
axios.post(
    pathServer,
    configAx
)
.then(res => {
    console.log(res.data)
})
.catch (err =>console.log(err))
