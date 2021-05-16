import React, {useState, useEffect, useRef} from 'react';
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
// import login from "../../../pages/login";

const SocketContext = React.createContext({});

export const SocketProvider = ({children}) => {
    const socketClient = useRef(null)
    const [isConnected, setIsConnected] = useState(false)

    const connect = () => {
        const client = new Client({
            debug: function (str) {
                // console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => {
                return new SockJS(process.env.SOCKET_HOST);
            }
        });

        client.onConnect = function (frame) {
            setIsConnected(true)
            // Do something, all subscribes must be done is this callback
            // This is needed because this will be executed after a (re)connect
        };

        client.onStompError = function (frame) {
            // Will be invoked in case of error encountered at Broker
            // Bad login/passcode typically will cause an error
            // Complaint brokers will set `message` header with a brief message. Body may contain details.
            // Compliant brokers will terminate the connection after any error
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        client.activate();
        socketClient.current = client
    }

    useEffect(() => {
        if (!socketClient.current) {
            try{
                connect();
            } catch (e) {
                console.log(e);
            }
        }
    }, [])

    return (
        <SocketContext.Provider
            value={{
                socketClient: socketClient.current,
                isConnected
            }}
        >
            {isConnected && children}
        </SocketContext.Provider>
    );
};

export function useSocket() {
    const context = React.useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within an SocketProvider');
    }
    return context;
}
