import React from 'react';
import './StatCard.css';

const StatCard = ({ label, percentage }) => {
  const isPositive = percentage >= 0;
  
  // Generate a realistic visitor count based on the percentage
  const generateVisitorData = (percentage) => {
    const baseValue = Math.floor(Math.random() * 50000) + 10000;
    const previousValue = Math.floor(baseValue / (1 + percentage / 100));
    const todayValue = Math.floor(Math.random() * 2000) + 500;
    
    return {
      current: baseValue.toLocaleString(),
      previous: previousValue.toLocaleString(),
      today: todayValue.toLocaleString()
    };
  };

  // Simple chart icon using SVG
  const ChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18"/>
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
    </svg>
  );

  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-header">
          <div className="stat-icon-label">
            <div className="stat-icon">
              <ChartIcon />
            </div>
            <span className="stat-label">{label} Returns</span>
          </div>
          {/* <div className="stat-menu">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div> */}
        </div>
        
        <div className="stat-main">
          <div className="stat-value-row">
            {/* <div className="stat-value">{percentage}%</div> */}
            <div className={`stat-percentage-badge ${isPositive ? 'positive' : 'negative'}`}>
              {/* {isPositive ? '+' : ''} */}
              {percentage}%
            </div>
          </div>
          <div className="stat-description">
            Data for the last {label}.
          </div>
        </div>
        
        <div className="stat-footer">
          <div className="stat-progress">
            <div className="progress-bar">
              <div 
                className={`progress-fill ${isPositive ? 'positive' : 'negative'}`}
                style={{ width: `${Math.min(Math.abs(percentage * 2), 100)}%` }}
              ></div>
            </div>
            {/* <button className='stat-percentage-badge'>More Info</button> */}
          </div>
        </div>
      </div>
      
      <div className="decorative-circle-1"></div>
      <div className="decorative-circle-2"></div>
    </div>
  );
};

export default StatCard;