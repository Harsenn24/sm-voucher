interface I_forResp {
    success:boolean,
    meta:{
        code:number,
        comments:string
    }
}

interface I_argsResp {
    success:boolean|undefined,
    code:number|undefined,
    comments:string|undefined
}

export function RESP(...args:any[]):I_forResp{
    const [success, code, comments] = args;
    var rSuccess:boolean=false;
    var rCode:number=1;
    var rComments:string="Ok";
    if(typeof success === "boolean"){
        rSuccess=success;
    }
    if(typeof code === "number"){
        rCode=code;
    }
    if(typeof comments === "string"){
        rComments=comments;
    }
    return {
        success: rSuccess,
        meta: {
            code: rCode,
            comments: rComments
        }
    }
}