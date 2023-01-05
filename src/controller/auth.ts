import { Request, Response } from "express";
import { storesClinicConn } from "../models";
import type { I_loginResult } from "../interface/auth";
import { httpHandler } from "../decorators/http";
import type { I_globalReturn } from '../interface/index';
import type { I_loginReturn, I_bodyValidate } from '../interface/auth';
import { jwthandler, returnHandler } from "../helper/auth";
const { encrypt } = require('../helper/encrypt-decrypt')

class authenticate {

    @httpHandler
    static async login(req: Request): Promise<I_globalReturn<I_loginReturn>> {

        const { key } = req.body

        const bodyValidate: I_bodyValidate = {
            key: key ? key : null
        }

        const result: Array<I_loginResult> = await storesClinicConn.aggregate([
            {
                '$match': { 'key': bodyValidate.key }
            },
            {
                '$addFields': {
                    'storeId': {
                        '$function': {
                            'body': encrypt,
                            'args': [{ '$toString': '$_s' }, 12],
                            'lang': 'js'
                        }
                    },
                }
            },
            {
                '$project': {
                    'clinicName': '$nme',
                    'clinicKey': '$key',
                    'idClinic': '$storeId'
                }
            }
        ])

        if (result.length === 0) {
            throw returnHandler(false, 2, "", { jwt: null })
        }

        const name = result[0].clinicName
        const keyjwt = result[0].clinicKey
        const idClinic = result[0].idClinic

        console.log(idClinic)

        const resultBalik: I_loginReturn = jwthandler.create(name, keyjwt, idClinic);

        return returnHandler(true, 1, "", resultBalik)
    }
}

export default authenticate