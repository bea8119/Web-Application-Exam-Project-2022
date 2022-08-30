//import {readFileSync, promises as fsPromises} from 'fs';

const {readFileSync, promises: fsPromises} = require('fs');



function getArray(filename) {

    return readFileSync('./categoriesFiles/animals.txt', 'utf-8'). split('/n');

}

export {getArray}