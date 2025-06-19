import { Spin } from "antd";
import React from "react";

const Loader = () => {
  return (
    <Spin
      tip="Loading"
      size="large"
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        marginTop: '100px'
      }}
    >
      <div />
    </Spin>
  );
};

export default Loader;
