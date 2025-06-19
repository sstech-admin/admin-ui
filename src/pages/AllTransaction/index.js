import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Input,
  Menu,
  message,
  Row,
  Space,
  Table,
  Tag,
  Typography
} from "antd";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { Link } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import {
  deleteTransaction,
  getAllTransaction
} from "../../slices/transaction/transactionAPI";
import dayjs from "dayjs";
import { SearchOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import { useDebounce } from "../../helpers/useDebounce";

const { Title, Text } = Typography;

const AllTransaction = () => {
  document.title = "All Transactions" + process.env.REACT_APP_PAGE_TITLE;

  const [data, setData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [messageApiType, contextHolder] = message.useMessage();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [transactionModeId, setTransactionModeId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const transactionModeOptions = [
    { label: "Credit", value: 1 },
    { label: "Debit", value: 2 },
  ];
  
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      {
        key: "all-data",
        text: "Select All",
        onSelect: () => {
          setSelectedRowKeys(data.map((item) => item.transactionId));
        },
      },
      {
        key: "clear",
        text: "Clear Selection",
        onSelect: () => {
          setSelectedRowKeys([]);
        },
      },
    ],
  };
  
  const { confirm } = message.Modal;
  
  const fetchData = async (limit, page) => {
    try {
      setLoading(true);
      const payload = {
        page: page || pagination?.currentPage,
        limit: limit || pagination?.defaultPageSize,
        search: searchInputValue,
      };
      
      if (transactionModeId) {
        payload.transactionModeId = transactionModeId;
      }
      
      const response = await getAllTransaction(payload);
      
      if (response.success === true) {
        setData(response.data.results);
        setPagination((pre) => ({
          ...pre,
          total: response.data.totalResults,
          defaultPageSize: response.data.limit,
          currentPage: response.data.page,
        }));
      } else {
        setData([]);
        setPagination((pre) => ({
          ...pre,
          total: 0,
          defaultPageSize: 20,
          currentPage: 1,
        }));
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    }
    setLoading(false);
  };

  const deleteTransactionHandler = async (record) => {
    try {
      setLoading(true);
      const response = await deleteTransaction({
        transactionId: record?.transactionId,
      });

      if (response.success === true) {
        await fetchData();
        messageApiType.open({
          type: "success",
          content: `Transaction deleted successfully`,
        });
      } else {
        messageApiType.open({
          type: "error",
          content: `Failed to delete transaction`,
        });
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: `Delete Transaction`,
      content: "Are you sure you want to delete this transaction? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deleteTransactionHandler(record);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [transactionModeId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInputValue]);

  const handleSearch = () => {
    fetchData();
  };

  const handleClear = () => {
    setSearchInputValue("");
  };

  const getStatusTag = (statusId) => {
    let status = statusId;
    if (status === 0) {
      status = "Pending";
    } else if (status === 1) {
      status = "Approved";
    } else if (status === 2) {
      status = "Rejected";
    }
    
    let color;
    switch (status) {
      case "Pending":
        color = "gold";
        break;
      case "Approved":
        color = "green";
        break;
      case "Rejected":
        color = "red";
        break;
      default:
        color = "default";
    }
    
    return (
      <Tag color={color} style={{ borderRadius: '16px', padding: '2px 12px' }}>
        {status}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Investor",
      dataIndex: "investorName",
      key: "investor",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {`${record?.investorFirstName || ''} ${record?.investorMiddleName || ''} ${record?.investorLastName || ''}`}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {record?.investorName && `(${record.investorName})`}
          </div>
        </div>
      ),
    },
    {
      title: "Account",
      dataIndex: "accountName",
      key: "account",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => (
        <div style={{ 
          color: record.transactionMode === "Payment In" ? '#10b981' : '#ef4444',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center'
        }}>
          {record.transactionMode === "Payment In" ? 
            <ArrowUpRight size={16} style={{ marginRight: '4px' }} /> : 
            <ArrowDownRight size={16} style={{ marginRight: '4px' }} />
          }
          ₹{parseFloat(text).toLocaleString()}
        </div>
      ),
    },
    {
      title: "Transaction Mode",
      dataIndex: "transactionMode",
      key: "transactionMode",
      render: (text) => (
        <Tag color={text === "Payment In" ? "blue" : "volcano"} style={{ borderRadius: '16px', padding: '2px 12px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "transactionStatusId",
      key: "status",
      render: (statusId) => getStatusTag(statusId),
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      key: "date",
      render: (text) => dayjs(text).format("DD MMM YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu items={[
              {
                key: '1',
                label: 'View Details',
                icon: <Search size={14} />,
                onClick: () => window.location.href = `/transaction/${record.transactionId}`
              },
              {
                key: '2',
                label: 'Delete',
                icon: <Trash2 size={14} />,
                danger: true,
                onClick: () => showDeleteConfirm(record)
              }
            ]} />
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreHorizontal size={18} />} />
        </Dropdown>
      ),
    },
  ];

  const menu = (
    <Menu
      items={[
        {
          key: 'all',
          label: 'All Transaction Types',
          onClick: () => setTransactionModeId(null)
        },
        ...transactionModeOptions.map(option => ({
          key: option.value,
          label: option.label,
          onClick: () => setTransactionModeId(option.value)
        }))
      ]}
    />
  );

  return (
    <>
      {contextHolder}
      <div className="page-container" style={{ padding: '0 0 24px' }}>
        <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            Transactions
          </Title>
          <Link to="/add-transaction">
            <Button 
              type="primary" 
              icon={<Plus size={16} />}
              size="large"
              style={{ borderRadius: '8px', height: '40px' }}
            >
              Add Transaction
            </Button>
          </Link>
        </div>

        <Card 
          bordered={false} 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Input
              placeholder="Search transactions..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              prefix={<Search size={16} style={{ color: '#94a3b8' }} />}
              style={{ 
                maxWidth: '320px',
                borderRadius: '8px',
                height: '40px'
              }}
              allowClear
            />
            
            <Dropdown overlay={menu} trigger={['click']}>
              <Button 
                style={{ 
                  borderRadius: '8px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Space>
                  <Filter size={16} />
                  {transactionModeId ? 
                    transactionModeOptions.find(opt => opt.value === transactionModeId)?.label : 
                    'Filter by Type'}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            
            <Button 
              icon={<Download size={16} />}
              style={{ 
                borderRadius: '8px',
                height: '40px',
                marginLeft: 'auto'
              }}
            >
              Export
            </Button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              rowKey="transactionId"
              pagination={{
                defaultPageSize: pagination?.defaultPageSize,
                total: pagination?.total,
                current: pagination?.currentPage,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} transactions`,
                showSizeChanger: true,
                onChange: async (page, pageSize) => {
                  await setPagination((pre) => ({
                    ...pre,
                    defaultPageSize: pageSize,
                    currentPage: page,
                  }));
                  await fetchData(pageSize, page);
                },
                pageSizeOptions: [10, 20, 50, 100],
                style: { marginTop: '16px' }
              }}
              style={{ overflowX: 'auto' }}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default AllTransaction;