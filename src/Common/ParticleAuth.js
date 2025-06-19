import React from "react";

import dharmaInfoSystemLogo from "../assets/images/ainfinitylogo.png";
import authEffect2 from "../assets/images/effect-pattern/auth-effect-2.png";
import authEffect from "../assets/images/effect-pattern/auth-effect.png";
import usecustomStyles from "./customStyles";
import { Col } from "antd";

const customStyles = usecustomStyles();

const ParticleAuth = () => {
  return (
    <React.Fragment>
      <Col
        xs={24}
        lg={10}
        style={{
          backgroundColor: customStyles.colorPrimary,
          color: customStyles.colorBgContainer,
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
            padding: "20px",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div
            style={{ margin: "auto", marginBottom: "30px", marginTop: "10px" }}
          >
            <img
              src={dharmaInfoSystemLogo}
              alt=""
              height="100"
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 8,
                margin: "auto",
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
              }}
            />
            <img
              src={authEffect2}
              alt=""
              style={{
                position: "absolute",
                zIndex: "1",
                top: "0%",
                right: 0,
                transform: "rotate(-45deg)",
              }}
            />
            <img
              src={authEffect}
              alt=""
              style={{
                top: "-15px",
                left: "-20px",
                position: "absolute",
                zIndex: "1",
                overflow: "hidden",
              }}
            />
            <img
              src={authEffect}
              alt=""
              style={{
                position: "absolute",
                zIndex: "1",
                bottom: "-15px",
                right: "-20px",
              }}
            />
          </div>

          <div className="text-sm-left">
            <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>
              Start your Investment with us.
            </h3>
            {/* <p>
              It brings together your tasks, projects, timelines, files, and
              more
            </p> */}
          </div>
          <div className="text-center text-white-75">
            <p style={{ marginBottom: "0px" }}>
              &copy; {new Date().getFullYear()} Dharma InfoSystem.
            </p>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default ParticleAuth;
