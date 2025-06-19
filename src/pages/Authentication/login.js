import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, Row, Col, Alert, Space, Typography } from "antd";
import usecustomStyles from "../../Common/customStyles";
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
import { Loader2, Lock, Mail } from "lucide-react";
import bgImage from "../../assets/images/marketbars.png";
import logo from "../../assets/images/ainfinitylogo.png";

const { Title, Text } = Typography;

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
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
`;

const GradientButton = styled(Button)`
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  border: none;
  height: 48px;
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  }
`;

const InputWithIcon = styled(Input)`
  height: 48px;
  border-radius: 8px;
  
  &:hover, &:focus {
    border-color: #3b82f6;
    box-shadow: none;
  }
`;

const InputWithIconPassword = styled(Input.Password)`
  height: 48px;
  border-radius: 8px;
  
  &:hover, &:focus {
    border-color: #3b82f6;
    box-shadow: none;
  }
`;

const Signin = (props) => {
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
      dispatch(loginUser(values, props.router.navigate));
      setTimeout(() => {
        setLoginLoading(false);
      }, 500);
    },
  });

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
        setLoginLoading(false);
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  return (
    <StyleWrapper>
      <LoginCard>
        <div style={{ padding: "30px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <img src={logo} alt="Logo" style={{ height: "60px", marginBottom: "20px" }} />
            <Title level={3} style={{ marginBottom: "8px" }}>Welcome Back!</Title>
            <Text type="secondary">Sign in to continue to AINFINITY</Text>
          </div>

          {error && (
            <Alert 
              type="error" 
              message={error} 
              style={{ marginBottom: "20px", borderRadius: "8px" }}
            />
          )}

          <Form
            layout="vertical"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Form.Item 
              label={<Text strong>Email</Text>}
              validateStatus={validation.touched.email && validation.errors.email ? "error" : ""}
              help={validation.touched.email && validation.errors.email ? validation.errors.email : ""}
            >
              <InputWithIcon
                prefix={<Mail size={18} style={{ color: "#94a3b8", marginRight: "8px" }} />}
                name="email"
                type="email"
                placeholder="Enter your email"
                value={validation.values.email}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </Form.Item>

            <Form.Item 
              label={<Text strong>Password</Text>}
              validateStatus={validation.touched.password && validation.errors.password ? "error" : ""}
              help={validation.touched.password && validation.errors.password ? validation.errors.password : ""}
            >
              <InputWithIconPassword
                prefix={<Lock size={18} style={{ color: "#94a3b8", marginRight: "8px" }} />}
                name="password"
                placeholder="Enter your password"
                value={validation.values.password}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
            </Form.Item>

            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <Link to="/forgot-password" style={{ color: "#3b82f6" }}>
                Forgot password?
              </Link>
            </div>

            <GradientButton
              type="primary"
              block
              onClick={(e) => {
                setLoginLoading(true);
                e.preventDefault();
                validation.handleSubmit();
              }}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <Space>
                  <SpinningLoader />
                  Signing in...
                </Space>
              ) : (
                "Sign In"
              )}
            </GradientButton>
          </Form>
        </div>
      </LoginCard>
    </StyleWrapper>
  );
};

export default withRouter(Signin);