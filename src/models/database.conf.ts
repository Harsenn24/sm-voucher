import mongoose from 'mongoose';
import configMongo from '../sm-app/config/deployment.json'
import {I_configDb} from '../interface/config'

const MONGO_SETUP: I_configDb = {
    ip: configMongo['mongo']['master']['ip'],
    port: configMongo['mongo']['master']['port'],
    username: configMongo['mongo']['master']['username'],
    password: configMongo['mongo']['master']['password'],
    source: configMongo['mongo']['master']['source']
}


const database:string = `mongodb://${MONGO_SETUP.username}:${MONGO_SETUP.password}@${MONGO_SETUP.ip}:${MONGO_SETUP.port}/skinmystery?authSource=${MONGO_SETUP.source}&readPreference=primary&ssl=false`

async function db(){
    try{
        return await mongoose.connect(database);
    }catch(e){
        throw e;
    }
    
}
export {db};