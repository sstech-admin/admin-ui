import React, { useState, useEffect } from 'react';
import StatCard from './StatCard.js';
import './Dashboard.css';

const labelMap = {
  oneMonthReturn: "1 Month",
  threeMonthReturn: "3 Months",
  sixMonthReturn: "6 Months",
  oneYearReturn: "1 Year",
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [returnData, setReturnData] = useState({});

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await fetch("https://gspkyxp4p6.ap-south-1.awsapprunner.com/v1/amount/calculateReturn");
        const result = await response.json();

        if (result.success && result.data) {
          setReturnData(result.data);
        } else {
          console.error("Failed to fetch return data");
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
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
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
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
