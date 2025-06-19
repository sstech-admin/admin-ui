import React, { useEffect, useState } from "react";
import usecustomStyles from "../../Common/customStyles";
import { Button, Card, Col, Form, Input, Row } from "antd";
import ParticleAuth from "../../Common/ParticleAuth";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser, apiError, resetRegisterFlag } from "../../slices/thunk";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

const customStyles = usecustomStyles();

const StyleWrapper = styled.div`
  background-color: ${({ theme }) => theme.token.authbgcolor};
`;

const Register = () => {
  // page title
  document.title = "Register" + process.env.REACT_APP_PAGE_TITLE;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [passwordShow, setPasswordShow] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loader, setLoader] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Email"),
      username: Yup.string().required("Please Enter Username"),
      password: Yup.string()
        .required("Please Enter Password")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values));
      setLoader(true);
    },
  });

  const selectAccount = createSelector(
    (state) => state.Account,
    (account) => ({
      success: account.success,
      error: account.error,
    })
  );

  const { error, success } = useSelector(selectAccount);

  useEffect(() => {
    dispatch(apiError());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => navigate("/login"), 3000);
      setTimer(3);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);

    setLoader(false);
  }, [dispatch, success, error, navigate]);

  useEffect(() => {
    if (timer) {
      setInterval(() => setTimer(timer - 1), 1000);
    }
  }, [timer]);

  return (
    <StyleWrapper className="auth-page-wrapper">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={24} md={20} lg={14}>
          <Card>
            <Row gutter={[16, 24]} justify='center'>
              <ParticleAuth />
              <Col xs={24} md={20} lg={14} >
                <Card style={{ border: "0px" }}>
                  <div className="text-center" style={{ margin: "20px" }}>
                    <h5
                      style={{
                        fontSize: "20px",
                        color: customStyles.colorPrimary,
                      }}
                    >
                      Create New Account
                    </h5>
                    <p>Get Your Dharma InfoSystem Account Now</p>
                  </div>
                  <div style={{ marginTop: "10px", padding: "20px 40px" , paddingTop: 20 }}>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div>
                        <label
                          style={{ marginBottom: "4px", display: "block" }}
                        >
                          Email{" "}
                          <span style={{ color: customStyles.colorDanger }}>
                            *
                          </span>
                        </label>
                        <Input
                          name="email"
                          type="email"
                          style={{
                            marginBottom: customStyles.marginXS,
                            boxShadow: "none",
                            outline: "none",
                          }}
                          value={validation.values.email || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          onInvalid={
                            validation.touched.email && validation.errors.email
                              ? validation.touched.email
                              : undefined
                          }
                          status={
                            validation.touched.email && validation.errors.email
                              ? "error"
                              : true
                          }
                        />
                        {validation.touched.email &&
                          validation.errors.email && (
                            <p style={{ color: customStyles.colorDanger }}>
                              {validation.errors.email}
                            </p>
                          )}
                      </div>
                      <div>
                        <label
                          style={{ display: "block", marginBottom: "4px" }}
                        >
                          Username{" "}
                          <span style={{ color: customStyles.colorDanger }}>
                            *
                          </span>
                        </label>
                        <Input
                          name="username"
                          type="text"
                          style={{
                            marginBottom: customStyles.marginXS,
                            boxShadow: "none",
                            outline: "none",
                          }}
                          value={validation.values.username || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          onInvalid={
                            validation.touched.username &&
                            validation.errors.username
                              ? validation.touched.username
                              : undefined
                          }
                          status={
                            validation.touched.username &&
                            validation.errors.username
                              ? "error"
                              : true
                          }
                        />
                        {validation.touched.username &&
                          validation.errors.username && (
                            <p style={{ color: customStyles.colorDanger }}>
                              {validation.errors.username}
                            </p>
                          )}
                      </div>
                      <div>
                        <label
                          style={{ display: "block", marginBottom: "4px" }}
                        >
                          Password
                        </label>
                        <Input
                          name="password"
                          style={{
                            marginBottom: customStyles.marginXS,
                            boxShadow: "none",
                            outline: "none",
                          }}
                          value={validation.values.password || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          onInvalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? validation.touched.password
                              : undefined
                          }
                          status={
                            validation.touched.password &&
                            validation.errors.password
                              ? "error"
                              : true
                          }
                        />
                        {validation.touched.password &&
                          validation.errors.password && (
                            <p style={{ color: customStyles.colorDanger }}>
                              {validation.errors.password}
                            </p>
                          )}
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ width: "100%" }}
                          onClick={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                          loading={loader}
                        >
                          {" "}
                          Sign Up
                        </Button>
                      </div>
                    </Form>
                    <div style={{ marginTop: "50px" }} className="text-center">
                      <p>
                        Already have an account ?{" "}
                        <a
                          href="/auth-signin"
                          style={{
                            marginRight: "5px",
                            textDecoration: "underline",
                            fontWeight: "bold",
                          }}
                        >
                          Sign In
                        </a>
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </StyleWrapper>
  );
};

export default Register;
