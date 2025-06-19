import React, { useEffect, useState } from "react";
import usecustomStyles from "../../Common/Hooks/customStyles";
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
  Row,
  Select,
} from "antd";
import Loader from "../../Component/Loader/Loader";
import {
  getAllAccount,
  getAllInvestorType,
  getAllPaymentSystem,
  getAllTransactionMode,
} from "../../slices/generalSetting/generalSettingAPI";
import { addPayout } from "../../slices/transaction/transactionAPI";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { formItemLayout, tailFormItemLayout } from "../../Constants/Const";
const { Option } = Select;

const initialFields = {
  accountId: null,
  transactionModeId: null,
  userId: null,
  amount: null,
};

const AddPayout = () => {
  document.title = "Add Transaction" + process.env.REACT_APP_PAGE_TITLE;
  const [form] = Form.useForm();
  const customStyles = usecustomStyles();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [allAccount, setAllAccount] = useState([]);
  const [getAllInvestor, setGetAllInvestor] = useState([]);
  const [allPaymentSystem, setAllPaymentSystem] = useState([]);
  const [messageApiType, contextHolder] = message.useMessage();
  const [allTransaction, setAllTransaction] = useState([]);
  const [isTransactionMode, setIsTransactionMode] = useState(0);
  const onFinish = async (item) => {
    try {
      setFormLoading(true);
      const SubmitedItems = {
        paymentSystemId: item?.paymentSystemId,
        asOnDate: dayjs(item?.dateTime).format("YYYY-MM-DD HH:mm:ss"),
        note: item?.note,
      };
      console.log("SubmitedItems: ", SubmitedItems);
      // TODO: Due To Same User ID Edit Role API NOt Working
      await addPayout(SubmitedItems);
      navigate("/all-bulk-transaction");
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
        duration: 5,
      });
    }
    setFormLoading(false);
  };
  const getAllSelectionsData = async () => {
    try {
      setDataLoading(true);
      //TODO: Remove Comment when API Workings
      const accountResponse = await getAllAccount({});
      const allTransactionResponse = await getAllTransactionMode({});
      const investorResponse = await getAllInvestorType({});
      const paymentResponse = await getAllPaymentSystem({});
      setAllAccount(await accountResponse?.data);
      setAllTransaction(await allTransactionResponse?.data);
      setGetAllInvestor(await investorResponse.data);
      setAllPaymentSystem(await paymentResponse.data);
    } catch (error) {
      console.log("error: ", error);
    }
    setDataLoading(false);
  };
  useEffect(() => {
    getAllSelectionsData();
  }, []);

  return (
    <>
      <div>{contextHolder}</div>
      {dataLoading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
        <Col
          xs={24}
          className="gutter-row"
          style={{ marginBottom: customStyles.margin }}
        >
          <Card
            title="Add Payouts"
            style={{ margin: `${customStyles.margin}px 0px` }}
          >
            {" "}
            <Form
              {...formItemLayout}
              form={form}
              layout="vertical"
              name="register"
              onFinish={onFinish}
              initialValues={initialFields}
              scrollToFirstError
            >
              <Row gutter={[24, 4]}>
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
                      {/* //TODO: for Stop API Call Remove Commented */}
                      {Array.isArray(allPaymentSystem) &&
                      allPaymentSystem.length > 0 ? (
                        allPaymentSystem.map((item) => (
                          <Option
                            key={item?.paymentSystemId}
                            value={item?.paymentSystemId}
                          >
                            {item?.name || "- NA"}
                          </Option>
                        ))
                      ) : (
                        <Option value={0}>- NA</Option>
                      )}

                      {/* //TODO: Constant Data */}
                      {/* <Option value={0}>- NA</Option>
                        <Option value={7}>Weekly</Option>
                        <Option value={31}>Weekly</Option> */}
                    </Select>
                  </Form.Item>
                </Col>

                {/* dateTime */}
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="dateTime"
                    label="Date"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Date!",
                      },
                    ]}
                    size="small"
                    hasFeedback
                  >
                    <DatePicker
                      name="dateTime"
                      placeholder="DD MMM YYYY"
                      placement="bottomLeft"
                      style={{
                        boxShadow: "none",
                        outline: "none",
                        width: "100%",
                      }}
                      format="DD MMM YYYY"
                    />
                  </Form.Item>
                </Col>
                {/* note */}
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item name="note" label="Note">
                    <Input.TextArea showCount maxLength={500} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item {...tailFormItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={formLoading}
                >
                  Add Payout
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      )}
    </>
  );
};

export default AddPayout;
