import {getCaps} from './controller.js';
import {getCapsByID} from './controller.js';

export const capsRoutes = (router) => {
//console.log("routes get")
    router.get('/get', getCaps);
    router.get('/get/:id', getCapsByID);

}
