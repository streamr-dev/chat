import React from "react";
import "./Message.scss";

type PropTypes = {
    message: string;
    address: string;
    time: string;
};

const Message = ({ message, address, time }: PropTypes) => {
    return (
        <div
            className={`wrapper ${
                address === localStorage.getItem("metamaskAddress")
                    ? "sent"
                    : "received"
            }`}
        >
            <div className="timestamp">
                <p className="time">{time}</p>
                <p className="address">{address}</p>
            </div>
            <div className="message-bubble">
                <h4 className="message">{message}</h4>
            </div>
        </div>
    );
};

export default Message;
