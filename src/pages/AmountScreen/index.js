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
  DatePicker
} from "antd";
import {
  saveAmount,
  getAllAmount,
  saveFinalAmount,
} from "../../slices/generalSetting/generalSettingAPI";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { EyeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import usecustomStyles from "../../Common/Hooks/customStyles";
dayjs.extend(utc);

const AmountScreen = () => {
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pnlDate, setPnlDate] = useState(null);
  const customStyles = usecustomStyles();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
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
    }
  };

  const handleSave = async (values) => {
    try {
      await saveAmount(values);
      message.success("Account details saved successfully!");
      fetchAccounts();
      form.resetFields();
    } catch (error) {
      message.error("Failed to save account details");
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

  const formatDate1 = (dateString) => {
    return dayjs.utc(dateString).format('DD-MMM-YYYY');
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    // {
    //   title: "Account Type",
    //   dataIndex: "accountType",
    //   key: "accountType",
    // },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (_, record) => {
        return <>{formatDate1(record?.updatedAt)}</>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      editable: true,
      align: "center",
      render: (_, record) => {
        let status = record.status;
        let statusStyle = {};

        // Set style based on status
        if (status === "Pending") {
          statusStyle = {
            backgroundColor: "#FFC107",
            color: "#000",
            padding: "7px 10px",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "14px",
          };
        } else if (status === "Completed") {
          statusStyle = {
            backgroundColor: "#468e39",
            color: "white",
            padding: "7px 10px",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "14px",
          };
        } else if (status === "Failed") {
          statusStyle = {
            backgroundColor: "#DC3545",
            color: "white",
            padding: "7px 10px",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "14px",
          };
        }

        return <span style={statusStyle}>{status}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return (
          <Space size={12}>
            {record?.bulkTransactionId ? 
            <Link to={`/all-bulk-transaction/${record?.bulkTransactionId}`}>
              <EyeIcon
                onClick={() => {
                  console.log("On Show Icone Press", record);
                }}
                className="hovered-icon"
                color={customStyles.colorPrimary}
              />
            </Link>
            : null }
          </Space>
        );
      },
    },
  ];

  return (
    <Card title={"Profit & Loss"} style={{ margin: `10px 0px` }}>
      <Form form={form} onFinish={handleSave}>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <InputNumber placeholder="Enter amount" />
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
            placeholder="DD MMM YYYY"
            format="DD MMM YYYY"
            style={{ width: 160 }}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="tag"
          label="Tag"
          rules={[
            { required: true, message: "Please select a tag!" },
          ]}
        >
          <Select placeholder="Select tag">
            <Select.Option value="Old">Old</Select.Option>
            <Select.Option value="New">New</Select.Option>
          </Select>
        </Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button
            type="primary"
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
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{ marginTop: 20 }}
      />
    </Card>
  );
};

export default AmountScreen;
