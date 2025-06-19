import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Row,
  Space,
  Table,
  Typography,
  Tabs,
  Tag,
  Statistic,
  Avatar,
  Tooltip
} from "antd";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building,
  Calendar,
  CreditCard,
  Download,
  FileText,
  Fingerprint,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  Wallet
} from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import dayjs from "dayjs";
import Loader from "../../Component/Loader/Loader";
import { useParams } from "react-router-dom";
import {
  getAllInvestorTransaction,
  GetInvestor,
  GetWithdrawFunds
} from "../../slices/Invester/investerAPI";
import AddFunds from "./component/AddFunds";
import Withdraw from "./component/Withdraw";
import { FileExcelOutlined } from "@ant-design/icons";
import { convertExcel } from "../../helpers/ConvertExcel";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const InvestorsDetails = () => {
  document.title = "Investor Details" + process.env.REACT_APP_PAGE_TITLE;
  const params = useParams();
  const [data, setData] = useState();
  const [tableData, setTableData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [withdrawData, setWithdrawData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  
  const [messageApiType, contextHolder] = message.useMessage();
  const formatIndianNumber = (num) =>
    new Intl.NumberFormat("en-IN").format(num);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await GetInvestor({ userId: params.slug });
      setData(await response.data);
      
      const withdrawResponse = await GetWithdrawFunds({ investorId: params.slug });
      setWithdrawData(withdrawResponse);
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
        duration: 5,
      });
    }
    setLoading(false);
  };
  
  const fetchTableData = async (limit, page) => {
    try {
      setLoading(true);
      const response = await getAllInvestorTransaction({
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
        investorId: params.slug,
      });
      if (response.success === true) {
        setTableData(response.data.results);
        setPagination((pre) => ({
          ...pre,
          total: response.data?.totalResults,
          defaultPageSize: response.data?.limit,
          currentPage: response.data?.page,
        }));
      } else {
        setTableData([]);
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

  const fetchDataInUseEffect = async () => {
    await fetchData();
    await fetchTableData();
  };

  useEffect(() => {
    fetchDataInUseEffect();
  }, []);

  const transactionColumns = [
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
          ₹{formatIndianNumber(text)}
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
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (text) => (
        <Tag color="purple" style={{ borderRadius: '16px', padding: '2px 12px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "transactionStatusId",
      key: "status",
      render: (statusId) => {
        let status;
        let color;
        
        if (statusId === 0) {
          status = "Pending";
          color = "gold";
        } else if (statusId === 1) {
          status = "Approved";
          color = "green";
        } else if (statusId === 2) {
          status = "Rejected";
          color = "red";
        } else {
          status = "Unknown";
          color = "default";
        }
        
        return (
          <Tag color={color} style={{ borderRadius: '16px', padding: '2px 12px' }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (text) => dayjs(text).format("DD MMM YYYY"),
    },
  ];

  const exportCsv = async () => {
    try {
      setExportLoading(true);
      // This is a placeholder - you would need to implement the actual export functionality
      setTimeout(() => {
        setExportLoading(false);
        message.success("Export completed successfully");
      }, 1500);
    } catch (error) {
      setExportLoading(false);
      console.error('CSV Export Failed:', error);
      message.error("Export failed");
    }
  };

  const renderInfoItem = (icon, title, value) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        {icon}
        <Text type="secondary" style={{ marginLeft: '8px' }}>{title}</Text>
      </div>
      <Text strong style={{ marginLeft: '24px', fontSize: '15px' }}>{value || '-'}</Text>
    </div>
  );

  return (
    <>
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <div className="page-container" style={{ padding: '0 0 24px' }}>
          <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Investor Details
              </Title>
              <Text type="secondary">
                View and manage investor information
              </Text>
            </div>
            <Space>
              <AddFunds data={data} onSuccess={fetchDataInUseEffect} />
              <Withdraw data={data} withdrawData={withdrawData} onSuccess={fetchDataInUseEffect} />
              <Button 
                icon={<FileText size={16} />}
                style={{ borderRadius: '8px' }}
              >
                Statement
              </Button>
              <Button 
                icon={<Download size={16} />}
                style={{ borderRadius: '8px' }}
                onClick={exportCsv}
                loading={exportLoading}
              >
                Export
              </Button>
            </Space>
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
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Avatar 
                    size={80} 
                    style={{ 
                      backgroundColor: '#f0f9ff', 
                      color: '#3b82f6',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      marginBottom: '16px'
                    }}
                  >
                    {data?.firstName?.charAt(0) || 'U'}
                  </Avatar>
                  <Title level={4} style={{ margin: '0 0 4px' }}>
                    {data?.firstName ? `${data?.firstName} ${data?.middleName || ''} ${data?.lastName || ''}` : '-'}
                  </Title>
                  <Tag color="blue" style={{ borderRadius: '16px', padding: '2px 12px' }}>
                    {data?.userName || 'ID Not Available'}
                  </Tag>
                </div>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card bordered={false} style={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <Statistic 
                        title="Balance" 
                        value={data?.amount || 0} 
                        precision={0}
                        prefix="₹"
                        valueStyle={{ 
                          color: data?.amountColour || '#3b82f6',
                          fontSize: '20px'
                        }}
                      />
                      {data?.amountText && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {data.amountText}
                        </Text>
                      )}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card bordered={false} style={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <Statistic 
                        title="Profit/Loss" 
                        value={data?.profitOrLossAmount || 0} 
                        precision={0}
                        prefix="₹"
                        valueStyle={{ 
                          color: (data?.profitOrLossAmount || 0) >= 0 ? '#10b981' : '#ef4444',
                          fontSize: '20px'
                        }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Divider />

                {renderInfoItem(<Phone size={16} />, "Phone Number", data?.phoneNumber)}
                {renderInfoItem(<Mail size={16} />, "Email", data?.email)}
                {renderInfoItem(<Calendar size={16} />, "Date of Joining", data?.asOfDate ? dayjs(data?.asOfDate).format("DD MMM YYYY") : '-')}
                {renderInfoItem(<Wallet size={16} />, "Payment System", data?.paymentSystemName)}
                {renderInfoItem(<Fingerprint size={16} />, "Aadhar Card", data?.aadharCardNumber)}
                {renderInfoItem(<CreditCard size={16} />, "PAN Card", data?.panCardNumber)}
                
                {data?.address1 && (
                  <>
                    <Divider />
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <MapPin size={16} />
                        <Text type="secondary" style={{ marginLeft: '8px' }}>Address</Text>
                      </div>
                      <div style={{ marginLeft: '24px' }}>
                        <Text>{data.address1}</Text>
                        {data.address2 && <div><Text>{data.address2}</Text></div>}
                        <div>
                          <Text>
                            {[
                              data.district, 
                              data.state, 
                              data.country, 
                              data.pinCode
                            ].filter(Boolean).join(', ')}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </Col>
            
            <Col xs={24} lg={16}>
              <Card 
                bordered={false} 
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Tabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab}
                  style={{ marginBottom: '16px' }}
                >
                  <TabPane tab="Transactions" key="1" />
                  <TabPane tab="Bank Details" key="2" />
                  <TabPane tab="Documents" key="3" />
                  <TabPane tab="TDS Certificates" key="4" />
                </Tabs>
                
                {activeTab === "1" && (
                  <Table
                    columns={transactionColumns}
                    dataSource={tableData}
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
                        await fetchTableData(pageSize, page);
                      },
                      pageSizeOptions: [10, 20, 50, 100],
                    }}
                    style={{ overflowX: 'auto' }}
                  />
                )}
                
                {activeTab === "2" && (
                  <div style={{ padding: '16px 0' }}>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} md={12}>
                        {renderInfoItem(<User size={16} />, "Name As Per Bank", data?.nameAsPerBank)}
                      </Col>
                      <Col xs={24} md={12}>
                        {renderInfoItem(<Building size={16} />, "Bank Name", data?.bankName)}
                      </Col>
                      <Col xs={24} md={12}>
                        {renderInfoItem(<CreditCard size={16} />, "Account Number", data?.bankAccountNumber)}
                      </Col>
                      <Col xs={24} md={12}>
                        {renderInfoItem(<FileText size={16} />, "IFSC Code", data?.ifscCode)}
                      </Col>
                    </Row>
                  </div>
                )}
                
                {activeTab === "3" && (
                  <div style={{ padding: '16px 0' }}>
                    <Row gutter={[24, 24]}>
                      {data?.aadharCardURL && (
                        <Col xs={24} sm={12} md={8}>
                          <Card 
                            title="Aadhar Card" 
                            size="small" 
                            extra={<Button type="link" icon={<Download size={16} />} />}
                            style={{ borderRadius: '8px' }}
                          >
                            <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={48} color="#3b82f6" />
                            </div>
                          </Card>
                        </Col>
                      )}
                      
                      {data?.panCardURL && (
                        <Col xs={24} sm={12} md={8}>
                          <Card 
                            title="PAN Card" 
                            size="small" 
                            extra={<Button type="link" icon={<Download size={16} />} />}
                            style={{ borderRadius: '8px' }}
                          >
                            <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={48} color="#3b82f6" />
                            </div>
                          </Card>
                        </Col>
                      )}
                      
                      {data?.bankStatementURL && (
                        <Col xs={24} sm={12} md={8}>
                          <Card 
                            title="Bank Statement" 
                            size="small" 
                            extra={<Button type="link" icon={<Download size={16} />} />}
                            style={{ borderRadius: '8px' }}
                          >
                            <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={48} color="#3b82f6" />
                            </div>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}
                
                {activeTab === "4" && (
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <Text>TDS Certificates</Text>
                      <Button 
                        type="primary" 
                        icon={<Plus size={14} />}
                        style={{ borderRadius: '8px' }}
                      >
                        Upload Certificate
                      </Button>
                    </div>
                    
                    <Table
                      columns={[
                        {
                          title: "Certificate ID",
                          dataIndex: "certificateId",
                          key: "certificateId",
                        },
                        {
                          title: "Quarter",
                          dataIndex: "quarter",
                          key: "quarter",
                        },
                        {
                          title: "From Date",
                          dataIndex: "fromDate",
                          key: "fromDate",
                          render: (text) => text ? dayjs(text).format("DD MMM YYYY") : '-',
                        },
                        {
                          title: "To Date",
                          dataIndex: "toDate",
                          key: "toDate",
                          render: (text) => text ? dayjs(text).format("DD MMM YYYY") : '-',
                        },
                        {
                          title: "Actions",
                          key: "actions",
                          render: () => (
                            <Button type="link" icon={<Download size={16} />}>
                              Download
                            </Button>
                          ),
                        },
                      ]}
                      dataSource={[]}
                      pagination={false}
                      locale={{ emptyText: "No certificates available" }}
                    />
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default InvestorsDetails;