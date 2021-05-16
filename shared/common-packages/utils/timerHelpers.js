class TimerHelpers {
    static _timer = {}

    static runTimer(key, time, callback) {
        if (TimerHelpers._timer[key]) {
            try {
                clearTimeout(TimerHelpers._timer[key])
            } catch (e) {

            }
        }
        TimerHelpers._timer[key] = setTimeout(() => {
            callback();
            TimerHelpers._timer[key] = null;
        }, time)
    }
}


export default TimerHelpers;