import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  InputNumber,
  Select,
  message,
  Card,
  Table,
  Space,
  DatePicker,
  Typography,
  Row,
  Col,
  Statistic,
  Tag
} from "antd";
import {
  saveAmount,
  getAllAmount,
  saveFinalAmount,
} from "../../slices/generalSetting/generalSettingAPI";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { ArrowUpRight, Calendar, Check, Eye } from "lucide-react";
import { Link } from "react-router-dom";
dayjs.extend(utc);

const { Title, Text } = Typography;

const AmountScreen = () => {
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pnlDate, setPnlDate] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await getAllAmount();
      if (response.success === true) {
        const accounts = response.data.map((account) => ({
          key: account.id,
          amount: account.amount,
          accountType: account.accountType,
          tag: account.tag,
          updatedAt: account.updatedAt,
          bulkTransactionId: account.bulkTransactionId,
          status: account.bulkTransactionStatus, 
        }));
        setDataSource(accounts);
      } else {
        message.error("Failed to fetch accounts");
      }
    } catch (error) {
      message.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      await saveAmount(values);
      message.success("Amount saved successfully!");
      fetchAccounts();
      form.resetFields();
    } catch (error) {
      message.error("Failed to save amount");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalAmount = async (values) => {
    try {
      setLoading(true);
      await saveFinalAmount(values);
      message.success("Final amount saved successfully!");
      fetchAccounts();
      form.resetFields();
    } catch (error) {
      message.error("Failed to save final amount");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return dayjs.utc(dateString).format('DD MMM YYYY');
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <Text strong style={{ color: '#3b82f6' }}>₹{parseFloat(text).toLocaleString()}</Text>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (tag) => (
        <Tag color={tag === "New" ? "blue" : "orange"} style={{ borderRadius: '16px', padding: '2px 12px' }}>
          {tag}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => formatDate(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        
        if (status === "Pending") {
          color = "gold";
        } else if (status === "Completed") {
          color = "green";
        } else if (status === "Failed") {
          color = "red";
        } else {
          color = "default";
        }
        
        return (
          <Tag color={color} style={{ borderRadius: '16px', padding: '2px 12px' }}>
            {status || "Unknown"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        record?.bulkTransactionId ? (
          <Link to={`/all-bulk-transaction/${record?.bulkTransactionId}`}>
            <Button 
              type="text" 
              icon={<Eye size={18} />} 
              style={{ color: '#3b82f6' }}
            />
          </Link>
        ) : null
      ),
    },
  ];

  // Calculate total amount
  const totalAmount = dataSource.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  return (
    <div className="page-container" style={{ padding: '0 0 24px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0 }}>
          Profit & Loss
        </Title>
        <Text type="secondary">
          Manage profit and loss entries
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Statistic 
              title="Total P&L Amount" 
              value={totalAmount} 
              precision={2}
              prefix="₹"
              suffix={<ArrowUpRight size={16} style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#3b82f6' }}
            />
            <div style={{ marginTop: '24px' }}>
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[{ required: true, message: "Please input the amount!" }]}
                >
                  <InputNumber 
                    placeholder="Enter amount" 
                    style={{ width: '100%', borderRadius: '8px', height: '40px' }}
                    formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/₹\s?|(,*)/g, '')}
                  />
                </Form.Item>
                
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Please select a Date!" }]}
                  getValueProps={(value) => ({
                    value: value ? dayjs(value, 'YYYY-MM-DD') : null,
                  })}
                  getValueFromEvent={(date) => (date ? date.format('YYYY-MM-DD') : null)}
                >
                  <DatePicker
                    placeholder="Select date"
                    format="DD MMM YYYY"
                    style={{ width: '100%', borderRadius: '8px', height: '40px' }}
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                    suffixIcon={<Calendar size={16} />}
                  />
                </Form.Item>

                <Form.Item
                  name="tag"
                  label="Tag"
                  rules={[
                    { required: true, message: "Please select a tag!" },
                  ]}
                >
                  <Select 
                    placeholder="Select tag"
                    style={{ width: '100%', borderRadius: '8px', height: '40px' }}
                  >
                    <Select.Option value="Old">Old</Select.Option>
                    <Select.Option value="New">New</Select.Option>
                  </Select>
                </Form.Item>
                
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    style={{ borderRadius: '8px', height: '40px' }}
                    loading={loading}
                  >
                    Save
                  </Button>
                  <Button
                    type="default"
                    style={{ borderRadius: '8px', height: '40px' }}
                    loading={loading}
                    onClick={() => {
                      form
                        .validateFields()
                        .then((values) => {
                          handleFinalAmount(values);
                        })
                        .catch((error) => {
                          console.log("Validation failed:", error);
                        });
                    }}
                  >
                    Final Amount
                  </Button>
                </Space>
              </Form>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Card 
            title="P&L History" 
            bordered={false} 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              loading={loading}
              pagination={{ pageSize: 10 }}
              style={{ overflowX: 'auto' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AmountScreen;