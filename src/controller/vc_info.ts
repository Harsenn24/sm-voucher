import { Request, Response } from "express";
import { httpHandler, auth } from "../decorators/http";
import type { I_globalReturn, I_pagination } from '../interface/index';
import { I_isueedVoucerStatus, I_logUsedVoucher, I_queryFindClinic, I_queryFindStore, I_usedVoucher, I_voucherInfoResult } from "../interface/vc_info";
import { RESP } from "../helper/global";
import SystemVoucher from "../models/sys_voucher";
const { decryptId } = require('../helper/encrypt-decrypt')
import { ObjectId } from 'bson';
import { storesClinicConn } from "../models";
import date2number from "../helper/convert_date_number";
const { queryPagination } = require('../helper/paginantion')

class Sys_voucher {

    @httpHandler
    @auth
    static async scanMyvoucher(req: Request, res: Response): Promise<I_globalReturn<I_voucherInfoResult | string>> {

        const { idPayment } = req.query

        let idDecrypt: string = idPayment ? idPayment.toString() : ""

        var convertedIdDecrypt: ObjectId;

        try {
            idDecrypt = decryptId(idDecrypt, 12)
            convertedIdDecrypt = new ObjectId(idDecrypt)
        } catch (e: any) {
            const comments: string = e ? e.toString() : "unknown error bro/sis"
            const errResult: I_globalReturn<string> = {
                ...RESP(false, 2, comments),
                data: `id is invalid`
            }
            throw errResult
        }

        const { keyClinic } = req.headers

        let key = keyClinic ? keyClinic.toString() : ''

        const queryStoreIdFromKey: Array<I_queryFindStore> = await storesClinicConn.aggregate(
            [
                {
                    '$match': { 'key': key }
                },
                {
                    '$project': {
                        'store_id': { '$toString': '$_s' },
                        '_id': 0
                    }
                }
            ]
        )

        const storeIdFromKey: I_queryFindStore = queryStoreIdFromKey[0]

        const querySysVoucherfromId: Array<I_queryFindStore> = await SystemVoucher.aggregate(
            [
                {
                    '$match': { '_id': convertedIdDecrypt }
                },
                {
                    '$project': {
                        'store_id': { '$toString': '$_s' },
                        '_id': 0
                    }
                }
            ]
        )

        const storeIdFromId: I_queryFindStore = querySysVoucherfromId[0]

        if (storeIdFromKey.store_id !== storeIdFromId.store_id) {
            const errResult: I_globalReturn<string> = {
                ...RESP(false, 2, `something not right`),
                data: `Store id not match?`
            }

            return errResult
        }


        const queryData: Array<I_voucherInfoResult> = await SystemVoucher.aggregate([

            {
                '$match': { '_id': convertedIdDecrypt }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'as': 'us',
                    'foreignField': '_id',
                    'localField': '_u',
                    'pipeline': [
                        {
                            '$project': {
                                'username': {
                                    '$reduce': {
                                        'input': '$dat.fln',
                                        'initialValue': '',
                                        'in': {
                                            '$concat': [
                                                '$$value',
                                                { '$cond': [{ '$eq': ['$$value', ''] }, '', ' '] },
                                                '$$this'
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                '$unwind': { 'path': '$us' }
            },
            {
                '$addFields': {
                    'payment_date': {
                        '$dateToString': {
                            'date': { '$toDate': { '$multiply': ['$ep', 1000] } },
                            'format': '%Y-%m-%d',
                            'onNull': '2020-01-01'
                        }
                    },
                    'is_used': {
                        '$cond': {
                            'if': { '$gte': [{ '$size': '$isu' }, 1] },
                            'then': true,
                            'else': false
                        }
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'stores_vouchers',
                    'as': 'sv',
                    'localField': '_vc',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$lookup': {
                                'from': 'stores_clinic',
                                'as': 'sc',
                                'localField': '_cl',
                                'foreignField': '_id',
                                'pipeline': [
                                    {
                                        '$match': { 'key': key }
                                    },
                                    {
                                        '$project': {
                                            'treatment_type': '$fld',
                                            'address_use': { '$concat': ['$det.det', ', ', '$det.cty', ', ', '$det.prv', ', ', '$det.sn', ', ', '$det.an', ', ', '$det.zip'] }

                                        }
                                    }
                                ]
                            }
                        },
                        {
                            '$project': {
                                'treatment_type': { '$ifNull': [{ '$first': '$sc.treatment_type' }, '-'] },
                                'address_use': { '$ifNull': [{ '$first': '$sc.address_use' }, '-'] },
                            }
                        }
                    ]
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'username': '$us.username',
                    'payment_date': '$payment_date',
                    'voucher_name': '$vn',
                    'treatment_type': { '$ifNull': [{ '$first': '$sv.treatment_type' }, '-'] },
                    'address_use': { '$ifNull': [{ '$first': '$sv.address_use' }, '-'] },
                    'is_used': '$is_used'
                }
            }
        ])


        const data: I_voucherInfoResult = queryData[0]

        if (data.treatment_type === '-' || data.address_use === '-') {
            const errResult: I_globalReturn<string> = {
                ...RESP(false, 2,),
                data: `Voucher key not found`
            }

            return errResult
        }

        const result: I_globalReturn<I_voucherInfoResult> = {
            ...RESP(true, 1),
            data: data
        }

        return result
    }


    @httpHandler
    @auth
    static async useVoucher(req: Request, res: Response): Promise<I_globalReturn<I_usedVoucher | string>> {

        const { idPayment } = req.query

        let idDecrypt: string = idPayment ? idPayment.toString() : ""

        var convertedIdDecrypt: ObjectId;

        try {
            idDecrypt = decryptId(idDecrypt, 12)
            convertedIdDecrypt = new ObjectId(idDecrypt)
        } catch (e: any) {
            const comments: string = e ? e.toString() : "unknown error bro/sis"
            const errResult: I_globalReturn<string> = {
                ...RESP(false, 2, comments),
                data: `id is invalid`
            }
            throw errResult
        }

        const isuuedVoucher: Array<I_isueedVoucerStatus> = await SystemVoucher.aggregate(
            [
                {
                    '$match': { '_id': convertedIdDecrypt }
                },
                {
                    '$project': {
                        'issued': { '$size': '$isu' },
                        '_id': 0
                    }
                }
            ]
        )

        if (isuuedVoucher[0].issued > 0) {
            const errResult: I_globalReturn<string> = {
                ...RESP(false, 2, `something not right`),
                data: `This voucher already used`
            }

            return errResult
        }

        const { keyClinic } = req.headers

        let key = keyClinic ? keyClinic.toString() : ''


        const clinicId: Array<I_queryFindClinic> = await storesClinicConn.aggregate([
            {
                '$match': { 'key': key }
            },
            {
                '$project': {
                    'clinic_id': { '$toString': '$_id' },
                    '_id': 0
                }
            }
        ])

        let clinic_id: I_queryFindClinic = clinicId[0]

        const insertClinic = await SystemVoucher.findByIdAndUpdate(
            {
                '_id': convertedIdDecrypt
            },
            {
                '$push': {
                    'isu': {
                        '_cl': new ObjectId(clinic_id.clinic_id.toString()),
                        'ep': date2number('')
                    }
                }
            }
        )


        const result: I_globalReturn<I_usedVoucher> = {
            ...RESP(true, 2, `ok`),
            data: { success: true }
        }

        return result
    }


    @httpHandler
    @auth
    static async logVoucher(req: Request, res: Response): Promise<I_globalReturn<I_pagination<I_logUsedVoucher>>> {


        const { keyClinic } = req.headers
        let key = keyClinic ? keyClinic.toString() : ''

        let { page, limit } = req.query



        let page_current: number = page ? Number(page) : 1
        let item_limit: number = limit ? Number(limit) : 10



        const listLog: any = await storesClinicConn.aggregate(queryPagination(
            [
                {
                    '$match': { 'key': key }
                },
                {
                    '$lookup': {
                        'from': 'sys_vouchers',
                        'localField': '_id',
                        'foreignField': 'isu._cl',
                        'let': {
                            'id_store_clinic': '$_id'
                        },
                        'as': 'system_voucher',
                        'pipeline': [
                            {
                                '$lookup': {
                                    'from': 'users',
                                    'as': 'users',
                                    'localField': '_u',
                                    'foreignField': '_id',
                                    'pipeline': [
                                        {
                                            '$project': {
                                                'username': {
                                                    '$reduce': {
                                                        'input': '$dat.fln',
                                                        'initialValue': '',
                                                        'in': {
                                                            '$concat': [
                                                                '$$value',
                                                                { '$cond': [{ '$eq': ['$$value', ''] }, '', ' '] },
                                                                '$$this'
                                                            ]
                                                        }
                                                    }
                                                },
                                                '_id': 0
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                '$lookup': {
                                    'from': 'stores_vouchers',
                                    'as': 'stores_vouchers',
                                    'localField': '_vc',
                                    'foreignField': '_id',
                                    'pipeline': [
                                        {
                                            '$project': {
                                                'voucher_name': '$nme'
                                            }
                                        }
                                    ]

                                }
                            },
                            {
                                '$unwind': { 'path': '$stores_vouchers' }
                            },
                            {
                                '$addFields': {
                                    'ep_claim': {
                                        '$first': {
                                            '$filter': {
                                                'input': {
                                                    '$map': {
                                                        'input': '$isu',
                                                        'in': {
                                                            '$cond': {
                                                                'if': { '$eq': ['$$this._cl', '$$id_store_clinic'] },
                                                                'then': '$$this.ep',
                                                                'else': []
                                                            }
                                                        }
                                                    }
                                                },
                                                'cond': [
                                                    { $ne: ['$$this', []] },
                                                ]
                                            }

                                        }
                                    }
                                }
                            },
                            {
                                '$addFields': {
                                    'date_claim': {
                                        '$dateToString': {
                                            'date': { '$toDate': { '$multiply': ['$ep_claim', 1000] } },
                                            'format': '%Y-%m-%d',
                                            'onNull': '2020-01-01'
                                        }
                                    },
                                    'hour_claim': {
                                        '$dateToString': {
                                            'date': { '$toDate': { '$multiply': ['$ep_claim', 1000] } },
                                            'format': '%H:%M',
                                            'onNull': '2020-01-01'
                                        }
                                    },
                                    'date_buy': {
                                        '$dateToString': {
                                            'date': { '$toDate': { '$multiply': ['$ep', 1000] } },
                                            'format': '%Y-%m-%d',
                                            'onNull': '2020-01-01'
                                        }
                                    },
                                    'hour_buy': {
                                        '$dateToString': {
                                            'date': { '$toDate': { '$multiply': ['$ep', 1000] } },
                                            'format': '%H:%M',
                                            'onNull': '2020-01-01'
                                        }
                                    }
                                }
                            },
                            {
                                '$project': {
                                    'username': { '$first': '$users.username' },
                                    'time_buy': { '$concat': ['$date_buy', ' ', '$hour_buy'] },
                                    'time_claim': { '$concat': ['$date_claim', ' ', '$hour_claim'] },
                                    '_id': 0,
                                    'voucher_name': '$stores_vouchers.voucher_name'

                                }
                            }
                        ],
                    }
                },
                {
                    '$unwind': { 'path': '$system_voucher' }
                }
            ],
            [
                {
                    '$project': {
                        'voucher_name': '$system_voucher.voucher_name',
                        'username': '$system_voucher.username',
                        'payment_date': '$system_voucher.time_buy',
                        'claim_date': '$system_voucher.time_claim',
                        'treatment_type': '$fld',
                        'address_use': '$nme',
                        '_id': 0,
                    }
                }
            ], page_current, 3, item_limit
        ))

        const result: I_globalReturn<I_pagination<I_logUsedVoucher>> = {
            ...RESP(true, 2, `ok`),
            data: listLog[0]

        }

        return result

    }


}

export default Sys_voucher