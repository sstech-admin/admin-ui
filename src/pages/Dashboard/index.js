import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Statistic, Table, Button, Dropdown, Space, Tag } from 'antd';
import { ArrowUpRight, ArrowDownRight, Download, Filter, ChevronDown } from 'lucide-react';
import { Line } from '@ant-design/plots';
import './Dashboard.css';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [returnData, setReturnData] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Fetch return data
    const fetchReturns = async () => {
      try {
        const response = await fetch("https://gspkyxp4p6.ap-south-1.awsapprunner.com/v1/amount/calculateReturn");
        const result = await response.json();

        if (result.success && result.data) {
          setReturnData(result.data);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    // Fetch mock transaction data
    const fetchTransactions = () => {
      const mockTransactions = [
        {
          key: '1',
          amount: 1000,
          tag: 'New',
          date: '2025-06-19',
          status: 'Completed',
          type: 'profit'
        },
        {
          key: '2',
          amount: 1200,
          tag: 'Old',
          date: '2025-06-19',
          status: 'Completed',
          type: 'profit'
        },
        {
          key: '3',
          amount: 1060,
          tag: 'New',
          date: '2025-06-18',
          status: 'Completed',
          type: 'profit'
        },
        {
          key: '4',
          amount: -230,
          tag: 'Old',
          date: '2025-06-18',
          status: 'Completed',
          type: 'loss'
        },
      ];
      
      setTransactions(mockTransactions);
    };

    fetchReturns();
    fetchTransactions();
  }, []);

  // Chart data
  const chartData = [
    { month: 'Jan', value: 3 },
    { month: 'Feb', value: 4 },
    { month: 'Mar', value: 3.5 },
    { month: 'Apr', value: 5 },
    { month: 'May', value: 4.9 },
    { month: 'Jun', value: 6 },
    { month: 'Jul', value: 7 },
    { month: 'Aug', value: 9 },
    { month: 'Sep', value: 8 },
    { month: 'Oct', value: 11 },
    { month: 'Nov', value: 15 },
    { month: 'Dec', value: 20 },
  ];

  const config = {
    data: chartData,
    xField: 'month',
    yField: 'value',
    smooth: true,
    lineStyle: {
      stroke: '#3b82f6',
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#3b82f6',
        stroke: '#ffffff',
        lineWidth: 2,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}%`,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#3b82f6',
          fill: '#ffffff',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <span style={{ 
          color: record.type === 'profit' ? '#10b981' : '#ef4444',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center'
        }}>
          {record.type === 'profit' ? 
            <ArrowUpRight size={16} style={{ marginRight: '4px' }} /> : 
            <ArrowDownRight size={16} style={{ marginRight: '4px' }} />
          }
          ${Math.abs(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      render: tag => (
        <Tag color={tag === 'New' ? 'blue' : 'orange'} style={{ borderRadius: '16px', padding: '2px 12px' }}>
          {tag}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        return formattedDate;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color="green" style={{ borderRadius: '16px', padding: '2px 12px' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="text" icon={<Download size={16} />} />
      ),
    },
  ];

  const items = [
    {
      key: '1',
      label: 'All Tags',
    },
    {
      key: '2',
      label: 'New',
    },
    {
      key: '3',
      label: 'Old',
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Financial Dashboard</Title>
            <Text type="secondary">Manage your profit and loss transactions</Text>
          </Col>
          <Col>
            <Text type="secondary">Last updated: {new Date().toLocaleDateString()}</Text>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Statistic 
              title="Total P&L" 
              value={1970} 
              precision={0} 
              prefix="$" 
              valueStyle={{ color: '#3b82f6' }}
              suffix={<ArrowUpRight size={16} style={{ color: '#10b981' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Statistic 
              title="Profit Entries" 
              value={5} 
              valueStyle={{ color: '#10b981' }}
              suffix={<ArrowUpRight size={16} style={{ color: '#10b981' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Statistic 
              title="Loss Entries" 
              value={2} 
              valueStyle={{ color: '#ef4444' }}
              suffix={<ArrowDownRight size={16} style={{ color: '#ef4444' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Performance Overview" className="chart-card">
            <Line {...config} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Returns" className="returns-card">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered={false} className="mini-stat-card">
                  <Statistic 
                    title="1 Month" 
                    value={parseFloat(returnData.oneMonthReturn?.toFixed(2) || 0)} 
                    precision={2} 
                    suffix="%" 
                    valueStyle={{ color: returnData.oneMonthReturn >= 0 ? '#10b981' : '#ef4444' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} className="mini-stat-card">
                  <Statistic 
                    title="3 Months" 
                    value={parseFloat(returnData.threeMonthReturn?.toFixed(2) || 0)} 
                    precision={2} 
                    suffix="%" 
                    valueStyle={{ color: returnData.threeMonthReturn >= 0 ? '#10b981' : '#ef4444' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} className="mini-stat-card">
                  <Statistic 
                    title="6 Months" 
                    value={parseFloat(returnData.sixMonthReturn?.toFixed(2) || 0)} 
                    precision={2} 
                    suffix="%" 
                    valueStyle={{ color: returnData.sixMonthReturn >= 0 ? '#10b981' : '#ef4444' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} className="mini-stat-card">
                  <Statistic 
                    title="1 Year" 
                    value={parseFloat(returnData.oneYearReturn?.toFixed(2) || 0)} 
                    precision={2} 
                    suffix="%" 
                    valueStyle={{ color: returnData.oneYearReturn >= 0 ? '#10b981' : '#ef4444' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card 
        title="Recent Transactions" 
        style={{ marginTop: '24px' }}
        extra={
          <Space>
            <Dropdown menu={{ items }}>
              <Button icon={<Filter size={14} />}>
                <Space>
                  Filter
                  <ChevronDown size={14} />
                </Space>
              </Button>
            </Dropdown>
            <Button type="primary" icon={<Download size={14} />}>Export</Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={transactions} 
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;