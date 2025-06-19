/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { pdfjs } from "react-pdf";
import {
  Button,
  Card,
  Checkbox,
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
  Spin,
  Upload,
} from "antd";
import dayjs from "dayjs";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { useDispatch } from "react-redux";
import {
  GetAllInvestor,
  getAllPanCardType,
  getAllTransactionalBank,
  GetInvestor,
  updateInvestor,
  getReferences,
  GetAllUsers,
} from "../../slices/Invester/investerAPI";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllInvestorTypeAction,
  getAllPaymentSystemAction,
} from "../../slices/generalSetting/generalSettingthunk";
import {
  formItemLayout,
  onlyNumberRegExp,
  PanCardRegExp,
  tailFormItemLayout,
} from "../../Constants/Const";
import { debounce } from "lodash";
import Loader from "../../Component/Loader/Loader";
import { UploadOutlined } from "@ant-design/icons";
import { FileIcon, Trash2Icon, Plus, Minus } from "lucide-react";
import {
  DivContainer,
  ImageContainer,
  PdfFileContainer,
  PDFIconConatiner,
} from "./EditInvestors.styles";
import { shortString } from "../../Common/CommonFunction";
import EditFileShow from "../EditFileShow";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getAllAccount } from "../../slices/generalSetting/generalSettingAPI";

dayjs.extend(customParseFormat);

const EditInvestors = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const initialFields = {
    userName: null,
    email: null,
    phoneNumber: null,
    firstName: null,
    middleName: null,
    lastName: null,
    referenceId: null,
    investorTypeId: null,
    paymentSystemId: null,
    transactionalBankId: null,
    investorStatusId: null,
    description: null,
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
    nomineeName: null,
    nomineeRelation: null,
    nomineeAadharCardNumber: null,
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
  // const [documentLoading, setDocumentLoading] = useState(false);
  const dispatch = useDispatch();
  const { Option } = Select;
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const [formfields, setFormFields] = useState({});
  const [dateState, setDateState] = useState(dayjs().format("DD MMM YYYY"));
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [allInvestor, setAllInvestor] = useState("");
  const [messageApiType, contextHolder] = message.useMessage();
  const [getAllInvestorType, setGetAllInvestorType] = useState([]);
  const [getReference, setGetReferences] = useState([]);
  const [getParentUsers, setGetParentUsers] = useState([]);
  const [allPaymentSystem, setAllPaymentSystem] = useState([]);
  const [getAllPanCardTypeData, setGetAllPanCardTypeData] = useState([]);
  const [allGetFileDocumnet, setAllGetFileDocumnet] = useState({
    aadharCardURL: null,
    panCardURL: null,
    chequeORPassbookURL: null,
    bankStatementURL: null,
    signatureURL: null,
  });
  const [initialAllGetFileDocumnet, setInitialAllGetFileDocumnet] = useState({
    aadharCardURL: null,
    panCardURL: null,
    chequeORPassbookURL: null,
    bankStatementURL: null,
    signatureURL: null,
  });
  const [allBankAccount, setAllBankAccount] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [defaultAmountValue, setDefaultAmountValue] = useState();
  const [getTransactionalBank, setGetTransactionalBank] = useState([]);


  
  const [amount, setAmount] = useState(500000); // Start from 500,000
  const step = 500000;
  const minAmount = 500000;

  const increaseAmount = () => {
    const newAmount = amount + step;
    setAmount(newAmount);
    form.setFieldsValue({ investorTypeId: newAmount });
  };

  const decreaseAmount = () => {
    if (amount > minAmount) {
      const newAmount = amount - step;
      setAmount(newAmount);
      form.setFieldsValue({ investorTypeId: newAmount });
    }
  };



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

  useEffect(() => {
    console.log("params", params);
    console.log("formfields", formfields);
    if (!!params.slug && formfields) {
      const formValues = {
        ...formfields,
        asOfDate: dayjs(dateState, "DD MMM YYYY"),
      };

      // Ensure Aadhar numbers are properly formatted
      if (formValues.nomineeAadharCardNumber) {
        formValues.nomineeAadharCardNumber =
          formValues.nomineeAadharCardNumber.toString();
      }

      form.setFieldsValue(formValues);
    }
  }, [dateState, params.slug, formfields]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const investorResponse = await dispatch(
        getAllInvestorTypeAction()
      ).unwrap();

      const paymentResponse = await dispatch(
        getAllPaymentSystemAction()
      ).unwrap();
      const getAllTransactionalBankResponse = await getAllTransactionalBank();
      const getAllPanCardTypeResponse = await getAllPanCardType();
      const getReferencesResponse = await getReferences();
      const getUsersResponse = await GetAllUsers();
      const getAllAccountResponse = await getAllAccount({
        page: 1,
        limit: 50,
      });

      // const getAllAccountResponse = "test";
      setGetTransactionalBank(await getAllTransactionalBankResponse.data);
      setGetAllInvestorType(await investorResponse.data);
      setAllPaymentSystem(await paymentResponse.data);
      setGetAllPanCardTypeData(await getAllPanCardTypeResponse.data);
      setAllBankAccount(await getAllAccountResponse.data);
      setGetReferences(await getReferencesResponse.results)
      setGetParentUsers(await getUsersResponse.data.users)
      if (!!params.slug) {
        const response = await GetInvestor({
          userId: params.slug,
        });
        console.log("responseee", response);

        if (response?.success === true) {
          setFormFields(response.data);
          form.setFieldsValue({
            transactionalBankId: response?.data?.transactionalBankId,
          });
          setDateState(dayjs(response.data.asOfDate).format("DD MMM YYYY"));
          setAllGetFileDocumnet({
            aadharCardURL: response.data.aadharCardURL,
            panCardURL: response.data.panCardURL,
            chequeORPassbookURL: response.data.chequeORPassbookURL,
            bankStatementURL: response.data.bankStatementURL,
            signatureURL: response.data.signatureURL,
          });
          setInitialAllGetFileDocumnet({
            aadharCardURL: response.data.aadharCardURL,
            panCardURL: response.data.panCardURL,
            chequeORPassbookURL: response.data.chequeORPassbookURL,
            bankStatementURL: response.data.bankStatementURL,
            signatureURL: response.data.signatureURL,
          });
        }
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: "error",
        duration: 5,
      });
    }
    setDataLoading(false);
  };

  const allDataFatch = async () => {
    await fetchData();
  };

  useEffect(() => {
    allDataFatch();
  }, []);

  const fetchDataUserName = async () => {
    try {
      setLoading(true);
      setAllInvestor([]);
      const response = await GetAllInvestor({
        page: 1,
        limit: 10,
        search: userInput,
        investorStatusId: 1,
      });
      setAllInvestor(await response?.data);
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
        duration: 5,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataUserName();
  }, [userInput]);

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
    console.log("item: ", item);
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
        investorId: params.slug,
        userName: item.userName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        firstName: item.nameAsPerPanCard,
        middleName: "",
        lastName: "",
        referenceId: item.referenceId,
        investorTypeId: +item.investorTypeId,
        paymentSystemId: +item.paymentSystemId,
        parentUser: item.parentUser ? item.parentUser : '',
        transactionalBankId: +item.transactionalBankId,
        investorStatusId: item.investorStatusId ? 1 : 0,
        description: item.description,
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
        nomineeName: item.nomineeName,
        nomineeAadharCardNumber: item.nomineeAadharCardNumber,
        nomineeRelation: item.nomineeRelation,
        bankAccountNumber: item.bankAccountNumber,
        ifscCode: item.ifscCode,
        aadharCardNumber: item.aadharCardNumber,
        panCardTypeId: item.panCardTypeId,
        nameAsPerPanCard: item.nameAsPerPanCard,
        panCardNumber: item.panCardNumber,
        // paymentReceivedAccountId: 0,
        /*
        first check Initial Document Url not get the directly retun "0" value if get file URl then it will reten false retun then make functionality 
        */
        deleteAadharCardFile: !initialAllGetFileDocumnet?.aadharCardURL
          ? 0
          : !allGetFileDocumnet?.aadharCardURL ||
            fileList.aadharCardFile.length > 0
          ? 1
          : 0,
        deletePanCardFile: !initialAllGetFileDocumnet?.panCardURL
          ? 0
          : !allGetFileDocumnet?.panCardURL || fileList.panCardFile.length > 0
          ? 1
          : 0,
        deleteChequeORPassbookFile:
          !initialAllGetFileDocumnet?.chequeORPassbookURL
            ? 0
            : !allGetFileDocumnet?.chequeORPassbookURL ||
              fileList.chequeOrPassbookFile.length > 0
            ? 1
            : 0,
        deleteBankStatementFile: !initialAllGetFileDocumnet?.bankStatementURL
          ? 0
          : !allGetFileDocumnet?.bankStatementURL ||
            fileList.bankStatementFile.length > 0
          ? 1
          : 0,
        deleteSignatureFile: !initialAllGetFileDocumnet?.signatureURL
          ? 0
          : !allGetFileDocumnet?.signatureURL ||
            fileList.signatureFile.length > 0
          ? 1
          : 0,
      };
      console.log("SubmitedItems: ", SubmitedItems);

      const formData = new FormData();
      if (fileList.aadharCardFile.length > 0) {
        formData.append(
          "aadharCardFile",
          fileList.aadharCardFile[0].originFileObj
        );
      }
      if (fileList.panCardFile.length > 0) {
        formData.append("panCardFile", fileList.panCardFile[0].originFileObj);
      }
      if (fileList.chequeOrPassbookFile.length > 0) {
        formData.append(
          "chequeOrPassbookFile",
          fileList.chequeOrPassbookFile[0].originFileObj
        );
      }

      if (fileList.bankStatementFile.length > 0) {
        formData.append(
          "bankStatementFile",
          fileList.bankStatementFile[0].originFileObj
        );
      }
      if (fileList.signatureFile.length > 0) {
        formData.append(
          "signatureFile",
          fileList.signatureFile[0].originFileObj
        );
      }
      formData.append("updateInvestorRequest ", SubmitedItems);
      const response = await updateInvestor(SubmitedItems);

      if (response.success === true) {
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

  const handleBankNameChange = (e) => {
    const value = e.target.value;
    setFormFields((prev) => ({
      ...prev,
      nameAsPerBank: value,
      nameAsPerPanCard: value,
    }));
    form.setFieldsValue({
      nameAsPerPanCard: value,
    });
  };

  const handleSearch = debounce(async (input) => {
    setUserInput(input);
    if (input) {
      setFetching(true);
      try {
        const response = await GetAllInvestor({
          page: 1,
          limit: 50,
          search: input,
          investorStatusId: 1,
        });
        if (response.status === "success") {
          setAllInvestor(await response?.data);
        } else {
          setAllInvestor([]);
        }
      } catch (error) {
        console.error("Error fetching investors:", error);
        setAllInvestor([]);
      } finally {
        setFetching(false);
      }
    } else {
      setAllInvestor([]);
    }
  }, 1500);

  console.log(",.,,.,.,.,.", fileList.aadharCardFile[0]);
  console.log(",.,,.,.,.,.", !!allGetFileDocumnet?.aadharCardURL);

  // 1. First, let's create a consistent validator for Aadhar numbers
  const aadharValidator = {
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      if (value.length !== 12) {
        return Promise.reject("Aadhar number must be 12 digits");
      }
      if (!onlyNumberRegExp.test(value)) {
        return Promise.reject("Please enter valid Aadhar number");
      }
      return Promise.resolve();
    },
  };

  return (
    <>
      <div>{contextHolder}</div>
      {dataLoading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
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
              {/* {!!params.slug && formfields?.asOfDate && ( */}
              <Form
                {...formItemLayout}
                form={form}
                layout="vertical"
                name="register"
                onFinish={onFinish}
                initialValues={!!params.slug ? formfields : initialFields}
                scrollToFirstError
              >
                <Row gutter={[24, 8]}>
                  <Divider orientation="left">Basic Details</Divider>
                  {/* userName */}
                  {/* <Col xs={24} sm={24} md={24} lg={12}>
                    <Form.Item
                      name="userName"
                      label="Investor ID"
                      labelCol={2}
                      // disabled
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
                        // disabled={!!params.slug}
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
                  {/* nameAsPerPanCard*/}
                  <Col xs={24} sm={24} md={24} lg={12}>
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
                      <Input
                        placeholder="Investor Name As Per Pan Card"
                        value={formfields?.nameAsPerPanCard}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormFields((prev) => ({
                            ...prev,
                            nameAsPerPanCard: value,
                          }));
                        }}
                      />
                    </Form.Item>
                  </Col>
                  {/* firstName */}
                  <Col xs={24} sm={24} md={24} lg={12}>
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
                  </Col>
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
                  <Col xs={24} sm={24} md={24} lg={12}>
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
                  </Col>
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
                        { max: 13 },
                      ]}
                      hasFeedback={true}
                    >
                      <Input
                        addonBefore="+91"
                        type="string"
                        style={{ minWidth: "100%" }}
                        placeholder="Investor Phone Number"
                      />
                    </Form.Item>
                  </Col>
                  <Divider orientation="left">Investment Details</Divider>
                  {/* investorTypeId */}
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item label="Amount" name="amount" rules={[{ message: "Please enter the amount" }]}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Button
                            style={{
                              borderRadius: "50%",
                              height: "25px",
                              width: "25px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 0,
                            }}
                            onClick={decreaseAmount}
                            disabled={amount === minAmount}
                          >
                            <Minus size={20} />
                          </Button>
  
                          <span style={{ fontSize: "16px", fontWeight: "bold", minWidth: "120px", textAlign: "center", color: '#808080' }}>
                            {amount.toLocaleString()}
                          </span>
  
                          <Button
                            style={{
                              borderRadius: "50%",
                              height: "25px",
                              width: "25px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 0,
                            }}
                            onClick={increaseAmount}
                          >
                            <Plus size={20} />
                          </Button>
                        </div>
  
                      </Form.Item>
                    {/* <Form.Item
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
                        {Array.isArray(getAllInvestorType) &&
                        getAllInvestorType.length > 0 ? (
                          getAllInvestorType.map((item) => (
                            <Option
                              key={item?.investorTypeId}
                              value={item?.investorTypeId}
                            >{`${!!item?.name ? item?.name : "- NA"}`}</Option>
                          ))
                        ) : (
                          <Option value={0}>0 L</Option>
                        )}
                      </Select>
                    </Form.Item> */}
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
                      hasFeedback
                      initialValue={
                        Array.isArray(getTransactionalBank) && getTransactionalBank.length > 0
                          ? getTransactionalBank[0]?.id
                          : undefined
                      }
                    >
                      <Select placeholder="Select Payment System">
                        {Array.isArray(getTransactionalBank) &&
                          getTransactionalBank.length > 0 &&
                          getTransactionalBank.map((item) => (
                            <Option key={item?.id} value={item?.id}>
                              {item?.label}
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
                          allPaymentSystem
                          .filter((item) => item?.paymentSystemId !== 7)
                          .map((item) => (
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
                  {/* paymentReceivedAccountId  */}
                  {/* <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      name="paymentReceivedAccountId"
                      label="Payment Received Account"
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
                        {Array.isArray(allBankAccount) &&
                          allBankAccount.length > 0 &&
                          allBankAccount.map(
                            (item) =>
                              item.accountTypeId !== 1 &&
                              item.accountTypeId !== 4 && (
                                <Option
                                  key={item?.accountId}
                                  value={item?.accountId}
                                >
                                  {item?.name || "- NA"}
                                </Option>
                              )
                          )}
                      </Select>
                    </Form.Item>
                  </Col> */}
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
                        <Radio.Button value="toPay" style={{ minWidth: "50%" }}>
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
                  {/* {!!params.slug && formfields?.asOfDate && (
                    <Col xs={24} sm={24} md={12} lg={12}>
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
                          placeholder="DD MMM YYYY"
                          placement="topLeft"
                          style={{
                            boxShadow: "none",
                            outline: "none",
                            width: "100%",
                          }}
                          defaultValue={dayjs(dateState, "DD MMM YYYY")}
                          format="DD MMM YYYY"
                          value={
                            dateState ? dayjs(dateState, "DD MMM YYYY") : null
                          }
                        />
                      </Form.Item>
                    </Col>
                  )} */}

                  {/* referenceId */}
                  
                  <Col xs={24} sm={24} md={24} lg={12}>
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
                        filterOption={false}
                        onSearch={handleSearch}
                        notFoundContent={
                          fetching ? <Spin size="small" /> : null
                        }
                      // filterOption={(input, option) => {
                      //   setUserInput(input);
                      // }}
                      // loading={false}
                      >
                        <Option defaultValue value={0}>
                          - NA
                        </Option>
                        {Array.isArray(getReference) &&
                          getReference.length > 0 &&
                          getReference?.map((item) => (
                            <Option value={item?.referenceId} selected>
                              <span>{`${item?.name}(${item?.referenceId})`}</span>
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* <Col xs={24} sm={24} md={24} lg={12}>
                    <Form.Item
                      name="parentUser"
                      label="Parent User"
                      hasFeedback={true}
                      loading={loading}
                    >
                      <Select
                        showSearch
                        placeholder="Type Parent User Name"
                        filterOption={false}
                        onSearch={handleSearch}
                        notFoundContent={
                          fetching ? <Spin size="small" /> : null
                        }
                      // filterOption={(input, option) => {
                      //   setUserInput(input);
                      // }}
                      // loading={false}
                      >
                        <Option defaultValue value={0}>
                          - NA
                        </Option>
                        {Array.isArray(getParentUsers) &&
                          getParentUsers.length > 0 &&
                          getParentUsers?.map((item) => (
                            <Option value={item?.id} selected>
                              <span>{`${item?.firstName} ${item?.lastName}(${item?.userName})`}</span>
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
                      <Input
                        placeholder="Investor Name"
                        value={formfields.nameAsPerBank}
                        onChange={handleBankNameChange}
                      />
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
                        {
                          validator: (_, value) =>
                            !value || value.length < 8 || value.length > 17
                              ? Promise.reject(new Error("Account number must be between 8 to 17 digits"))
                              : Promise.resolve(),
                        },
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
                        {getAllPanCardTypeData.length > 0 ? (
                          getAllPanCardTypeData.map((item) => {
                            return (
                              item ? (
                              <Radio.Button
                                value={item?.id}
                                style={{ minWidth: "33%" }}
                              >
                                {item?.label}
                              </Radio.Button>
                              ) : null
                            );
                          })
                        ) : (
                          <Radio.Button value={0} style={{ minWidth: "100%" }}>
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

                  <Divider orientation="left">Nominee Details</Divider>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                      name="nomineeName"
                      label="Nominee Name"
                      labelCol={2}
                      disabled
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Nominee Name!",
                        },
                        { whitespace: true },
                        { min: 3 },
                      ]}
                      hasFeedback={true}
                    >
                      <Input placeholder="Nominee Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                      name="nomineeRelation"
                      label="Nominee Relation"
                      labelCol={2}
                      disabled
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Nominee Relation!",
                        },
                        { whitespace: true },
                        { min: 3 },
                      ]}
                      hasFeedback={true}
                    >
                      <Input placeholder="Nominee Relation" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                      name="nomineeAadharCardNumber"
                      label="Nominee Aadhar Card Number"
                      labelCol={2}
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Nominee Aadhar Card Number!",
                        },
                        aadharValidator,
                      ]}
                      validateTrigger={["onChange", "onBlur"]}
                      hasFeedback={true}
                    >
                      <Input
                        placeholder="Nominee Aadhar Card Number"
                        maxLength={12}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 12);
                          form.setFieldsValue({
                            nomineeAadharCardNumber: value,
                          });
                        }}
                      />
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
                    <Form.Item name="address2" labelCol={2} hasFeedback={true}>
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
                    <Form.Item name="aadharCardFile" label="Aadhar Card">
                      {!!allGetFileDocumnet?.aadharCardURL ? (
                        <EditFileShow
                          link={allGetFileDocumnet?.aadharCardURL}
                          setAllGetFileDocumnet={setAllGetFileDocumnet}
                          fileName={"Aadhar Card"}
                          fileObjectKey={"aadharCardURL"}
                        />
                      ) : fileList.aadharCardFile.length === 0 ? (
                        <Upload {...uploadProps("aadharCardFile")}>
                          <Button icon={<UploadOutlined />}>Select File</Button>
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
                    <Form.Item name="panCardFile" label="Pan Card">
                      {!!allGetFileDocumnet?.panCardURL ? (
                        <EditFileShow
                          link={allGetFileDocumnet?.panCardURL}
                          setAllGetFileDocumnet={setAllGetFileDocumnet}
                          fileName={"Pan Card"}
                          fileObjectKey={"panCardURL"}
                        />
                      ) : fileList.panCardFile.length === 0 ? (
                        <Upload {...uploadProps("panCardFile")}>
                          <Button icon={<UploadOutlined />}>Select File</Button>
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
                              {shortString(fileList.panCardFile?.[0]?.name, 38)}
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
                              {shortString(fileList.panCardFile?.[0]?.name, 35)}
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
                    >
                      {!!allGetFileDocumnet?.chequeORPassbookURL ? (
                        <EditFileShow
                          link={allGetFileDocumnet?.chequeORPassbookURL}
                          setAllGetFileDocumnet={setAllGetFileDocumnet}
                          fileName={"Cheque"}
                          fileObjectKey={"chequeORPassbookURL"}
                        />
                      ) : fileList.chequeOrPassbookFile.length === 0 ? (
                        <Upload {...uploadProps("chequeOrPassbookFile")}>
                          <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                      ) : (
                        <DivContainer>
                          {fileList.chequeOrPassbookFile[0].type ===
                          "application/pdf" ? (
                            <PdfFileContainer
                              onClick={() =>
                                handlePreview(fileList.chequeOrPassbookFile[0])
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
                                handlePreview(fileList.chequeOrPassbookFile[0])
                              }
                            >
                              <img
                                alt="Cheque OR Passbook File Preview"
                                src={URL.createObjectURL(
                                  fileList.chequeOrPassbookFile[0].originFileObj
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
                            onClick={() => handleRemove("chequeOrPassbookFile")}
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
                    >
                      {!!allGetFileDocumnet?.bankStatementURL ? (
                        <EditFileShow
                          link={allGetFileDocumnet?.bankStatementURL}
                          setAllGetFileDocumnet={setAllGetFileDocumnet}
                          fileName={"Bank Statement"}
                          fileObjectKey={"bankStatementURL"}
                        />
                      ) : fileList.bankStatementFile.length === 0 ? (
                        <Upload {...uploadProps("bankStatementFile")}>
                          <Button icon={<UploadOutlined />}>Select File</Button>
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
                                  fileList.bankStatementFile[0].originFileObj
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
                            onClick={() => handleRemove("bankStatementFile")}
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
                    <Form.Item name="signatureFile" label="Signature File">
                      {!!allGetFileDocumnet?.signatureURL ? (
                        <EditFileShow
                          link={allGetFileDocumnet?.signatureURL}
                          setAllGetFileDocumnet={setAllGetFileDocumnet}
                          fileName={"Signature URL"}
                          fileObjectKey={"signatureURL"}
                        />
                      ) : fileList.signatureFile.length === 0 ? (
                        <Upload {...uploadProps("signatureFile")}>
                          <Button icon={<UploadOutlined />}>Select File</Button>
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
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item name="description" label="Description">
                      <Input.TextArea showCount maxLength={500} />
                    </Form.Item>
                  </Col>
                  {/* description */}
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                      name="investorStatusId"
                      valuePropName="checked"
                      color={"red"}
                    >
                      <Checkbox>Active Invester</Checkbox>
                    </Form.Item>
                  </Col>
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

              {/* )} */}
            </Card>
          </Col>
        </Row>
      )}
      <Modal
        visible={previewVisible}
        // title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        style={{ marginTop: 15 }}
        width={window.innerWidth > 767 ? "75%" : "100%"}
        // height={"90%"}
      >
        {previewType === "image" ? (
          <img alt="Preview" style={{ width: "100%" }} src={previewContent} />
        ) : (
          <iframe
            title="PDF Preview"
            src={previewContent}
            style={{
              width: "97%",
              height: "500px",
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default EditInvestors;
