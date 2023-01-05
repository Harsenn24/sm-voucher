import { R_pagination } from "../types/pagination";

const queryPagination: R_pagination = (aggregate_before = [], aggregate_facet = [], page_current = 1, page_limit = 3, item_limit = 10) => {
    let item_skip:number = (page_current - 1) * item_limit;
    if (item_skip < 0) { item_skip = 0; };
    var emptyarr : Array<any> = []
    const facet_item: Array<any> = emptyarr.concat([
        { '$skip': item_skip },
        { '$limit': item_limit },
    ], aggregate_facet)
    return aggregate_before.concat([
        {
            '$facet': {
                'item': facet_item,
                'count': [{ '$count': 'count' }]
            }
        },
        {
            '$project': {
                'items': '$item',
                'item_total': { '$ifNull': [{ '$first': '$count.count' }, { '$toInt': '0' }] },
                'item_count': { '$size': '$item' },
                'item_skip': { '$toInt': (item_skip) },
                'treshold': { '$toInt': (page_limit) },
                'page_request': { '$toInt': (page_current) },
                'page_last': {
                    '$cond': {
                        'if': { '$gt': [{ '$first': '$count.count' }, (item_limit)] },
                        'then': { '$add': [{ '$toInt': { '$divide': [{ '$first': '$count.count' }, (item_limit)] } }, 1] },
                        'else': 1
                    }
                }
            }
        },
        {
            '$addFields': {
                'page_first': { '$toInt': '1' },
                'page_current': {
                    '$cond': {
                        'if': { '$lte': ['$page_last', '$page_request'] },
                        'then': '$page_last',
                        'else': '$page_request'
                    }
                },
                'page_before': {
                    '$cond': {
                        'if': { '$lte': [{ '$subtract': ['$page_request', '$treshold'] }, 1] },
                        'then': { '$range': [1, '$page_request'] },
                        'else': {
                            '$cond': {
                                'if': { '$gte': ['$page_last', '$page_request'] },
                                'then': { '$range': [{ '$subtract': ['$page_request', '$treshold'] }, '$page_request'] },
                                'else': { '$range': [{ '$subtract': ['$page_request', '$treshold'] }, '$page_last'] }
                            }
                        }
                    }
                },
                'page_after': {
                    '$cond': {
                        'if': { '$lte': [{ '$sum': ['$page_request', '$treshold'] }, '$page_last'] },
                        'then': {
                            '$cond': {
                                'if': { '$gte': ['$page_request', 0] },
                                'then': {
                                    '$range': [
                                        { '$sum': ['$page_request', 1] },
                                        { '$sum': ['$page_request', { '$sum': ['$treshold', 1] }] }
                                    ]
                                },
                                'else': {
                                    '$range': [
                                        1,
                                        { '$sum': ['$page_request', { '$sum': ['$treshold', 1] }] }
                                    ]
                                }
                            }
                        },
                        'else': {
                            '$range': [
                                { '$sum': ['$page_request', 1] },
                                { '$sum': ['$page_last', 1] }
                            ]
                        }
                    }
                }
            }
        }
    ])
}

module.exports = {queryPagination}
