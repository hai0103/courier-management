import {useRef, useEffect} from "react";

const useEventListener = (eventName, handler, element) => {
    const savedHandler = useRef();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const el = (element && element.addEventListener) ? element : window;
        const isSupported = el && el.addEventListener;
        if (!isSupported) return;

        const eventListener = (event) => savedHandler.current(event);
        el.addEventListener(eventName, eventListener);

        return () => {
            el.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
};

export default useEventListener;