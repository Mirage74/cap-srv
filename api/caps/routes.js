import {getCaps} from './controller.js';
import {getCapsByID} from './controller.js';
import {postRegUser} from './controller.js';
import {postLogin} from './controller.js';



export const capsRoutes = (router) => {
//console.log("routes get")
    router.get('/get', getCaps);
    router.get('/get/:id', getCapsByID);
    router.post('/createUser', postRegUser);
    router.post('/login', postLogin);

}
