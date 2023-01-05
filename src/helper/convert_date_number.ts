
import { R_date } from "../types/convert_date_number"

const date2number: R_date = (date) => {
    if (date !== '') {
        return ((new Date(date).getTime()) / 1000)
    } else {
        return ((new Date().getTime()) / 1000)
    }
}

export default date2number


