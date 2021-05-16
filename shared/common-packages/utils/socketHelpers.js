export default class SocketHelpers {
    uuid () {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    static subscribe(topic, func, client) {
        return client.subscribe(topic, func)
    }
    static fastSubscribe(topic, func, client) {
        const subscription = client.subscribe(topic, (message) => {
            func(message);
            subscription.unsubscribe();
        })
    }
    static unsubscribe(id, client) {
        return client.unsubscribe(id)
    }
}