import React, { useEffect, useState } from "react";
import { Avatar, Badge, Button, Col, Dropdown, Row, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import BrandLogo from "../assets/images/ainfinitylogo.png";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { themecolor } from "../config.js";
import { Bell, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react";

import feviconDharma from "../assets/images/feviconDharma.png";
import { MenuUnfoldOutlined } from "@ant-design/icons";

const StyleHeader = styled(Header)`
  padding-inline: 24px;
  position: fixed;
  left: ${({ theme }) =>
    theme.direction === "rtl"
      ? "0"
      : `${themecolor.components.Menu.verticalSidebarWidth}px`};
  right: ${({ theme }) =>
    theme.direction === "rtl"
      ? `${themecolor.components.Menu.verticalSidebarWidth}px`
      : "0"};
  top: 0;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.token.colorBorder};
  z-index: 999;
  background: ${({ theme }) => theme.token.colorBgContainer};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 64px;

  @media screen and (max-width: 768px) {
    left: 0;
    right: 0;
  }
`;

const HeaderContainer = styled.ul`
  font-size: 15px;
  padding-inline: 0;
  display: flex;
  gap: 16px;
  margin: 0;
  justify-content: end;
  align-items: center;

  .ant-avatar {
    background-color: transparent;
    transition: all 0.3s ease;
    &:hover {
      background-color: ${({ theme }) => theme.token.colorBorder};
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  
  .search-input {
    background-color: ${({ theme }) => theme.token.colorBgContainer};
    border-radius: 8px;
    padding-left: 40px;
    height: 40px;
    border: 1px solid ${({ theme }) => theme.token.colorBorder};
    
    &:hover, &:focus {
      border-color: ${({ theme }) => theme.token.colorPrimary};
      box-shadow: none;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.token.colorTextDescription};
    z-index: 1;
  }
`;

const profileMenu = [
  {
    key: '1',
    label: (
      <Link to="/user-profile">
        <Space>
          <User size={14} />
          <span>Profile</span>
        </Space>
      </Link>
    ),
  },
  {
    key: '2',
    label: (
      <Link to="/settings">
        <Space>
          <Settings size={14} />
          <span>Settings</span>
        </Space>
      </Link>
    ),
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: (
      <Link to="/logout">
        <Space>
          <LogOut size={14} />
          <span>Logout</span>
        </Space>
      </Link>
    ),
  },
];

const HeaderLayout = ({ darkMode, handleToggleMode }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);

    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  const updateWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleToggleButton = () => {
    const sidebarLayout = document.getElementById("sidebar-layout");
    sidebarLayout.style.display = "block";
  };

  useEffect(() => {
    const sidebarLayout = document.getElementById("sidebar-layout");
    const customDesktopMenuunflodIcon = document.getElementById(
      "custom-desktop-menuunflod-icon"
    );
    const customMobileMenuIcon = document.getElementById(
      "custom-mobile-menu-icon"
    );
    if (sidebarLayout) {
      if (windowWidth < 768) {
        sidebarLayout.style.display = "none";
        customMobileMenuIcon.style.display = "none";
      } else {
        sidebarLayout.style.display = "block";
        customDesktopMenuunflodIcon.style.display = "none";
      }
    }
  }, [windowWidth]);

  return (
    <React.Fragment>
      <StyleHeader id="antHeaderMain">
        <Row align="middle" gutter={[16, 24]} style={{ height: '100%' }}>
          {windowWidth < 768 && (
            <Col span={4} lg={1}>
              <img
                src={BrandLogo}
                height={24}
                style={{ display: "none" }}
                alt=""
              />
              <Button type="text" onClick={handleToggleButton}>
                <MenuUnfoldOutlined />
              </Button>
            </Col>
          )}

          <Col xs={12} sm={12} md={8} lg={8}>
            <SearchContainer>
              <Search size={16} className="search-icon" />
              <input 
                className="search-input" 
                placeholder="Search..." 
                style={{ width: '100%' }}
              />
            </SearchContainer>
          </Col>

          <Col xs={12} sm={12} md={16} lg={16}>
            <HeaderContainer className="ant-topbar-head list-unstyled">
              <li>
                <div
                  onClick={handleToggleMode}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: darkMode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"
                  }}
                >
                  {darkMode === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                </div>
              </li>
              <li>
                <Badge count={3} size="small">
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(0, 0, 0, 0.03)"
                    }}
                  >
                    <Bell size={18} />
                  </div>
                </Badge>
              </li>
              <li>
                <Dropdown menu={{ items: profileMenu }} placement="bottomRight" trigger={["click"]}>
                  <div style={{ cursor: "pointer" }}>
                    <Avatar 
                      size={40} 
                      src={feviconDharma}
                      style={{ 
                        backgroundColor: "#f0f9ff",
                        border: "2px solid #e2e8f0"
                      }}
                    />
                  </div>
                </Dropdown>
              </li>
            </HeaderContainer>
          </Col>
        </Row>
      </StyleHeader>
    </React.Fragment>
  );
};

export default HeaderLayout;