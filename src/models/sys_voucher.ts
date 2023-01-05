import mongoose, { Schema } from "mongoose";
import bson, { ObjectId } from "bson"

interface I_systemVoucher {
    _id: mongoose.ObjectId,
    _t: Date,
    _u: mongoose.ObjectId,
    _vc: mongoose.ObjectId,
    _s: mongoose.ObjectId,
    vn: string,
    sn: string,
    ep: number,
    eps: number,
    epe: number,
    inv: string,
    prc: number,
    isu: Array<object>,
    qty: number,
    mon: {
        fee: number,
        fen: number,
        pph: number,
        ppn: number,
        pym: number,
        amm: number,
        amr: number
    },
    pym: {
        tid: string,
        sgn: string,
        oid: string,
        fee: number,
        sts: string,
        adm: string,
        epe: number,
        cap: number,
        dep: string,
        lnk: string,
        chn: string,
        num: string,
        vnd: string,
    },
    tme: {
        cfm: number
    }
}

const system_voucher = new Schema<I_systemVoucher>(
    {
        _id: ObjectId,
        _t: Date,
        _u: ObjectId,
        _vc: ObjectId,
        _s: ObjectId,
        vn: String,
        sn: String,
        ep: Number,
        eps: Number,
        epe: Number,
        inv: String,
        prc: Number,
        isu: Array<object>,
        qty: Number,
        mon: {
            fee: Number,
            fen: Number,
            pph: Number,
            ppn: Number,
            pym: Number,
            amm: Number,
            amr: Number
        },
        pym: {
            tid: String,
            sgn: String,
            oid: String,
            fee: Number,
            sts: String,
            adm: String,
            epe: Number,
            cap: Number,
            dep: String,
            lnk: String,
            chn: String,
            num: String,
            vnd: String,
        },
        tme: {
            cfm: Number
        }
    },
    {
        collection: 'sys_vouchers', 
        strict: true
    }
)



const SystemVoucher = mongoose.model('sys_voucher', system_voucher)

export default SystemVoucher;
