import moment from 'moment'

export const formatDate = (date: string) => {
    const obj = new Date(date)
    const formatted = obj.getMonth() + 1 + '/' + obj.getDate() + '/' + obj.getFullYear()
    return date ? formatted : '-'
}

/* Get the total number of days employed. */
export const getDays = (startDate: string, endDate?: string) => {
    const end = moment(endDate ? new Date(endDate) : new Date())
    const start = moment(new Date(startDate))
    var thing = end.diff(start, 'days')
    return thing
}

/* Calculate number of days and formate in years, months, day form.
     Adapted from a friendly SO post: https://stackoverflow.com/questions/33988129/moment-js-get-difference-in-two-birthdays-in-years-months-and-days
*/
export const calculateDaysEmployed = (startDate: string, endDate?: string) => {
    var start = moment(new Date(startDate));
    var end = moment(endDate ? new Date(endDate) : new Date())

    var years = end.diff(start, 'year');
    start.add(years, 'years');
    var months = end.diff(start, 'months');
    start.add(months, 'months');
    var days = end.diff(start, 'days');

    var ret: string = ''
    ret += years !== 0 ? (years === 1 ? years + ' year, ' : years + ' years, ') : ''
    ret += months !== 0 ? (months === 1 ? months + ' month, ' : months + ' months, ') : ''
    ret += days === 1 ? days + ' day' : days + ' days'
    return ret
}

/* Convert the number of days employee to the hire date. */
export const calculateHireDate = (numberOfDaysEmployee: number) => {
    var hireDate = moment(new Date()).subtract(numberOfDaysEmployee, "days")
    return hireDate.toString()
}