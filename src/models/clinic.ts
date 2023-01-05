import mongoose, { Schema } from "mongoose";
import bson, { ObjectId } from "bson"

export interface I_storesClinic {
    _id:mongoose.ObjectId,
    _s :mongoose.ObjectId,
    key:string,
    nme:string,
    det:{
        act:boolean,
        det:string,
        cty:string,
        prv:string,
        phn:string,
        sn:string,
        an:string,
        zip:string,
        pr:number,
        ci:number,
        su:number,
        ar:number,
        lat:string,
        lng:string
    },
    fld:string,
    doc:{
        sio:{
            val:string,
            epe:number
        },
        itu:string|null,
        kdp:string|null,
        app:string|null,
        ktp:string|null,
        pwp:string|null,
        nib:string|null,
        tdp:string|null,
        iup:string|null
    }
}

const storesClinicSchema = new Schema<I_storesClinic>({
    _id:ObjectId,
    _s:ObjectId,
    key:String,
    nme:String,
    det:{
        act:Boolean,
        det:String,
        cty:String,
        prv:String,
        phn:String,
        sn :String,
        an :String,
        zip:String,
        pr :Number,
        ci :Number,
        su :Number,
        ar :Number,
        lat:String,
        lng:String
    },
    fld:String,
    doc:{
        sio:{
            val:String,
            epe:Number
        },
        itu:String,
        kdp:String,
        app:String,
        ktp:String,
        pwp:String,
        nib:String,
        tdp:String,
        iup:String
    }
},{collection:'stores_clinic',strict:true})

const storesClinicConn = mongoose.model('stores_clinic',storesClinicSchema)

export default storesClinicConn;