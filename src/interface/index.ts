interface I_globalReturn<T> {
    success:boolean|undefined,
    meta:{
        code:number|undefined,
        comments:string|undefined
    },
    data:T
}

interface I_pagination<T> {
    items : Array<T>,
    items_total: number,
    item_count: number,
    item_skip: number,
    treshold: number,
    page_request:number,
    page_last:number
}

export type {
    I_globalReturn,
    I_pagination
}