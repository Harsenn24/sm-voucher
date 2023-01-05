import "reflect-metadata";
import jwt from 'jsonwebtoken';
import { I_payloadJwt } from "../interface/auth";
import { I_storesClinic, storesClinicConn } from "../models";
const key: string = process.env.key ? process.env.key.toString() : ""
const { decryptId } = require('../helper/encrypt-decrypt')



function httpHandler(target: any, x: any, descriptor: any): void {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        try {
            const [, res, next] = args;
            const ok = await fn.apply(target, args);
            typeof (ok) == "number" ? res.sendStatus(ok) : res.send(ok)
            next();
        } catch (error: any) {
            const [, res, next] = args;
            typeof (error) == "number" ? res.sendStatus(error) : res.send(error)
            next(error);
        }
    };
};

function auth(target: any, x: any, descriptor: any): void {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        try {
            const [req, ,] = args;
            const { authorization } = req.headers;

            const token: string | null = authorization ? authorization.toString() : null

            if (token === null) {
                throw 401
            }

            const rToken = jwt.verify(token, key)

            if (typeof rToken !== "object") {
                throw 401
            }

            const parsedToken: any = rToken;

            const tokennew: I_payloadJwt = {
                key: parsedToken.key ? parsedToken.key : null,
                name: parsedToken.name ? parsedToken.name : null,
                idClinic: parsedToken.idClinic ? parsedToken.idClinic : null
            }


            const findStoresClinic: I_storesClinic | null = await storesClinicConn.findOne(
                {
                    key: tokennew.key
                }
            )
            if (findStoresClinic === null) { throw 401 }

            req.headers = {
                keyClinic: tokennew.key
            }

            // const findkey 
            return await fn.apply(target, args);

        } catch (error: any) {
            return error
        }
    };
};

export { httpHandler, auth };