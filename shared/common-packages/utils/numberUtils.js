export default class NumberUtils {
    static parseFloat(data, def) {
        let val = parseFloat(data);
        return isNaN(val) ? def : val;
    }

    static uuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    static range(start, end) {
        const rs = [];
        for (let i = start; i <= end; i++) {
            rs.push(i);
        }
        return rs;
    }

    static rangeVal(start, end, callback) {
        const rs = [];
        for (let i = start; i <= end; i++) {
            rs.push(callback ? callback(i) : i);
        }
        return rs;
    }
}