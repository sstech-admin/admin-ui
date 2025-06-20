import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, Row, Col, Alert, Space } from "antd";
import usecustomStyles from "../../Common/customStyles";
import ParticleAuth from "../../Common/ParticleAuth";
import { useFormik } from "formik";
import styled, {keyframes} from "styled-components";

// actions
import { loginUser, resetLoginFlag } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import withRouter from "../../Common/withRouter";
import { Link } from "react-router-dom";
import { Loader, Loader2, Lock, Mail } from "lucide-react";
import bgImage from "../../assets/images/marketbars.png";
import logo from "../../assets/images/ainfinitylogo.png"
const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Create a styled component
const SpinningLoader = styled(Loader2)`
  width: 20px;
  height: 20px;
  animation: ${spinAnimation} 1s linear infinite;
`;

const customStyles = usecustomStyles();

const StyleWrapper = styled.div`
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.token.authbgcolor}; // optional fallback
`;


const Signin = (props) => {
  // page title
  document.title = "Sign In" + process.env.REACT_APP_PAGE_TITLE;

  const dispatch = useDispatch();
  const selectAccountAndLogin = createSelector(
    (state) => state.Account,
    (state) => state.Login,
    (account, login) => ({
      user: account.user,
      error: login.error,
      loading: login.loading,
      errorMsg: login.errorMsg,
    })
  );

  const { user, error, loading, errorMsg } = useSelector(selectAccountAndLogin);

  const [isLoading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [userLogin, setUserLogin] = useState([]);

  useEffect(() => {
    if (user && user) {
      const updatedUserData =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? user.multiFactor.user.email
          : user.email;
      const updatedUserPassword =
        process.env.REACT_APP_DEFAULTAUTH === "firebase" ? "" : user.password;
      setUserLogin({
        email: updatedUserData,
        password: updatedUserPassword,
      });
    }
  }, [user]);

  // Validation

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userLogin.email || "",
      password: userLogin.password || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      // Dispatch your action and then handle the loading state
      dispatch(loginUser(values, props.router.navigate));
      setTimeout(() => {
        setLoginLoading(false); // Reset loading state when done
      }, 500);
    },
  });
  

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
        setLoginLoading(false); // Reset loading state when done
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  return (
    <React.Fragment>
      <StyleWrapper className="auth-page-wrapper">
  <Row style={{ minHeight: "100vh" }}>
    {/* Left Section with Text */}
    <Col xs={24} md={12} style={{ padding: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#fff", maxWidth: "500px" }}>
        <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "20px" }}>
          Your Smart Financial Partner
        </h1>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          Simplify savings, spending, and everything in between.
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          Start your investment with us.
        </p>
      </div>
    </Col>

    {/* Right Section with Form */}
    <Col xs={24} md={12} style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
    <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "1px", // thin border width
          borderRadius: "10px",
          background: "linear-gradient(135deg, #FFD000, #D95904)", // gradient border
        }}
      >
        <Card
          style={{
            backgroundColor: "#25252b", // transparent inner card
            backdropFilter: "blur(50px)",
            WebkitBackdropFilter: "blur(50px)",
            color: "#FFF",
            borderRadius: "10px", // slightly smaller to show the border
            border: "none",
            padding: "24px"
          }}
        >
        <div className="text-center" style={{ marginBottom: "20px" }}>
          <img src={logo} alt="Logo" style={{ maxWidth: "200px", marginBottom: "20px" }} />
        </div>

        {error && <Alert type="error" message={error} />}

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          {/* Email Input */}
          <Form.Item style={{ color: "#FFF" }}>
            <label>Email</label>
            <Input
              addonBefore={<Mail size={20} color="#FFF" />}
              name="email"
              type="email"
              value={validation.values.email}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              status={validation.touched.email && validation.errors.email ? "error" : ""}
            />
            {validation.touched.email && validation.errors.email && (
              <p style={{ color: customStyles.colorDanger }}>{validation.errors.email}</p>
            )}
          </Form.Item>

          {/* Password Input */}
          <Form.Item style={{ color: "#FFF" }}>
            <label>Password</label>
            <Input.Password
              addonBefore={<Lock size={20} color="#FFF" />}
              name="password"
              value={validation.values.password}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              status={validation.touched.password && validation.errors.password ? "error" : ""}
            />
            {validation.touched.password && validation.errors.password && (
              <p style={{ color: customStyles.colorDanger }}>{validation.errors.password}</p>
            )}
          </Form.Item>

          {/* Gradient Button */}
          <Button
            htmlType="submit"
            type="primary"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #FFD000 0%, #D95904 100%)",
              border: "none",
              color: "#000",
              fontWeight: "bold"
            }}
            loading={loginLoading}
            disabled={loginLoading}
            onClick={(e) => {
              setLoginLoading(true);
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            Sign In
          </Button>
        </Form>
      </Card>
    </div>
    </Col>

  </Row>
</StyleWrapper>

    </React.Fragment>
  );
};

export default withRouter(Signin);
