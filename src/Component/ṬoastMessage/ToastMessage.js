// import { message } from "antd";
import React from "react";

const ToastMessage = ({ children }) => {
  // const [messageApiType, contextHolderType] = message.useMessage();

  return (
    <>
      {/* <div style={{zIndex:99}}>{contextHolderType}</div> */}
      {children}
    </>
  );
};

export default ToastMessage;
