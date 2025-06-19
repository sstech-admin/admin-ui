/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
  notification
} from "antd";
import dayjs from "dayjs";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { useDispatch } from "react-redux";
import {
  AddInvestor,
  GetAllInvestor,
  getAllPanCardType,
  getAllTransactionalBank,
  GetInvestor,
  getReferences,
  GetAllUsers,
  updateInvestor,
  checkPanCard
} from "../../slices/Invester/investerAPI";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllInvestorTypeAction,
  getAllPaymentSystemAction,
} from "../../slices/generalSetting/generalSettingthunk";
import {
  formItemLayout,
  IFSCRegExp,
  onlyNumberRegExp,
  PanCardRegExp,
  tailFormItemLayout,
} from "../../Constants/Const";
import { debounce } from "lodash";
import Loader from "../../Component/Loader/Loader";
import { UploadOutlined } from "@ant-design/icons";
import { FileIcon, Trash2Icon, Minus, Plus } from "lucide-react";
import {
  DivContainer,
  ImageContainer,
  PdfFileContainer,
  PDFIconConatiner,
} from "./AddInvestors.styles";
import { shortString } from "../../Common/CommonFunction";
import { getAllAccount } from "../../slices/generalSetting/generalSettingAPI";

const AddInvestors = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;

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
  const dispatch = useDispatch();
  const { Option } = Select;
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const [formfields, setFormFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [allInvestor, setAllInvestor] = useState("");
  const [messageApiType, contextHolder] = message.useMessage();
  const [getAllInvestorType, setGetAllInvestorType] = useState([]);
  const [getReference, setGetReferences] = useState([]);
  const [getParentUsers, setGetParentUsers] = useState([]);
  const [allPaymentSystem, setAllPaymentSystem] = useState([]);
  const [getTransactionalBank, setGetTransactionalBank] = useState([]);
  const [getAllPanCardTypeData, setGetAllPanCardTypeData] = useState([]);
  const [allBankAccount, setAllBankAccount] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [defaultAmountValue, setDefaultAmountValue] = useState();
  const [panCardError, setPanCardError] = useState(null);
  const [panCardStatus, setPanCardStatus] = useState(null);
  const [amount, setAmount] = useState(500000); // Start from 500,000
  const step = 500000;
  const minAmount = 500000;

  const initialFields = {
    userName: null,
    email: null,
    phoneNumber: null,
    firstName: null,
    middleName: null,
    lastName: null,
    referenceId: null,
    amount: 500000,
    paymentSystemId: null,
    parentUser: null,
    transactionalBankId: null,
    investorStatusId: null,
    description: null,
    asOfDate: null,
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

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const investorResponse = await dispatch(
        getAllInvestorTypeAction()
      ).unwrap();
      const getReferencesResponse = await getReferences();
      const getUsersResponse = await GetAllUsers();
      const paymentResponse = await dispatch(
        getAllPaymentSystemAction()
      ).unwrap();
      const getAllTransactionalBankResponse = await getAllTransactionalBank();
      const getAllPanCardTypeResponse = await getAllPanCardType();
      const getAllAccountResponse = await getAllAccount({
        page: 1,
        limit: 50,
      });
      setGetTransactionalBank(await getAllTransactionalBankResponse.data);
      setGetAllInvestorType(await investorResponse.data);
      setAllPaymentSystem(await paymentResponse.data);
      setGetAllPanCardTypeData(await getAllPanCardTypeResponse.data);
      setGetReferences(await getReferencesResponse.results)
      setGetParentUsers(await getUsersResponse.data.users)
      setAllBankAccount(await getAllAccountResponse.data);

      if (!!params.slug) {
        const response = await GetInvestor({
          userId: params.slug,
        });
        if (await response?.status) {
          setFormFields(await response.data);
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

  const dataCall = async () => {
    await fetchData();

    form.setFieldValue(
      "asOfDate",
      dayjs(dayjs().format("DD MMM YYYY"), "DD MMM YYYY")
    );
  };

  useEffect(() => {
    dataCall();
  }, []);

  useEffect(() => {
    // if (!!defaultAmountValue) {
    const bankdata = allBankAccount.find(
      (item) => item.defaultPaymentReceive === 1
    )?.accountId;
    form.setFieldValue("amount", defaultAmountValue);
    form.setFieldValue("paymentReceivedAccountId", bankdata);
    // }
  }, [defaultAmountValue]);

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
    try {
      setFormLoading(true);
      const formData = new FormData();

      // Append form fields directly to FormData
      formData.append("userName", item.userName);
      formData.append("email", item.email);
      let phoneNumber = `+91${item.phoneNumber}` 
      formData.append("phoneNumber", phoneNumber);
      // formData.append("nameAsPerPanCard", item.nameAsPerPanCard);
      formData.append("referenceId", item.referenceId || "");
      formData.append("paymentSystemId", +item.paymentSystemId);
      // formData.append("parentUser", item.parentUser ? item.parentUser : '');
      formData.append("investorStatusId", item.investorStatusId ? 1 : 0);
      // formData.append("description", item.description || "");
      // formData.append(
      //   "asOfDate",
      //   `${dayjs(item?.asOfDate).format("YYYY-MM-DD")} 00:00:00`
      // );
      formData.append("amount", item.amount ? Math.abs(item.amount) : amount);
      // formData.append("toPayORToReceive", "toReceive");
      formData.append("address1", item.address1);
      formData.append("address2", item.address2 || "");
      formData.append("district", item.district);
      formData.append("state", item.state);
      formData.append("country", item.country);
      formData.append("pinCode", item.pinCode);
      formData.append("nameAsPerBank", String(item.nameAsPerPanCard || ""));
      formData.append("bankName", item.bankName);
      formData.append("bankAccountNumber", item.bankAccountNumber);
      formData.append("ifscCode", item.ifscCode);
      formData.append("aadharCardNumber", item.aadharCardNumber);
      formData.append("panCardTypeId", item.panCardTypeId);
      formData.append("nameAsPerPanCard", item.nameAsPerPanCard);
      formData.append("firstName", item.firstName);
      formData.append("lastName", item.lastName);
      formData.append("panCardNumber", item.panCardNumber);
      formData.append("nomineeRelation", item.nomineeRelation);
      formData.append("nomineeAadharCardNumber", item.nomineeAadharCardNumber);
      formData.append("nomineeName", item.nomineeName);
      // formData.append("paymentReceivedAccountId", item.paymentReceivedAccountId);

      // Append files to FormData
      const aadharCardFile = fileList.aadharCardFile?.[0]?.originFileObj;
      if (aadharCardFile) formData.append("aadharcard", aadharCardFile);

      const panCardFile = fileList.panCardFile?.[0]?.originFileObj;
      if (panCardFile) formData.append("pancard", panCardFile);

      const chequeOrPassbookFile =
        fileList.chequeOrPassbookFile?.[0]?.originFileObj;
      if (chequeOrPassbookFile)
        formData.append("checkbookPassbook", chequeOrPassbookFile);

      const bankStatementFile = fileList.bankStatementFile?.[0]?.originFileObj;
      if (bankStatementFile)
        formData.append("bankStatement", bankStatementFile);

      const signatureFile = fileList.signatureFile?.[0]?.originFileObj;
      if (signatureFile) formData.append("signature", signatureFile);

      // Send FormData
      if (!!params.slug) {
        await updateInvestor(formData); // Assuming this accepts FormData
      } else {
        const response = await AddInvestor(formData); // Assuming this accepts FormData
        console.log("response: ", response);
      }

      navigate("/investors");
    } catch (error) {
      console.log('error', error)
      const errorMessage =
    error?.response?.data?.message || // custom backend message
    error?.message ||                 // fallback Axios error
    "Something went wrong. Please try again.";

      notification.error({
          message: "Error",
          description: errorMessage,
          placement: "bottomRight",
      });
    } finally {
      setFormLoading(false);
    }
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
  useEffect(() => {
    if (getTransactionalBank?.length) {
      form.setFieldsValue({
        transactionalBankId: getTransactionalBank[0].id,
      });
    }
  }, [getTransactionalBank]);
  useEffect(() => {
    if (Array.isArray(getReference) && getReference.length >= 3) {
      const thirdItem = getReference[2];
      if (thirdItem?.referenceId) {
        form.setFieldsValue({
          referenceId: thirdItem.referenceId,
        });
      }
    }
  }, [getReference]);
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

  const handleCheckPanCard = debounce(async (input) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!input || !panRegex.test(input.toUpperCase())) {
      setPanCardError("Please enter a valid PAN card number.");
      setPanCardStatus("invalid");
      return;
    }

    try {
      const response = await checkPanCard({ panCardNumber: input.toUpperCase() });

      if (response?.data?.exists) {
        setPanCardError("This PAN card is already registered.");
        setPanCardStatus("invalid");
      } else {
        setPanCardError(null);
        setPanCardStatus("valid");
      }
    } catch (error) {
      setPanCardError(
        error?.response?.data?.message ||
          "Failed to verify PAN card. Please try again."
      );
      setPanCardStatus("invalid");
    }
  }, 500);

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
                initialValues={
                  !!params.slug
                    ? {
                      ...formfields,
                      asOfDate: dayjs(
                        dayjs(formfields?.asOfDate).format("YYYY-MM-DD"),
                        "YYYY-MM-DD"
                      ),
                    }
                    : initialFields
                }
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
                      disabled
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Investor ID!",
                        },
                        { whitespace: true },
                        { min: 6 },
                      ]}
                      hasFeedback={true}
                    >
                      <Input
                        disabled={!!params.slug}
                        placeholder="Investor ID"
                      />
                    </Form.Item>
                  </Col> */}
                  {/* nameAsPerPanCard*/}
                  <Col xs={24} sm={24} md={24} lg={12}>
                    {console.log(
                      "formfields?.nameAsPerPanCard: ",
                      formfields?.nameAsPerPanCard
                    )}
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
                      // disabled
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
                          required: true,
                          message: "Please enter phone number!",
                        },
                        { whitespace: true },
                        {
                          validator: (_, value) =>
                            value && value.replace(/\s+/g, "").length === 10
                              ? Promise.resolve()
                              : Promise.reject(new Error("Phone number must be 10 digits")),
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        addonBefore="+91"
                        style={{ minWidth: "100%" }}
                        placeholder="Investor Phone Number"
                      />
                    </Form.Item>
                  </Col>

                  <Divider orientation="left">Investment Details</Divider>
                  {/* investorTypeId */}
                  <Col xs={24} sm={24} md={12} lg={12}>
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
                      <Select
                        placeholder="Select Investor Type"
                        onChange={(e) => {
                          if (e === 0) {
                            setDefaultAmountValue(0);
                          } else {
                            const data = getAllInvestorType?.find(
                              (index) => index.investorTypeId === e
                            )?.amount;
                            setDefaultAmountValue(data);
                          }
                        }}
                      >
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

                  <Divider orientation="left">Payment</Divider>
                  {/* amount */}
                  {/* <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      name="amount"
                      label="Amount Received"
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
                  {/* paymentReceivedAccountId  */}
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      name="paymentReceivedAccountId"
                      label="Payment Received Account"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Payment System!",
                        },
                      ]}
                      hasFeedback
                      initialValue={
                        Array.isArray(allBankAccount) && allBankAccount.length > 0
                          ? allBankAccount[0]?.accountId
                          : undefined
                      }
                    >
                      <Select placeholder="Select Payment System">
                        {Array.isArray(allBankAccount) &&
                          allBankAccount.length > 0 &&
                          allBankAccount.map((item) => (
                            <Option key={item?.accountId} value={item?.accountId}>
                              {item?.name || "- NA"}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>


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
                          defaultValue={dayjs().format("DD MMM YYYY")}
                          format="DD MMM YYYY"
                          value={formfields?.asOfDate}
                        />
                      </Form.Item>
                    </Col>
                  )} */}
                  {!params.slug && (
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        name="asOfDate"
                        label="Date"
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
                          format="DD MMM YYYY"
                          defaultValue={dayjs().format("DD MMM YYYY")}
                          value={formfields?.asOfDate}
                        />
                      </Form.Item>
                    </Col>
                  )}

                  <Divider orientation="left">Bank Details</Divider>
                  {/* nameAsPerBank */}
                  {/* <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                      name="nameAsPerBank"
                      label="Name As Per Bank"
                      labelCol={2}
                      disabled
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Name!",
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
                          required: true,
                          message: "Please Enter Bank Account Number!",
                        },
                        {
                          whitespace: true,
                        },
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
                          pattern: IFSCRegExp
                        },
                        { whitespace: true },
                        { min: 3 },
                      ]}
                      hasFeedback={true}
                    >
                      <Input placeholder="IFSC" />
                    </Form.Item>
                  </Col>

                  <Divider orientation="left">Nominee Details</Divider>
                  <Col xs={24} sm={24} md={24} lg={12}>
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
                  <Col xs={24} sm={24} md={24} lg={12}>
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
                      <Select placeholder="Select Nominee Relation">
                        <Option value="Father">Father</Option>
                        <Option value="Mother">Mother</Option>
                        <Option value="Brother">Brother</Option>
                        <Option value="Sister">Sister</Option>
                        <Option value="Wife">Wife</Option>
                        <Option value="Son">Son</Option>
                        <Option value="Daughter">Daughter</Option>
                        <Option value="Other">Other</Option>
                      </Select>
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
                          getAllPanCardTypeData?.map((item) => {
                            return (
                              item ? (
                                <Radio.Button
                                  value={item?.id}
                                  style={{ minWidth: "33%" }}
                                >
                                  {item?.label}
                                </Radio.Button>) : null
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
                    label="PAN Card Number"
                    validateStatus={
                      panCardError ? "error" : panCardStatus === "valid" ? "success" : ""
                    }
                    help={
                      panCardError
                        ? panCardError
                        : panCardStatus === "valid"
                        ? "PAN card is valid for use."
                        : null
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please enter your PAN card number!",
                      },
                      {
                        pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        message: "Enter a valid PAN number format (e.g., ABCDE1234F)",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter PAN Card Number"
                      value={formfields?.panCardNumber}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setFormFields((prev) => ({
                          ...prev,
                          panCardNumber: value,
                        }));
                      }}
                      onKeyUp={() => handleCheckPanCard(formfields?.panCardNumber)}
                    />
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
                      <Input placeholder="Address Line 1" />
                    </Form.Item>
                    <Form.Item name="address2" labelCol={2} hasFeedback={true}>
                      <Input placeholder="Address  Line 2" />
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
                      <Input placeholder="District" />
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
                      <Input placeholder="State" />
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
                    //   { required: true, message: "Aadhar Card is required" },
                    // ]}
                    >
                      {fileList.aadharCardFile.length === 0 ? (
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
                    <Form.Item
                      name="panCardFile"
                      label="Pan Card"
                    // rules={[
                    //   { required: true, message: "Pan Card is required" },
                    // ]}
                    >
                      {fileList.panCardFile.length === 0 ? (
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
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Cheque OR Passbook File is required",
                    //   },
                    // ]}
                    >
                      {fileList.chequeOrPassbookFile.length === 0 ? (
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
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Bank Statement File is required",
                    //   },
                    // ]}
                    >
                      {fileList.bankStatementFile.length === 0 ? (
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
      )}
    </>
  );
};

export default AddInvestors;
