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
  Empty,
  notification
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
import { GetAllInvestor } from "../../slices/Invester/investerAPI";
import { addTransaction } from "../../slices/transaction/transactionAPI";
const { Option } = Select;

const initialFields = {
  accountId: null,
  transactionModeId: null,
  investorId: null,
  amount: null,
};

const AddTransaction = () => {
  document.title = "Add Transaction" + process.env.REACT_APP_PAGE_TITLE;
  const [form] = Form.useForm();
  const customStyles = usecustomStyles();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  // const [formfields, setFormFields] = useState(initialFields);
  const [allAccount, setAllAccount] = useState([]);
  const [messageApiType, contextHolder] = message.useMessage();
  const [allTransaction, setAllTransaction] = useState([]);
  const [allInvestor, setAllInvestor] = useState("");
  const [isTransactionMode, setIsTransactionMode] = useState(0);
  // const dispatch = useDispatch();
  const [userInput, setUserInput] = useState("");
  const debouncedAgeRange = useDebounce(userInput, 750);

  // const [filteredOptions, setFilteredOptions] = useState([]);
  const [fetching, setFetching] = useState(false);

  console.log("debouncedAgeRange: ", debouncedAgeRange);
  const fetchData = async () => {
    try {
      setLoading(true);
      setAllInvestor([]);
      const response = await GetAllInvestor({
        page: 1,
        limit: 50,
        search: debouncedAgeRange,
        investorStatusId: 1,
      });
      setAllInvestor(await response?.data?.results);
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
    // if (userInput?.length > 0) {
    fetchData();
    // }
  }, [debouncedAgeRange]);
  const onFinish = async (item) => {
    try {
      setFormLoading(true);

      const SubmitedItems = {
        tag: item?.tag,
        investorId: item?.investorId,
        amount: item?.amount,
        date: dayjs(item?.dateTime).format("YYYY-MM-DD"),
        note: item?.note,
      };

      await addTransaction(SubmitedItems);
      navigate("/transaction");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || // your backend error
        error?.message ||                // axios error
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

  const getAllSelectionsData = async () => {
    try {
      setDataLoading(true);
      //TODO: Remove Comment when API Workings
      const accountResponse = await getAllAccount({});
      const allTransactionResponse = await getAllTransactionMode({});
      setAllAccount(await accountResponse?.data);
      setAllTransaction(await allTransactionResponse?.data);
    } catch (error) {
      console.log("error: ", error);
    }
    setDataLoading(false);
  };
  useEffect(() => {
    getAllSelectionsData();
  }, []);
  
  const handleSearch = debounce(async (input) => {
  setUserInput(input);

  // Always set fetching true immediately
  setFetching(true);

  if (input?.trim()) {
    try {
      const response = await GetAllInvestor({
        page: 1,
        limit: 50,
        search: input.trim(),
        investorStatusId: 1,
      });

      if (response?.status === "success" && Array.isArray(response.data)) {
        setAllInvestor(response.data);
      } else {
        setAllInvestor([]);
      }
    } catch (error) {
      console.error("Error fetching investors:", error);
      setAllInvestor([]);
    }
  } else {
    // When input is cleared
    setAllInvestor([]);
  }

  // Stop loading spinner
  setFetching(false);
}, 800); // 800ms debounce is better UX

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
            title="Add Transaction"
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
                {/* investorId */}
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="investorId"
                    label="Investor"
                    rules={[
                      {
                        required: true,
                        message: "Please Select investorId!",
                      },
                    ]}
                    hasFeedback={true}
                    loading={loading}
                  >
                    <Select
                      showSearch
                      loading={fetching}
                      onSearch={handleSearch}
                      placeholder="Type Investor Name"
                      // notFoundContent={fetching ? <Spin size="small" /> : <Empty description="No data found" />}
                      filterOption={false} // disable default filter for remote search
                    >
                      {Array.isArray(allInvestor) &&
                        allInvestor.map((item) => (
                          <Option key={item.investorId} value={item.investorId}>
                            {`${item.name} (${item.userName})`}
                          </Option>
                        ))}
                    </Select>

                  </Form.Item>
                </Col>
                {/* transactionModeId */}
                {/* <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="transactionModeId"
                    label="Transaction Mode"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Transaction Mode!",
                      },
                    ]}
                    hasFeedback={true}
                  >
                    <Select
                      placeholder="Select Transaction Mode"
                      onChange={(data) => {
                        setIsTransactionMode(data);
                        console.log("data: ", data);
                      }}
                    >
                      {Array.isArray(allTransaction) && allTransaction.length > 0 ? (
                        allTransaction
                          .filter((item) => item && item.id && item.name) // filter out nulls or invalid entries
                          .map((item) => (
                            <Option key={item.id} value={item.id}>
                              {item.name}
                            </Option>
                          ))
                      ) : (
                        <Option value={0}>- NA</Option>
                      )}
                    </Select>
                  </Form.Item>
                  {!!isTransactionMode && (
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Form.Item
                          name="transactionStatusId"
                          valuePropName="checked"
                          color={"red"}
                        >
                          <Checkbox>
                            {isTransactionMode === 2 ? "Paid" : "Received"}
                          </Checkbox>
                        </Form.Item>
                      </Col>
                      {isTransactionMode === 2 && (
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <Form.Item
                            name="withTDS"
                            valuePropName="checked"
                            color={"red"}
                            defaultChecked
                            initialValue={true}
                          >
                            <Checkbox defaultChecked>PayOut With TDS</Checkbox>
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                  )}
                </Col> */}
                
                {/* accountId */}
                {/* <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="accountId"
                    label="Account"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Account!",
                      },
                    ]}
                    hasFeedback={true}
                  >
                    <Select placeholder="Select Account">
                      {Array.isArray(allAccount) && allAccount.length > 0 ? (
                        allAccount?.map((item) => (
                          <Option value={item?.accountId}>
                            <div
                              style={{
                                color: `${item?.amountColour}`,
                                fontWeight: "bold",
                              }}
                            >
                              {item?.name}
                            </div>
                          </Option>
                        ))
                      ) : (
                        <Option value={0}>- NA</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col> */}

                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="tag"
                    label="Tag"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Tag!",
                      },
                    ]}
                    hasFeedback={true}
                  >
                    <Select placeholder="Select Tag">
                      <Option value='Old'>Old</Option>
                      <Option value='New'>New</Option>
                    </Select>
                  </Form.Item>
                </Col>
                {/* amount */}
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[
                      {
                        required: true,
                        message: "Please input valid transaction amount!",
                      },
                      {
                        validator: (_, value) => {
                          if (value === undefined || value === null || value === "") {
                            return Promise.resolve(); // let 'required' handle this
                          }
                          if (Number(value) < 0) {
                            return Promise.reject("Amount must be a positive number!");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    hasFeedback
                  >
                    <InputNumber
                      placeholder="Transaction Amount"
                      // addonAfter={suffixSelector}
                      min={0}
                      style={{
                        width: "100%",
                      }}
                    />
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
                  Add Transaction
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      )}
    </>
  );
};

export default AddTransaction;
