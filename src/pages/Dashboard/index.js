import React, { useState, useEffect } from 'react';
import StatCard from './StatCard.js';
import './Dashboard.css';
import { Card, Row, Col, Typography } from 'antd';
import { DollarSign, TrendingUp, BarChart2, PieChart } from 'lucide-react';

const labelMap = {
  oneMonthReturn: "1 Month",
  threeMonthReturn: "3 Months",
  sixMonthReturn: "6 Months",
  oneYearReturn: "1 Year",
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [returnData, setReturnData] = useState({});
  const [portfolioValue, setPortfolioValue] = useState("18,254.89.00");
  const [profit, setProfit] = useState("34543.00");
  const [loss, setLoss] = useState("12423.00");

  const stockData = [
    { 
      name: "Apple", 
      symbol: "AAPL", 
      price: "$454.00", 
      change: "+10%", 
      icon: <span style={{ backgroundColor: '#000', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>A</span>,
      trend: "up"
    },
    { 
      name: "Meta", 
      symbol: "META", 
      price: "$454.00", 
      change: "+10%", 
      icon: <span style={{ backgroundColor: '#1877F2', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>M</span>,
      trend: "down"
    },
    { 
      name: "Microsoft", 
      symbol: "MSFT", 
      price: "$454.00", 
      change: "+10%", 
      icon: <span style={{ backgroundColor: '#00A4EF', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>M</span>,
      trend: "up"
    },
    { 
      name: "Google", 
      symbol: "GOOGL", 
      price: "$454.00", 
      change: "+10%", 
      icon: <span style={{ backgroundColor: '#4285F4', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>G</span>,
      trend: "down"
    }
  ];

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setReturnData({
            oneMonthReturn: 5.2,
            threeMonthReturn: 12.7,
            sixMonthReturn: 18.3,
            oneYearReturn: 24.5,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("API error:", error);
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Main Portfolio Card */}
        <Card 
          style={{ 
            background: '#1e3a31', 
            color: 'white', 
            marginBottom: '24px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <Row>
            <Col span={24}>
              <Typography.Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Portfolio value
              </Typography.Text>
              <Typography.Title level={2} style={{ color: 'white', margin: '8px 0 24px 0' }}>
                ${portfolioValue}
              </Typography.Title>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                height: '8px', 
                borderRadius: '4px',
                marginBottom: '16px'
              }}>
                <div style={{ 
                  width: '70%', 
                  height: '100%', 
                  background: '#55c27f',
                  borderRadius: '4px'
                }}></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Typography.Text style={{ color: '#55c27f' }}>
                    Profit: ${profit}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text style={{ color: '#ff6c6c' }}>
                    Loss: ${loss}
                  </Typography.Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Stock Cards */}
        <Row gutter={[16, 16]}>
          {stockData.map((stock, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card style={{ borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Typography.Text>Share Price</Typography.Text>
                  {stock.icon}
                </div>
                <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>
                  {stock.price} <span style={{ color: stock.trend === 'up' ? '#55c27f' : '#ff6c6c', fontSize: '14px' }}>{stock.change}</span>
                </Typography.Title>
                <div>
                  <Typography.Title level={5} style={{ margin: '0 0 4px 0' }}>{stock.name}</Typography.Title>
                  <Typography.Text type="secondary">{stock.symbol}</Typography.Text>
                </div>
                <div style={{ 
                  marginTop: '16px', 
                  height: '24px', 
                  background: 'rgba(0, 0, 0, 0.03)', 
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: '60%', 
                    background: stock.trend === 'up' ? 'linear-gradient(90deg, rgba(85, 194, 127, 0.2) 0%, rgba(85, 194, 127, 0) 100%)' : 'linear-gradient(90deg, rgba(255, 108, 108, 0.2) 0%, rgba(255, 108, 108, 0) 100%)',
                    borderRadius: '12px'
                  }}></div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Portfolio Performance and Dividend */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={16}>
            <Card title="Portfolio Performance" style={{ borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: '#aaa', 
                    marginRight: '8px' 
                  }}></span>
                  <span>2022</span>
                </div>
                <div>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: '#55c27f', 
                    marginRight: '8px' 
                  }}></span>
                  <span>2023</span>
                </div>
                <div>
                  <span>1D</span>
                </div>
                <div>
                  <span>7D</span>
                </div>
                <div>
                  <span>1M</span>
                </div>
                <div>
                  <span>3M</span>
                </div>
                <div>
                  <span>2023 Year</span>
                </div>
              </div>
              <div style={{ height: '200px', background: 'rgba(0, 0, 0, 0.03)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">Chart Placeholder</Typography.Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Dividend" extra={<a href="#">View all</a>} style={{ borderRadius: '12px' }}>
              <div style={{ height: '200px', background: 'rgba(0, 0, 0, 0.03)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">Dividend Chart Placeholder</Typography.Text>
              </div>
            }
            </Card>
          </Col>
        </Row>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginTop: '24px' }}>
          {Object.keys(labelMap).map((key) => (
            <StatCard
              key={key}
              label={labelMap[key]}
              percentage={parseFloat(returnData[key]?.toFixed(2) || 0)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;