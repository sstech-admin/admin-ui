import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Dropdown, Row, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import BrandLogo from "../assets/images/ainfinitylogo.png";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { themecolor } from "../config.js";
import { LogOut, Moon, Sun } from "lucide-react";

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

  @media screen and (max-width: 768px) {
    /* Apply the responsive style without considering RTL or LTR */
    left: 0;
    right: 0;
  }
`;

const HeaderContainer = styled.ul`
  font-size: 15px;
  padding-inline: 0;
  display: flex;
  gap: 10px;
  margin: 0;
  justify-content: end;

  .ant-avatar {
    background-color: transparent;
    transition: all 0.5s ease;
    &:hover {
      background-color: ${({ theme }) => theme.token.colorBorder};
    }
  }
`;

const StyleFlagDropdown = styled.div`
  min-width: 145px;

  ul {
    li {
      padding: 5px 0;
      a {
        transition: all 0.5s ease;
        &:hover {
          color: ${({ theme }) => theme.token.colorPrimary};
        }
      }
    }
  }
`;

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
  const [hovered, setHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: hovered ? '#ff4d4d' : '#f0f0f0',
    color: hovered ? '#fff' : '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    width: '40px',
    boxShadow: hovered ? '0 2px 5px rgba(0,0,0,0.2)' : '',
    height: '40px',
  };

  const textStyle = {
    position: 'absolute',
    right: '50px',
    whiteSpace: 'nowrap',
    backgroundColor: '#fff',
    color: '#ff4d4d',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    display: hovered ? 'block' : 'none',
    fontSize: '14px',
  };
  return (
    <React.Fragment>
      <StyleHeader id="antHeaderMain">
        <Row align="middle" gutter={[16, 24]}>
          {windowWidth < 768 && (
            <Col span={4} lg={1}>
              <img
                src={BrandLogo}
                height={24}
                style={{ display: "none" }}
                alt=""
              />
              <Button type="primary" onClick={handleToggleButton}>
                <MenuUnfoldOutlined />
              </Button>
            </Col>
          )}

          <Col span={6} lg={8} className="ant-ml-auto">
            <HeaderContainer className="ant-topbar-head list-unstyled">
              <li>
                <div
                  onClick={handleToggleMode}
                  style={{
                    marginTop: "26px",
                    display: "flex",
                    marginRight: "14px",
                    cursor: "pointer",
                  }}
                >
                  {darkMode === "dark" ? <Moon size={22} /> : <Sun size={22} />}
                </div>
              </li>
              <li>
                <Badge offset={[-3, 5]}>
                  <Link to="/logout">
                    <div
                        style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                      >
                        <div style={buttonStyle}>
                          <LogOut color={hovered ? '#fff' : '#000'} size={20} />
                        </div>
                        <span style={textStyle}>Logout</span>
                      </div>
                  </Link>
                </Badge>
              </li>
            </HeaderContainer>
          </Col>
        </Row>
      </StyleHeader>
    </React.Fragment>
  );
};

export default HeaderLayout;