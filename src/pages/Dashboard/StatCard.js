import React from 'react';
import './StatCard.css';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ label, percentage }) => {
  const isPositive = percentage >= 0;
  
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-header">
          <div className="stat-icon-label">
            <div className="stat-icon">
              <TrendingUp size={18} />
            </div>
            <span className="stat-label">{label} Returns</span>
          </div>
        </div>
        
        <div className="stat-main">
          <div className="stat-value-row">
            <div className={`stat-percentage-badge ${isPositive ? 'positive' : 'negative'}`}>
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
          </div>
        </div>
      </div>
      
      <div className="decorative-circle-1"></div>
      <div className="decorative-circle-2"></div>
    </div>
  );
};

export default StatCard;