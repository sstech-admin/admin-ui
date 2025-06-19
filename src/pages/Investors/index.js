import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  message,
  Row,
  Space,
  Table,
  Typography,
  Button,
  Input,
  Skeleton,
  Tag,
  Dropdown,
  Menu,
  Avatar
} from "antd";
import {
  EyeIcon,
  PencilIcon,
  Trash2,
  Search,
  Plus,
  Filter,
  ChevronDown,
  UserPlus
} from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { Link } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import {
  deleteInvestor,
  GetAllInvestor,
} from "../../slices/Invester/investerAPI";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

const Investors = () => {
  document.title = "Investors" + process.env.REACT_APP_PAGE_TITLE;

  const [data, setData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [loadingInvestors, setLoadingInvestors] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [messageApiType, contextHolder] = message.useMessage();
  const [paymentTypeId, setPaymentTypeId] = useState(null);
  const formatIndianNumber = (num) =>
    new Intl.NumberFormat("en-IN").format(num);
  
  const paymentTypeOptions = [
    { label: "Weekly", value: 7 },
    { label: "Monthly", value: 31 },
    { label: "None", value: 0 },
  ];
  
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  
  const { confirm } = message.Modal;

  const deletInvestor = async (item) => {
    try {
      setLoading(true);
      const response = await deleteInvestor({
        investorId: item?.investorId,
      });
      if (response?.success === true) {
        await fetchData();
        messageApiType.open({
          type: "success",
          content: "Investor deleted successfully.",
        });
      } else {
        messageApiType.open({
          type: "error",
          content: "Failed to delete Investor.",
        });
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error.message || "An unknown error occurred.",
      });
    }
    setLoading(false);
  };

  const showDeleteConfirm = (Value) => {
    confirm({
      title: `Are you sure you want to delete ${Value.userName}?`,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deletInvestor(Value);
      }
    });
  };

  const columns = [
    {
      title: "Investor",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ 
              backgroundColor: '#f0f9ff', 
              color: '#3b82f6',
              marginRight: '12px',
              fontWeight: 'bold'
            }}
          >
            {record.name?.charAt(0) || 'U'}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{record.userName}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Payment System",
      dataIndex: "paymentSystemName",
      key: "paymentSystem",
      render: (text) => (
        <Tag color={text === "Weekly" ? "blue" : "purple"} style={{ borderRadius: '16px', padding: '2px 12px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => (
        <div>
          <div
            style={{
              color: `${record?.amountColour}`,
              fontWeight: "600",
              fontSize: '16px'
            }}
          >
            ₹{formatIndianNumber(record?.amount + (record?.profitOrLossAmount || 0))}
          </div>
          {record?.amountText && (
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {record?.amountText}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeIcon size={18} />} 
            style={{ color: '#3b82f6' }}
            onClick={() => window.location.href = `/investors/${record.investorId}`}
          />
          <Button 
            type="text" 
            icon={<PencilIcon size={18} />} 
            style={{ color: '#10b981' }}
            onClick={() => window.location.href = `/add-investors/${record.investorId}`}
          />
          <Button 
            type="text" 
            icon={<Trash2 size={18} />} 
            danger
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [searchInputValue, paymentTypeId]);

  const fetchData = async (limit, page) => {
    try {
      setLoadingInvestors(true);
      const payload = {
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
        search: searchInputValue,
        investorStatusId: 1,
      };
      
      if (paymentTypeId) {
        payload.paymentSystemId = paymentTypeId;
      }
      
      const response = await GetAllInvestor(payload);
      
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
    setLoadingInvestors(false);
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleClear = () => {
    setSearchInputValue("");
  };

  const menu = (
    <Menu
      items={[
        {
          key: 'all',
          label: 'All Payment Types',
          onClick: () => setPaymentTypeId(null)
        },
        ...paymentTypeOptions.map(option => ({
          key: option.value,
          label: option.label,
          onClick: () => setPaymentTypeId(option.value)
        }))
      ]}
    />
  );

  return (
    <>
      {contextHolder}
      <div className="page-container" style={{ padding: '0 0 24px' }}>
        <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Investors
          </Typography.Title>
          <Link to="/add-investors">
            <Button 
              type="primary" 
              icon={<UserPlus size={16} />}
              size="large"
              style={{ borderRadius: '8px', height: '40px' }}
            >
              Add Investor
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
              placeholder="Search investors..."
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
                  {paymentTypeId ? 
                    paymentTypeOptions.find(opt => opt.value === paymentTypeId)?.label : 
                    'Filter by Payment Type'}
                  <ChevronDown size={16} />
                </Space>
              </Button>
            </Dropdown>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            loading={loadingInvestors}
            rowKey="investorId"
            pagination={{
              defaultPageSize: pagination?.defaultPageSize,
              total: pagination?.total,
              current: pagination?.currentPage,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} investors`,
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
        </Card>
      </div>
    </>
  );
};

export default Investors;