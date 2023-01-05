import express, { Express, Router } from "express";
import authenticate from "../controller/auth";
import Sys_voucher from "../controller/vc_info";

const router = express.Router()

router.post('/key', authenticate.login)
router.get('/key/my_voucher', Sys_voucher.scanMyvoucher)
router.post('/key/my_voucher/using', Sys_voucher.useVoucher)
router.get('/key/my_voucher/log', Sys_voucher.logVoucher)



module.exports = { router }