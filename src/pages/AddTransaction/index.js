import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  Typography,
  notification
} from "antd";
import { Calendar, DollarSign, Tag as TagIcon } from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import Loader from "../../Component/Loader/Loader";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { formItemLayout, tailFormItemLayout } from "../../Constants/Const";
import { useDebounce } from "../../helpers/useDebounce";
import { GetAllInvestor } from "../../slices/Invester/investerAPI";
import { addTransaction } from "../../slices/transaction/transactionAPI";

const { Option } = Select;
const { Title, Text } = Typography;

const initialFields = {
  investorId: null,
  amount: null,
  tag: null,
};

const AddTransaction = () => {
  document.title = "Add Transaction" + process.env.REACT_APP_PAGE_TITLE;
  const [form] = Form.useForm();
  const customStyles = usecustomStyles();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [messageApiType, contextHolder] = message.useMessage();
  const [allInvestor, setAllInvestor] = useState([]);
  const [userInput, setUserInput] = useState("");
  const debouncedSearchTerm = useDebounce(userInput, 750);
  const [fetching, setFetching] = useState(false);

  const onFinish = async (values) => {
    try {
      setFormLoading(true);

      const formattedValues = {
        tag: values.tag,
        investorId: values.investorId,
        amount: values.amount,
        date: dayjs(values.dateTime).format("YYYY-MM-DD"),
        note: values.note,
      };

      await addTransaction(formattedValues);
      notification.success({
        message: "Success",
        description: "Transaction added successfully",
        placement: "bottomRight",
      });
      navigate("/transaction");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 
        error?.message ||
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

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      setAllInvestor([]);
      const response = await GetAllInvestor({
        page: 1,
        limit: 50,
        search: debouncedSearchTerm,
        investorStatusId: 1,
      });
      setAllInvestor(response?.data?.results || []);
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, [debouncedSearchTerm]);

  const handleSearch = debounce((input) => {
    setUserInput(input);
    setFetching(true);
  }, 800);

  return (
    <>
      {contextHolder}
      <div className="page-container" style={{ padding: '0 0 24px' }}>
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0 }}>
            Add Transaction
          </Title>
          <Text type="secondary">
            Create a new transaction record
          </Text>
        </div>

        <Card 
          bordered={false} 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Form
            form={form}
            layout="vertical"
            name="add_transaction"
            onFinish={onFinish}
            initialValues={initialFields}
            scrollToFirstError
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="investorId"
                  label="Investor"
                  rules={[
                    {
                      required: true,
                      message: "Please select an investor",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    loading={fetching}
                    onSearch={handleSearch}
                    placeholder="Search investor by name"
                    filterOption={false}
                    style={{ borderRadius: '8px', height: '40px' }}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                  >
                    {allInvestor.map((investor) => (
                      <Option key={investor.investorId} value={investor.investorId}>
                        {`${investor.name} (${investor.userName})`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="tag"
                  label="Tag"
                  rules={[
                    {
                      required: true,
                      message: "Please select a tag",
                    },
                  ]}
                >
                  <Select 
                    placeholder="Select tag"
                    style={{ borderRadius: '8px', height: '40px' }}
                    suffixIcon={<TagIcon size={16} />}
                  >
                    <Option value="Old">Old</Option>
                    <Option value="New">New</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[
                    {
                      required: true,
                      message: "Please enter transaction amount",
                    },
                    {
                      validator: (_, value) => {
                        if (value === undefined || value === null || value === "") {
                          return Promise.resolve();
                        }
                        if (Number(value) <= 0) {
                          return Promise.reject("Amount must be greater than zero");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter amount"
                    min={1}
                    style={{
                      width: "100%",
                      borderRadius: '8px',
                      height: '40px'
                    }}
                    formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/₹\s?|(,*)/g, '')}
                    prefix={<DollarSign size={16} />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="dateTime"
                  label="Date"
                  rules={[
                    {
                      required: true,
                      message: "Please select a date",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Select date"
                    format="DD MMM YYYY"
                    style={{
                      width: "100%",
                      borderRadius: '8px',
                      height: '40px'
                    }}
                    suffixIcon={<Calendar size={16} />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="note"
                  label="Note"
                >
                  <Input.TextArea 
                    placeholder="Add transaction notes (optional)"
                    rows={4}
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={formLoading}
                style={{ 
                  height: '40px',
                  borderRadius: '8px',
                  width: '100%',
                  maxWidth: '200px'
                }}
              >
                Add Transaction
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default AddTransaction;