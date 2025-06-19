import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  message,
  Row,
  Select,
  Form,
  Divider,
  Upload,
  Checkbox,
} from "antd";
import usecustomStyles from "../../Common/Hooks/customStyles";
import Loader from "../../Component/Loader/Loader";
import dharmaInfoSystemLogo from "../../assets/images/ainfinitylogo.png";
import { useNavigate } from "react-router-dom";
import { formItemLayout, tailFormItemLayout } from "../../Constants/Const";
import dayjs from "dayjs";
import { AddInvestor } from "../../slices/Invester/investerAPI";
import { UploadOutlined } from "@ant-design/icons";

const AddInveterWithoutLogin = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [messageApiType, contextHolder] = message.useMessage();
  const { Option } = Select;
  const initialFields = {
    userName: null,
    email: null,
    phoneNumber: null,
    firstName: null,
    middleName: null,
    lastName: null,
    investorTypeId: null,
    paymentSystemId: null,
    asOfDate: null,
    amount: null,
    aadharCardNumber: null,
    panCardNumber: null,
  };
  useEffect(() => {
    fetchData();
  }, []);
  const onFinish = async (item) => {
    try {
      setFormLoading(true);
      const SubmitedItems = {
        userName: item.userName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        firstName: item.firstName,
        middleName: item.middleName,
        lastName: item.lastName,
        investorTypeId: +item.investorTypeId,
        paymentSystemId: +item.paymentSystemId,
        asOfDate: dayjs(item?.asOfDate).format("YYYY-MM-DD HH:mm:ss"),
        openingBalance: item.openingBalance,
        aadharCardNumber: item.aadharCardNumber,
        panCardNumber: item.panCardNumber,
        referenceId: 1, //TODO: REference Id Logic Will Update , Have to Question With BE Team.
        toPayORToReceive: item?.toPayORToReceive,
      };
      // TODO: Due To Same User ID Edit Role API NOt Working
      await AddInvestor(SubmitedItems);
      navigate("/investors");
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
        duration: 5,
      });
    }
    setFormLoading(false);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      //FIXME: this comment Remove When API Working
      // await dispatch(getAllInvestorTypeAction()).unwrap();
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const customStyles = usecustomStyles();
  return (
    <>
      <div>{contextHolder}</div>
      {loading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
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
                title={"Add Investor"}
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
                    {/* joiningDate */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        name="joiningDate"
                        label="Joining Date"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Joining Date!",
                          },
                        ]}
                        size="small"
                      >
                        <DatePicker
                          name="joiningDate"
                          placement="topLeft"
                          style={{
                            boxShadow: "none",
                            outline: "none",
                            width: "100%",
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* userName */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name="userName"
                        label="Investors Name (Name as per PAN Card)"
                        labelCol={2}
                        disabled
                        rules={[
                          {
                            required: true,
                            message: "Please Enter Investors Name!",
                          },
                          { whitespace: true },
                          { min: 3 },
                        ]}
                        hasFeedback={true}
                      >
                        <Input placeholder="Investors Name" />
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
                    {/* Address */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name="Address"
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
                        <Input placeholder="Investor Address" />
                      </Form.Item>
                    </Col>
                    {/* city */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        name="city"
                        label="City"
                        labelCol={2}
                        rules={[
                          {
                            required: true,
                            message: "Please Enter City!",
                          },
                          { whitespace: true },
                        ]}
                        hasFeedback={true}
                      >
                        <Input placeholder="Investor City" />
                      </Form.Item>
                    </Col>
                    {/* State/Region/Province */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        name="State"
                        label="State/Region/Province"
                        rules={[
                          {
                            required: true,
                            message: "Please Select State!",
                          },
                        ]}
                        hasFeedback={true}
                      >
                        <Select placeholder="Select State">
                          <Option value={1}>Andhra Pradesh</Option>
                          <Option value={2}>Arunachal Pradesh</Option>
                          <Option value={3}>Assam</Option>
                          <Option value={4}>Bihar</Option>
                          <Option value={5}>Chhattisgarh</Option>
                          <Option value={6}>Goa</Option>
                          <Option value={7}>Gujarat</Option>
                          <Option value={8}>Haryana</Option>
                          <Option value={9}>Himachal Pradesh</Option>
                          <Option value={10}>Jharkhand</Option>
                          <Option value={11}>Karnataka</Option>
                          <Option value={12}>Kerala</Option>
                          <Option value={13}>Madhya Pradesh</Option>
                          <Option value={14}>Maharashtra</Option>
                          <Option value={15}>Manipur</Option>
                          <Option value={16}>Meghalaya</Option>
                          <Option value={17}>Mizoram</Option>
                          <Option value={18}>Nagaland</Option>
                          <Option value={19}>Odisha</Option>
                          <Option value={20}>Punjab</Option>
                          <Option value={21}>Rajasthan</Option>
                          <Option value={22}>Sikkim</Option>
                          <Option value={23}>Tamil Nadu</Option>
                          <Option value={24}>Telangana</Option>
                          <Option value={25}>Tripura</Option>
                          <Option value={26}>Uttar Pradesh</Option>
                          <Option value={27}>Uttarakhand</Option>
                          <Option value={28}>West Bengal</Option>
                          <Option value={29}>
                            Andaman and Nicobar Islands
                          </Option>
                          <Option value={30}>Chandigarh</Option>
                          <Option value={31}>
                            Dadra and Nagar Haveli and Daman and Diu
                          </Option>
                          <Option value={32}>Lakshadweep</Option>
                          <Option value={33}>Delhi</Option>
                          <Option value={34}>Puducherry</Option>
                          <Option value={35}>Ladakh</Option>
                          <Option value={36}>Jammu and Kashmir</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {/* Postal / Zip Code */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        name="postalCode"
                        label="Postal / Zip Code"
                        labelCol={2}
                        rules={[
                          {
                            // type: "number",
                            required: true,
                            message: "Please Enter Postal / Zip Code!",
                          },
                          { whitespace: true },
                          { min: 6 },
                          { max: 6 },
                        ]}
                        hasFeedback={true}
                      >
                        <Input
                          type="number"
                          style={{ minWidth: "100%" }}
                          placeholder="Investor Postal / Zip Code"
                        />
                      </Form.Item>
                    </Col>
                    {/* Country */}
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
                        <Select placeholder="Select Country">
                          <Option value={1}>India</Option>
                          <Option value={2}>- NA</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Divider>Payment Details</Divider>
                    {/* Investment Amount  */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        name="investmentAmount"
                        label="Investment Amount"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Investment Amount!",
                          },
                        ]}
                        hasFeedback={true}
                      >
                        <Select placeholder="Select Investment Amount">
                          <Option value={1}>5,00,000 INR</Option>
                          <Option value={2}>10,00,000 INR</Option>
                          <Option value={3}>15,00,000 INR</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {/* Payout Cycle  */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Form.Item
                        name="payoutCycle"
                        label="Payout Cycle"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Investment Amount!",
                          },
                        ]}
                        hasFeedback={true}
                      >
                        <Select placeholder="Select Investment Amount">
                          <Option value={1}>Monthly</Option>
                          <Option value={2}>Weekly</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Divider>Documents Upload</Divider>
                    {/* Upload Aadhar Card */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name="uploadAadharCard"
                        label="Upload Aadhar Card"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                          {
                            required: true,
                            message: "Please Upload Aadhar Card!",
                          },
                        ]}
                      >
                        <Upload
                          name="logo"
                          action="/upload.do"
                          listType="picture"
                        >
                          <Button
                            style={{ minWidth: "100%" }}
                            icon={<UploadOutlined />}
                          >
                            Upload Aadhar Card
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    {/* Upload PAN */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name="uploadPanCard"
                        label="Upload PAN"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                          {
                            required: true,
                            message: "Please Upload PAN!",
                          },
                        ]}
                      >
                        <Upload
                          name="logo"
                          action="/upload.do"
                          listType="picture"
                        >
                          <Button
                            style={{ minWidth: "100%" }}
                            icon={<UploadOutlined />}
                          >
                            Upload PAN
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    {/* Upload Cancelled CHEQUE / Bank Passbook */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name="uploadBankDetails"
                        label="Upload Cancelled CHEQUE / Bank Passbook"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                          {
                            required: true,
                            message: "Please Upload PAN!",
                          },
                        ]}
                      >
                        <Upload
                          name="logo"
                          action="/upload.do"
                          listType="picture"
                        >
                          <Button
                            style={{ minWidth: "100%" }}
                            icon={<UploadOutlined />}
                          >
                            Upload Cancelled CHEQUE / Bank Passbook
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    {/* Upload Signature */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item
                        name="signature"
                        label="Upload Signature"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                          {
                            required: true,
                            message: "Please Upload Signature!",
                          },
                        ]}
                      >
                        <Upload
                          name="logo"
                          action="/upload.do"
                          listType="picture"
                        >
                          <Button
                            style={{ minWidth: "100%" }}
                            icon={<UploadOutlined />}
                          >
                            Upload Signature
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>

                    <Divider>Terms and Conditions</Divider>
                    <ol>
                      <li>
                        All the Profit/Loss will be split with transaction
                        charges at 60% of Investor and 40% of Dharma Infosystem.
                      </li>
                      <li>All the tradings are subjected to market risk.</li>
                      <li>
                        AINIFINTY membership valid for 3 months only (from the
                        date of joined).
                      </li>
                      <li>
                        Algo trading system will not be active all the days.
                      </li>
                      <li>
                        To renew your membership plans are follows at
                        ainfinity.io/plans
                      </li>
                    </ol>
                    {/* Checkbox */}
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item label="conditions" valuePropName="checked">
                        <Checkbox>
                          <ol>
                            <li>
                              Dharma InfoSystem is not SEBI Registered
                              investment advisory Firm it is software based high
                              accuracy trading system.
                            </li>
                            <li>
                              All settlements are been take place every Friday
                              of every month. (Minimum gain should be more then
                              5000 INR)
                            </li>
                            <li>
                              All the tradings are subjected to market risk.
                            </li>
                            <li>
                              Dharma InfoSystem have rights to change terms and
                              policies at any time.
                            </li>
                          </ol>
                        </Checkbox>
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
                          {" "}
                          Add Investor
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default AddInveterWithoutLogin;
