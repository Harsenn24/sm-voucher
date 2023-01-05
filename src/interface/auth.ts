interface I_loginResult {
    clinicName: string,
    clinicKey: string,
    idClinic: string
}

interface I_loginReturn {
    jwt: string | null
}

interface I_bodyValidate {
    key: string | null
}

interface I_payloadJwt {
    key: string | null,
    name: string | null,
    idClinic: string | null
}

export type {
    I_loginResult,
    I_loginReturn,
    I_bodyValidate,
    I_payloadJwt
}