import type {I_loginReturn} from '../interface/auth';
import type { I_globalReturn } from '../interface/index';


type R_jwtHandler = (
    name:string,
    key:string,
    idClinic:string,
)=>I_loginReturn;

type R_returnHandler<T> = (
    success:boolean,
    code:number,
    comments:string,
    data:T
)=>I_globalReturn<any>

export type {
    R_jwtHandler,
    R_returnHandler
}

