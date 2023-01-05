import type { I_globalReturn } from '../interface/index';
import type { I_loginReturn, I_payloadJwt } from '../interface/auth';
import type { R_jwtHandler, R_returnHandler } from '../types/auth';
import { RESP } from './global';
import jwt from 'jsonwebtoken';
const keyjwt: string | undefined = process.env.key;


const returnHandler: R_returnHandler<I_loginReturn> = (success=true, code=1, comments = '', data) => {
    const result: I_globalReturn<I_loginReturn> = {
        ...RESP(),
        data: data
    }
    return result
}

class jwthandler {
    static create: R_jwtHandler = (name, key, idClinic) => {
        const payload: I_payloadJwt = {
            key: key,
            name: name,
            idClinic: idClinic
        }
        const mysecret: string = keyjwt ? keyjwt : "";
        const jwtresult = jwt.sign(payload, mysecret)
        return { jwt: jwtresult };
    }


}

export { returnHandler, jwthandler }