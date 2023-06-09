import {getCaps} from './controller.js';
import {getCapsByID} from './controller.js';
import {postRegUser} from './controller.js';
import {postLogin} from '../../config-passport.js';
//import {postLogin, getGoogleLogin, getGoogleCallback} from '../../config-passport.js';
import {postUpdateUser} from './controller.js';




export const capsRoutes = (router) => {
//console.log("routes get")
    router.get('/get', getCaps);
    router.get('/get/:id', getCapsByID);
    router.post('/createUser', postRegUser);
    router.post('/updateUser', postUpdateUser);
    router.post('/login', postLogin);
    // router.get('/google', getGoogleLogin);    
    // router.get('/google/oauth2callback', getGoogleCallback);    
}


