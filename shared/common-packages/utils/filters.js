import moment from "moment";

export default class Filters {

    static date(time) {
        if (!time) {
            return ''
        }
        const momentTime = moment(time);
        const dateFormat = 'DD/MM/YYYY';

        return momentTime.format(dateFormat).toString();
    }

    static dateTime(time) {
        if (!time) {
            return ''
        }
        const momentTime = moment(time);
        const dateTimeFormat = 'DD/MM/YYYY HH:mm';

        return momentTime.format(dateTimeFormat).toString();
    }

    static number(number) {
        if(number){
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return 0;
    }

    static currency(number) {
        return Filters.number(number);
    }

    static percentage(number) {
        return (number * 100).toFixed(0) + "%"
    }

    static filterNumberOnly(value) {
        if (value) {
            return value.toString().replace(/[^0-9]/g, '')
        }
        return 0;
    }

    static roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }
}
