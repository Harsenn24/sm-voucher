import mongoose, { ObjectId } from "mongoose";

interface I_voucherInfoResult {
    username: string,
    payment_date: string,
    treatment_type: string,
    address_use: string,
    voucher_name: string,
    is_used: boolean
}

interface I_logUsedVoucher {
    voucher_name: string,
    username: string,
    payment_date: string,
    claim_date: string
    treatment_type: string,
    address_use: string,
}


interface I_queryValidate {
    idPayment: string | null
}


interface I_queryFindStore {
    store_id: ObjectId
}

interface I_queryFindClinic {
    clinic_id: ObjectId | string
}

interface I_usedVoucher {
    success: boolean
}

interface I_isueedVoucerStatus {
    issued: number
}

interface I_insertClinic {
    result: any | null
}

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

export type {
    I_voucherInfoResult,
    I_queryValidate,
    I_queryFindStore,
    I_usedVoucher,
    I_isueedVoucerStatus,
    I_queryFindClinic,
    I_insertClinic,
    I_systemVoucher,
    I_logUsedVoucher
}
