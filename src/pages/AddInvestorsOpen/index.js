/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import dayjs from "dayjs";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { useNavigate, useParams } from "react-router-dom";
import {
  formItemLayout,
  onlyNumberRegExp,
  PanCardRegExp,
  tailFormItemLayout,
} from "../../Constants/Const";
import Loader from "../../Component/Loader/Loader";
import dharmaInfoSystemLogo from "../../assets/images/ainfinitylogo.png";
import {
  publicAddInvestor,
  publicPrepareInvestor,
} from "../../slices/generalSetting/generalSettingAPI";
import { UploadOutlined } from "@ant-design/icons";
import {
  DivContainer,
  ImageContainer,
  PdfFileContainer,
  PDFIconConatiner,
} from "../AddInvestors/AddInvestors.styles";
import { FileIcon, Trash2Icon } from "lucide-react";
import { shortString } from "../../Common/CommonFunction";

const AddInvestorsOpen = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;

  const initialFields = {
    userName: null,
    email: null,
    phoneNumber: null,
    firstName: null,
    middleName: null,
    lastName: null,
    // referenceId: null,
    investorTypeId: null,
    paymentSystemId: null,
    // transactionalBankId: null,
    // investorStatusId: null,
    // description: null,
    asOfDate: null,
    openingBalance: null,
    toPayORToReceive: null,
    address1: null,
    address2: null,
    district: null,
    state: null,
    country: null,
    pinCode: null,
    nameAsPerBank: null,
    bankName: null,
    bankAccountNumber: null,
    ifscCode: null,
    aadharCardNumber: null,
    panCardTypeId: null,
    nameAsPerPanCard: null,
    panCardNumber: null,
  };

  const customStyles = usecustomStyles();
  const params = useParams();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState({
    aadharCardFile: [],
    panCardFile: [],
    chequeOrPassbookFile: [],
    bankStatementFile: [],
    signatureFile: [],
  });

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewType, setPreviewType] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const { Option } = Select;
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApiType, contextHolder] = message.useMessage();
  const [getAllInvestorType, setGetAllInvestorType] = useState([]);
  const [getAllPanCardType, setGetAllPanCardType] = useState([]);
  const [allPaymentSystem, setAllPaymentSystem] = useState([]);

  const handleFileChange = ({ fileList: newFileList }, key) => {
    setFileList((prevList) => ({
      ...prevList,
      [key]: newFileList,
    }));
  };

  const handleRemove = (key) => {
    setFileList((prevList) => ({
      ...prevList,
      [key]: [],
    }));
  };

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const investorResponse = await publicPrepareInvestor();

      // const paymentResponse = await publicAddInvestor();
      setGetAllInvestorType(await investorResponse.getAllInvestorType);
      setAllPaymentSystem(await investorResponse.getAllPaymentSystem);
      setGetAllPanCardType(await investorResponse.getAllPanCardType);
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: "error",
        duration: 5,
      });
    }
    setDataLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    const isPdf = file.type === "application/pdf";
    setPreviewType(isPdf ? "pdf" : "image");
    setPreviewContent(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewVisible(false);

  const onFinish = async (item) => {
    // if (
    //   !fileList.aadharCardFile.length ||
    //   !fileList.panCardFile.length ||
    //   !fileList.chequeOrPassbookFile.length ||
    //   !fileList.bankStatementFile.length ||
    //   !fileList.signatureFile.length
    // ) {
    //   message.error("All files are required.");
    //   return;
    // }
    try {
      setFormLoading(true);
      const SubmitedItems = {
        // investorId: params.slug,
        // userName: item.userName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        firstName: item.nameAsPerPanCard,
        middleName: "",
        lastName: "",
        // referenceId: 0,
        investorTypeId: +item.investorTypeId,
        paymentSystemId: +item.paymentSystemId,
        // transactionalBankId: 0,
        // investorStatusId: 0,
        // description: item.description,
        asOfDate: "",
        openingBalance: 0,
        toPayORToReceive: "",
        address1: item.address1,
        address2: item.address2,
        district: item.district,
        state: item.state,
        country: item.country,
        pinCode: item.pinCode,
        nameAsPerBank: item.nameAsPerPanCard,
        bankName: item.bankName,
        bankAccountNumber: item.bankAccountNumber,
        ifscCode: item.ifscCode,
        aadharCardNumber: item.aadharCardNumber,
        panCardTypeId: item.panCardTypeId,
        nameAsPerPanCard: item.nameAsPerPanCard,
        panCardNumber: item.panCardNumber,
      };
      const formData = new FormData();
      if (!!fileList.aadharCardFile.length) {
        formData.append(
          "aadharCardFile",
          fileList.aadharCardFile[0].originFileObj
        );
      }
      if (!!fileList.panCardFile.length) {
        formData.append("panCardFile", fileList.panCardFile[0].originFileObj);
      }
      if (!!fileList.chequeOrPassbookFile.length) {
        formData.append(
          "chequeOrPassbookFile",
          fileList.chequeOrPassbookFile[0].originFileObj
        );
      }
      if (!!fileList.bankStatementFile.length) {
        formData.append(
          "bankStatementFile",
          fileList.bankStatementFile[0].originFileObj
        );
      }
      if (!!fileList.signatureFile.length) {
        formData.append(
          "signatureFile",
          fileList.signatureFile[0].originFileObj
        );
      }
      formData.append("addInvestorRequest", JSON.stringify(SubmitedItems));
      // TODO: Due To Same User ID Edit Role API NOt Working
      const response = await publicAddInvestor(formData);
      if (response.status === "success") {
        navigate("/investors");
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
        duration: 5,
      });
    }
    setFormLoading(false);
  };

  const uploadProps = (key) => ({
    accept: ".pdf,.jpg,.jpeg,.png,.HEIC",
    fileList: fileList[key],
    beforeUpload: () => false,
    onChange: (info) => handleFileChange(info, key),
    onPreview: handlePreview,
  });
  return (
    <>
      <div>{contextHolder}</div>
      {dataLoading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
        <>
          <div
            style={{
              backgroundColor: customStyles?.colorSuccessBg,
              padding: "2% 3%",
            }}
          >
            <div style={{ margin: "auto", display: "flex", marginBottom: 10 }}>
              <img
                alt="Brand logo"
                src={dharmaInfoSystemLogo}
                height={60}
                style={{ lineHeight: "24px", margin: "auto" }}
                className="brand-dark-logo ant-mx-auto"
              />
            </div>
            <Row gutter={[24]}>
              <Col
                xs={24}
                className="gutter-row"
                style={{ marginBottom: customStyles.margin }}
              >
                <Card
                  title={!!params.slug ? `Update Investor` : "Add Investor"}
                  style={{ margin: `${customStyles.margin}px 0px` }}
                >
                  <Form
                    {...formItemLayout}
                    form={form}
                    layout="vertical"
                    name="register"
                    onFinish={onFinish}
                    initialValues={initialFields}
                    scrollToFirstError
                  >
                    <Row gutter={[24, 8]}>
                      <Divider orientation="left">Basic Details</Divider>
                      {/* nameAsPerPanCard*/}
                      <Col xs={24} sm={12} md={12} lg={24}>
                        <Form.Item
                          name="nameAsPerPanCard"
                          label="Name As Per PanCard"
                          labelCol={2}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Name!",
                            },
                            { whitespace: true },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Name As Per Pan Card" />
                        </Form.Item>
                      </Col>
                      {/* userName */}
                      {/* <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="userName"
                          label="Investor ID"
                          labelCol={2}
                          disabled
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Investor ID!",
                            },
                            { whitespace: true },
                            { min: 3 },
                          ]}
                          hasFeedback={true}
                        >
                          <Input
                            disabled={!!params.slug}
                            placeholder="Investor ID"
                          />
                        </Form.Item>
                      </Col> */}
                      {/* firstName */}
                      {/* <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                          name="firstName"
                          label="First Name"
                          labelCol={2}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter First Name!",
                            },
                            { whitespace: true },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor First Name" />
                        </Form.Item>
                      </Col> */}
                      {/* middleName */}
                      {/* <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                          name="middleName"
                          label="Middle Name"
                          labelCol={2}
                          rules={[{ whitespace: true }]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Middle Name" />
                        </Form.Item>
                      </Col> */}
                      {/* lastName */}
                      {/* <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                          name="lastName"
                          label="Last Name"
                          labelCol={2}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Last Name!",
                            },
                            { whitespace: true },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Last Name" />
                        </Form.Item>
                      </Col> */}
                      {/* email */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="email"
                          label="Email"
                          labelCol={2}
                          rules={[
                            {
                              type: "email",
                              required: true,
                              message: "Please Enter Email!",
                            },
                            { whitespace: true },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Email" />
                        </Form.Item>
                      </Col>
                      {/* phoneNumber */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="phoneNumber"
                          label="Phone Number"
                          labelCol={2}
                          rules={[
                            {
                              // type: "number",
                              required: true,
                              message: "Please Enter Phone Number!",
                            },
                            { whitespace: true },
                            { min: 10 },
                            { max: 10 },
                          ]}
                          hasFeedback={true}
                        >
                          <Input
                            type="number"
                            style={{ minWidth: "100%" }}
                            placeholder="Investor Phone Number"
                          />
                        </Form.Item>
                      </Col>
                      <Divider orientation="left">Investment Details</Divider>
                      {/* investorTypeId */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="investorTypeId"
                          label="Investor Type"
                          rules={[
                            {
                              required: true,
                              message: "Please Select Investor Type!",
                            },
                          ]}
                          hasFeedback={true}
                        >
                          <Select placeholder="Select Investor Type">
                            <Option value={0}>--Na</Option>
                            {/* //TODO: for Stop API Call Remove Commented */}
                            {Array.isArray(getAllInvestorType) &&
                            getAllInvestorType.length > 0 ? (
                              getAllInvestorType.map((item) => (
                                <Option
                                  key={item?.investorTypeId}
                                  value={item?.investorTypeId}
                                >{`${
                                  !!item?.name ? item?.name : "- NA"
                                }`}</Option>
                              ))
                            ) : (
                              <Option value={0}>0 L</Option>
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      {/* getTransactionalBank */}
                      {/* <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="transactionalBankId"
                          label="All Transactional Bank"
                          rules={[
                            {
                              required: true,
                              message: "Please Select Payment System!",
                            },
                          ]}
                          hasFeedback={true}
                        >
                          <Select placeholder="Select Payment System">
                            {Array.isArray(getTransactionalBank) &&
                              getTransactionalBank.length > 0 &&
                              getTransactionalBank.map((item) => (
                                <Option
                                  key={item?.transactionalBankId}
                                  value={item?.transactionalBankId}
                                >
                                  {item?.name}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col> */}

                      {/* paymentSystemId */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="paymentSystemId"
                          label="Payment System"
                          rules={[
                            {
                              required: true,
                              message: "Please Select Payment System!",
                            },
                          ]}
                          hasFeedback={true}
                        >
                          <Select placeholder="Select Payment System">
                            <Option value={0}>--Na</Option>
                            {/* //TODO: for Stop API Call Remove Commented */}
                            {Array.isArray(allPaymentSystem) &&
                              allPaymentSystem.length > 0 &&
                              allPaymentSystem.map((item) => (
                                <Option
                                  key={item?.paymentSystemId}
                                  value={item?.paymentSystemId}
                                >
                                  {item?.name || "- NA"}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      {/* openingBalance */}
                      {/* <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="openingBalance"
                          label="Opening Balance"
                          rules={[
                            {
                              required: true,
                              message: "Please Input Transaction amount!",
                            },
                          ]}
                          hasFeedback
                        >
                          <InputNumber
                            placeholder="Transaction Amount"
                            style={{
                              width: "100%",
                            }}
                            // min={0}
                            onChange={(values) => {
                              console.log("values: ", values);
                              // return values.replace("-", "");
                            }}
                          />
                        </Form.Item>
                      </Col> */}
                      {/* toPayORToReceive */}
                      {/* <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                          name="toPayORToReceive"
                          label="Transaction"
                          rules={[
                            { required: true, message: "Please pick an item!" },
                          ]}
                          hasFeedback={true}
                          style={{ minWidth: "100%" }}
                        >
                          <Radio.Group style={{ minWidth: "100%" }}>
                            <Radio.Button
                              value="toPay"
                              style={{ minWidth: "50%" }}
                            >
                              To Pay
                            </Radio.Button>
                            <Radio.Button
                              value="toReceive"
                              style={{ minWidth: "50%" }}
                            >
                              To Receive
                            </Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                      </Col> */}
                      {/* asOfDate */}
                      {/* <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="asOfDate"
                          label="As of Date"
                          rules={[
                            {
                              required: true,
                              message: "Please Select As of Date!",
                            },
                          ]}
                          size="small"
                        >
                          <DatePicker
                            name="asOfDate"
                            placeholder="DD-MM-YY"
                            placement="topLeft"
                            style={{
                              boxShadow: "none",
                              outline: "none",
                              width: "100%",
                            }}
                            defaultValue={dayjs().format("DD-MM-YY")}
                            format="DD-MM-YY"
                          />
                        </Form.Item>
                      </Col> */}
                      {/* referenceId */}
                      {/* <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="referenceId"
                          label="Reference Person"
                          rules={[
                            {
                              required: true,
                              message: "Please Select userId!",
                            },
                          ]}
                          hasFeedback={true}
                          loading={loading}
                        >
                          <Select
                            showSearch
                            placeholder="Type Investor Name"
                            filterOption={(input, option) => {
                              setUserInput(input);
                            }}
                            loading={false}
                          >
                            <Option defaultValue value={0}>
                              - NA
                            </Option>
                            {Array.isArray(allInvestor) &&
                              allInvestor.length > 0 &&
                              allInvestor?.map((item) => (
                                <Option value={item?.userId}>
                                  {!!params.slug ? (
                                    <span>{`${item?.userId} - ${item?.firstName} ${item?.lastName}`}</span>
                                  ) : (
                                    <span>{`${item?.firstName} ${item?.lastName}`}</span>
                                  )}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col> */}

                      <Divider orientation="left">Bank Account Details</Divider>
                      {/* nameAsPerBank */}
                      {/* <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="nameAsPerBank"
                          label="Investor Name As Per Bank"
                          labelCol={2}
                          disabled
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Investor Name!",
                            },
                            { whitespace: true },
                            { min: 3 },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Name" />
                        </Form.Item>
                      </Col> */}
                      {/* bankName */}
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="bankName"
                          label="Bank Name"
                          labelCol={2}
                          disabled
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Bank Name!",
                            },
                            { whitespace: true },
                            { min: 3 },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Bank Name" />
                        </Form.Item>
                      </Col>

                      {/* bankAccountNumber */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="bankAccountNumber"
                          label="Bank Account Number"
                          labelCol={2}
                          rules={[
                            {
                              // type: "number",
                              required: true,
                              message: "Please Enter Bank Account Number!",
                            },
                            { whitespace: true },
                          ]}
                          hasFeedback={true}
                        >
                          <Input
                            type="number"
                            style={{ minWidth: "100%" }}
                            placeholder="Investor Bank Account Number"
                          />
                        </Form.Item>
                      </Col>

                      {/* ifscCode */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="ifscCode"
                          label="IFSC"
                          labelCol={2}
                          disabled
                          rules={[
                            {
                              required: true,
                              message: "Please Enter IFSC!",
                            },
                            { whitespace: true },
                            { min: 3 },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="IFSC" />
                        </Form.Item>
                      </Col>
                      {/* Pan Card Account Type */}
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                          name="panCardTypeId"
                          label="Pan Card Account Type"
                          rules={[
                            { required: true, message: "Please pick an item!" },
                          ]}
                          hasFeedback={true}
                          style={{ minWidth: "100%" }}
                        >
                          <Radio.Group style={{ minWidth: "100%" }}>
                            {getAllPanCardType.length > 0 ? (
                              getAllPanCardType.map((item) => {
                                return (
                                  <Radio.Button
                                    value={item.panCardTypeId}
                                    style={{ minWidth: "33%" }}
                                  >
                                    {item.name}
                                  </Radio.Button>
                                );
                              })
                            ) : (
                              <Radio.Button
                                value={0}
                                style={{ minWidth: "100%" }}
                              >
                                -- NA
                              </Radio.Button>
                            )}
                          </Radio.Group>
                        </Form.Item>
                      </Col>

                      {/* panCardNumber*/}
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                          name="panCardNumber"
                          label="Pan Card"
                          labelCol={2}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Pan Card Number!",
                            },
                            { whitespace: true },
                            {
                              pattern: PanCardRegExp,
                              message: "Please Enter Valid Pan Number",
                            },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Pan Card" />
                        </Form.Item>
                      </Col>

                      {/* aadharCardNumber */}
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                          name="aadharCardNumber"
                          label="Aadhar Card"
                          labelCol={2}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Aadhar Card Number!",
                            },
                            { whitespace: true },
                            { min: 12 },
                            { max: 12 },
                            {
                              pattern: onlyNumberRegExp,
                              message: "Please Enter Valid Aadhar Number",
                            },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Aadhar Card" />
                        </Form.Item>
                      </Col>

                      <Divider orientation="left">Personal Details</Divider>

                      {/* address1 */}
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="address1"
                          label="Address"
                          labelCol={2}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Address!",
                            },
                            { whitespace: true },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Address Line 1" />
                        </Form.Item>
                        <Form.Item
                          name="address2"
                          labelCol={2}
                          hasFeedback={true}
                        >
                          <Input placeholder="Investor Address  Line 2" />
                        </Form.Item>
                      </Col>
                      {/* district */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="district"
                          label="District"
                          labelCol={2}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter district!",
                            },
                            { whitespace: true },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="district" />
                        </Form.Item>
                      </Col>
                      {/* state */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="state"
                          label="State"
                          rules={[
                            {
                              required: true,
                              message: "Please Select State!",
                            },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="state" />
                        </Form.Item>
                      </Col>
                      {/* pinCode */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="pinCode"
                          label="PinCode"
                          labelCol={2}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Postal / Zip Code!",
                            },
                          ]}
                          hasFeedback={true}
                        >
                          <Input
                            style={{ minWidth: "100%" }}
                            placeholder="PinCode"
                          />
                        </Form.Item>
                      </Col>
                      {/* country */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                          name="country"
                          label="Country"
                          rules={[
                            {
                              required: true,
                              message: "Please Select Country!",
                            },
                          ]}
                          hasFeedback={true}
                        >
                          <Input placeholder="Country" />
                        </Form.Item>
                      </Col>

                      <Divider orientation="left">Documents Upload</Divider>

                      {/* aadharCardFile */}
                      <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                          name="aadharCardFile"
                          label="Aadhar Card"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Aadhar Card is required",
                          //   },
                          // ]}
                        >
                          {fileList.aadharCardFile.length === 0 ? (
                            <Upload {...uploadProps("aadharCardFile")}>
                              <Button icon={<UploadOutlined />}>
                                Select File
                              </Button>
                            </Upload>
                          ) : (
                            <DivContainer>
                              {fileList.aadharCardFile[0].type ===
                              "application/pdf" ? (
                                <PdfFileContainer
                                  onClick={() =>
                                    handlePreview(fileList.aadharCardFile[0])
                                  }
                                >
                                  <PDFIconConatiner>
                                    <FileIcon />
                                  </PDFIconConatiner>
                                  {shortString(
                                    fileList.aadharCardFile?.[0]?.name,
                                    38
                                  )}
                                </PdfFileContainer>
                              ) : (
                                <ImageContainer
                                  onClick={() =>
                                    handlePreview(fileList.aadharCardFile[0])
                                  }
                                >
                                  <img
                                    alt="Aadhar Card Preview"
                                    src={URL.createObjectURL(
                                      fileList.aadharCardFile[0].originFileObj
                                    )}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "contain",
                                    }}
                                  />
                                  {shortString(
                                    fileList.aadharCardFile?.[0]?.name,
                                    35
                                  )}
                                </ImageContainer>
                              )}
                              <Button
                                onClick={() => handleRemove("aadharCardFile")}
                                style={{
                                  border: "none",
                                  textAlign: "center",
                                }}
                                textAlign="center"
                              >
                                <Trash2Icon color="red" />
                              </Button>
                            </DivContainer>
                          )}
                        </Form.Item>
                      </Col>
                      {/* panCardFile */}
                      <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                          name="panCardFile"
                          label="Pan Card"
                          // rules={[
                          //   { required: true, message: "Pan Card is required" },
                          // ]}
                        >
                          {fileList.panCardFile.length === 0 ? (
                            <Upload {...uploadProps("panCardFile")}>
                              <Button icon={<UploadOutlined />}>
                                Select File
                              </Button>
                            </Upload>
                          ) : (
                            <DivContainer>
                              {fileList.panCardFile[0].type ===
                              "application/pdf" ? (
                                <PdfFileContainer
                                  onClick={() =>
                                    handlePreview(fileList.panCardFile[0])
                                  }
                                >
                                  <PDFIconConatiner>
                                    <FileIcon />
                                  </PDFIconConatiner>
                                  {shortString(
                                    fileList.panCardFile?.[0]?.name,
                                    38
                                  )}
                                </PdfFileContainer>
                              ) : (
                                <ImageContainer
                                  onClick={() =>
                                    handlePreview(fileList.panCardFile[0])
                                  }
                                >
                                  <img
                                    alt="Pan Card Preview"
                                    src={URL.createObjectURL(
                                      fileList.panCardFile[0].originFileObj
                                    )}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "contain",
                                    }}
                                  />
                                  {shortString(
                                    fileList.panCardFile?.[0]?.name,
                                    35
                                  )}
                                </ImageContainer>
                              )}
                              <Button
                                onClick={() => handleRemove("panCardFile")}
                                style={{
                                  border: "none",
                                  textAlign: "center",
                                }}
                                textAlign="center"
                              >
                                <Trash2Icon color="red" />
                              </Button>
                            </DivContainer>
                          )}
                        </Form.Item>
                      </Col>
                      {/* chequeOrPassbookFile */}
                      <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                          name="chequeOrPassbookFile"
                          label="cheque/Passbook File"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Cheque OR Passbook File is required",
                          //   },
                          // ]}
                        >
                          {fileList.chequeOrPassbookFile.length === 0 ? (
                            <Upload {...uploadProps("chequeOrPassbookFile")}>
                              <Button icon={<UploadOutlined />}>
                                Select File
                              </Button>
                            </Upload>
                          ) : (
                            <DivContainer>
                              {fileList.chequeOrPassbookFile[0].type ===
                              "application/pdf" ? (
                                <PdfFileContainer
                                  onClick={() =>
                                    handlePreview(
                                      fileList.chequeOrPassbookFile[0]
                                    )
                                  }
                                >
                                  <PDFIconConatiner>
                                    <FileIcon />
                                  </PDFIconConatiner>
                                  {shortString(
                                    fileList.chequeOrPassbookFile?.[0]?.name,
                                    38
                                  )}
                                </PdfFileContainer>
                              ) : (
                                <ImageContainer
                                  onClick={() =>
                                    handlePreview(
                                      fileList.chequeOrPassbookFile[0]
                                    )
                                  }
                                >
                                  <img
                                    alt="Cheque OR Passbook File Preview"
                                    src={URL.createObjectURL(
                                      fileList.chequeOrPassbookFile[0]
                                        .originFileObj
                                    )}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "contain",
                                    }}
                                  />
                                  {shortString(
                                    fileList.chequeOrPassbookFile?.[0]?.name,
                                    35
                                  )}
                                </ImageContainer>
                              )}
                              <Button
                                onClick={() =>
                                  handleRemove("chequeOrPassbookFile")
                                }
                                style={{
                                  border: "none",
                                  textAlign: "center",
                                }}
                                textAlign="center"
                              >
                                <Trash2Icon color="red" />
                              </Button>
                            </DivContainer>
                          )}
                        </Form.Item>
                      </Col>
                      {/* bankStatementFile */}
                      <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                          name="bankStatementFile"
                          label="Bank Statement File"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Bank Statement File is required",
                          //   },
                          // ]}
                        >
                          {fileList.bankStatementFile.length === 0 ? (
                            <Upload {...uploadProps("bankStatementFile")}>
                              <Button icon={<UploadOutlined />}>
                                Select File
                              </Button>
                            </Upload>
                          ) : (
                            <DivContainer>
                              {fileList.bankStatementFile[0].type ===
                              "application/pdf" ? (
                                <PdfFileContainer
                                  onClick={() =>
                                    handlePreview(fileList.bankStatementFile[0])
                                  }
                                >
                                  <PDFIconConatiner>
                                    <FileIcon />
                                  </PDFIconConatiner>
                                  {shortString(
                                    fileList.bankStatementFile?.[0]?.name,
                                    38
                                  )}
                                </PdfFileContainer>
                              ) : (
                                <ImageContainer
                                  onClick={() =>
                                    handlePreview(fileList.bankStatementFile[0])
                                  }
                                >
                                  <img
                                    alt="Bank Statement File Preview"
                                    src={URL.createObjectURL(
                                      fileList.bankStatementFile[0]
                                        .originFileObj
                                    )}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "contain",
                                    }}
                                  />
                                  {shortString(
                                    fileList.bankStatementFile?.[0]?.name,
                                    35
                                  )}
                                </ImageContainer>
                              )}
                              <Button
                                onClick={() =>
                                  handleRemove("bankStatementFile")
                                }
                                style={{
                                  border: "none",
                                  textAlign: "center",
                                }}
                                textAlign="center"
                              >
                                <Trash2Icon color="red" />
                              </Button>
                            </DivContainer>
                          )}
                        </Form.Item>
                      </Col>
                      {/* signatureFile */}
                      <Col xs={24} sm={24} md={24} lg={12}>
                        <Form.Item
                          name="signatureFile"
                          label="Signature File"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Signature File is required",
                          //   },
                          // ]}
                        >
                          {fileList.signatureFile.length === 0 ? (
                            <Upload {...uploadProps("signatureFile")}>
                              <Button icon={<UploadOutlined />}>
                                Select File
                              </Button>
                            </Upload>
                          ) : (
                            <DivContainer>
                              {fileList.signatureFile[0].type ===
                              "application/pdf" ? (
                                <PdfFileContainer
                                  onClick={() =>
                                    handlePreview(fileList.signatureFile[0])
                                  }
                                >
                                  <PDFIconConatiner>
                                    <FileIcon />
                                  </PDFIconConatiner>
                                  {shortString(
                                    fileList.signatureFile?.[0]?.name,
                                    38
                                  )}
                                </PdfFileContainer>
                              ) : (
                                <ImageContainer
                                  onClick={() =>
                                    handlePreview(fileList.signatureFile[0])
                                  }
                                >
                                  <img
                                    alt="Signature File Preview"
                                    src={URL.createObjectURL(
                                      fileList.signatureFile[0].originFileObj
                                    )}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "contain",
                                    }}
                                  />
                                  {shortString(
                                    fileList.signatureFile?.[0]?.name,
                                    35
                                  )}
                                </ImageContainer>
                              )}
                              <Button
                                onClick={() => handleRemove("signatureFile")}
                                style={{
                                  border: "none",
                                  textAlign: "center",
                                }}
                                textAlign="center"
                              >
                                <Trash2Icon color="red" />
                              </Button>
                            </DivContainer>
                          )}
                        </Form.Item>
                      </Col>
                      {/* description */}
                      {/* <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="description"
                          label="Remarks / Description"
                        >
                          <Input.TextArea showCount maxLength={500} />
                        </Form.Item>
                      </Col> */}
                    </Row>
                    <Row gutter={[24, 0]}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item {...tailFormItemLayout}>
                          <Button
                            htmlType="submit"
                            type="primary"
                            style={{ width: "100%", margin: "10px 0px 0px" }}
                            loading={formLoading}
                          >
                            {!!params.slug ? "Update Investor" : "Add Investor"}
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    {previewType === "image" ? (
                      <img
                        alt="Preview"
                        style={{ width: "100%" }}
                        src={previewContent}
                      />
                    ) : (
                      <iframe
                        title="PDF Preview"
                        src={previewContent}
                        style={{ width: "100%", height: "500px" }}
                      />
                    )}
                  </Modal>
                  {/* )} */}
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
};

export default AddInvestorsOpen;
