/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
} from "antd";
import Loader from "../../Component/Loader/Loader";
import { debounce } from "lodash";
import {
  getAllAccount,
  getAllTransactionMode,
} from "../../slices/generalSetting/generalSettingAPI";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { formItemLayout, tailFormItemLayout } from "../../Constants/Const";
import { useDebounce } from "../../helpers/useDebounce";
import {
  GetAllInvestor,
  getAllTransactionalBank,
} from "../../slices/Invester/investerAPI";
import {
  addExportPendingTransaction,
  addTransaction,
} from "../../slices/transaction/transactionAPI";
import { getAllPaymentSystemAction } from "../../slices/generalSetting/generalSettingthunk";
import { useDispatch } from "react-redux";
import axios from "axios";
const { Option } = Select;

const initialFields = {
  accountId: null,
  transactionModeId: null,
  userId: null,
  amount: null,
};

const AddExportPendingTransaction = () => {
  document.title = "Add Transaction" + process.env.REACT_APP_PAGE_TITLE;
  const [form] = Form.useForm();
  const customStyles = usecustomStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [allPaymentSystem, setAllPaymentSystem] = useState([]);
  const [getTransactionalBank, setGetTransactionalBank] = useState([]);
  const [messageApiType, contextHolder] = message.useMessage();
  // const dispatch = useDispatch();
  function formatDate(date, format) {
    const padZero = (num) => (num < 10 ? "0" + num : num);
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1); // Months are zero-indexed
    const year = date.getFullYear();

    if (format === "DDMMYYYY") {
      return `${day}${month}${year}`;
    } else if (format === "YYYYMMDD") {
      return `${year}${month}${day}`;
    }
    return "";
  }

  const onFinish = async (item) => {
    try {
      setFormLoading(true);
      const SubmitedItems = {
        paymentSystemId: item?.paymentSystemId,
        transactionalBankId: item?.transactionalBankId,
        note: item?.note,
      };
      const UpdatedFileName =
        item?.transactionalBankId === 1
          ? `HDFC_${formatDate(new Date(), "DDMMYYYY")}.xls`
          : `BLKPAY_${formatDate(new Date(), "YYYYMMDD")}.xlsx`;
      // TODO: Due To Same User ID Edit Role API NOt Working
      // await addExportPendingTransaction(SubmitedItems);
      axios
        .post("/addExportPendingTransaction", SubmitedItems, {
          responseType: "blob",
          "Content-Type": "application/octet-stream",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", UpdatedFileName); // or any other extension
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((error) => {
          console.error("Error downloading the file:", error);
        });
      navigate("/export-history");
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

      const paymentResponse = await dispatch(
        getAllPaymentSystemAction()
      ).unwrap();
      const getAllTransactionalBankResponse = await getAllTransactionalBank();

      setGetTransactionalBank(await getAllTransactionalBankResponse.data);
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
            title="Add Export Pending Transaction"
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
                      {/* <Option value={0}>--Na</Option> */}
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
                {/* getTransactionalBank */}
                <Col xs={24} sm={24} md={12} lg={12}>
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
                      {/* //TODO: for Stop API Call Remove Commented */}
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
                  Add Export Pending Transaction
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      )}
    </>
  );
};

export default AddExportPendingTransaction;
