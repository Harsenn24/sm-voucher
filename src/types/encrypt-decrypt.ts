import { I_voucherInfoResult } from "../interface/vc_info";
import { I_globalReturn } from "../interface";

type R_encrypt_decrypt = (
    n:string,
    e:number,
    i:boolean,
)=>string


type R_returnData = (
    success:boolean,
    code:number,
    comments:string,
    data:I_voucherInfoResult
)=>I_globalReturn<I_voucherInfoResult>

export type {
   R_encrypt_decrypt,
   R_returnData
}