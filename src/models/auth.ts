import type {I_loginReturn} from '../interface/auth';

type R_jwtHandler = (
    secret:string,
    name:string,
    key:string
)=>I_loginReturn;

export type {
    R_jwtHandler
}