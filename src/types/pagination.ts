
type R_pagination = (
    aggregate_before: Array<any>,
    aggregate_facet: Array<any>,
    page_current: number,
    page_limit: number,
    item_limit: number
) => Array<any>

export type {
    R_pagination,
}