import React, { useEffect, useState } from "react";
import withRouter from "../Common/withRouter";
import BrandLogo from "../assets/images/ainfinitylogo.png";
import BrandlightLogo from "../assets/images/ainfinitylogo.png";
import BrandSmLogo from "../assets/images/feviconDharma.png";
import { Menu, Button } from "antd";
import {
  ChevronLeft,
  ChevronRight,
  Combine,
  Database,
  GanttChartSquareIcon,
  Gauge,
  HistoryIcon,
  User2Icon,
  UserCircle2,
  BarChart2,
  DollarSign,
  TrendingUp,
  PieChart
} from "lucide-react";
import { themecolor } from "../config.js";
import {
  StyleSimpleBar,
  StyledCollapsedButton,
  StyleBrandLogo,
  StyleSider,
} from "../Common/SidebarStyle";
import { Link, useLocation } from "react-router-dom";
import { MenuUnfoldOutlined } from "@ant-design/icons";

const SidebarLayout = ({ theme }) => {
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const onPageClick = () => {
    const sidebarLayout1 = document.getElementById("sidebar-layout");
    if (sidebarLayout1) {
      if (windowWidth < 768) {
        sidebarLayout1.style.display = "none";
      }
    }
  };

  const items = [
    getItem(
      "",
      "",
      null,
      [
        getItem(
          <Link onClick={onPageClick} to="/dashboard">
            Dashboard
          </Link>,
          "dashboard",
          <Gauge size={16} />
        ),
        getItem(
          <Link onClick={onPageClick} to="/users">
            User
          </Link>,
          "users",
          <User2Icon size={16} />
        ),
        getItem("Investor", "Investor", <UserCircle2 size={16} />, [
          getItem(
            <Link onClick={onPageClick} to="/investors">
              Investors
            </Link>,
            "investors"
          ),
          getItem(
            <Link onClick={onPageClick} to="/investors-pending">
              Pending Requests
            </Link>,
            "investors-pending"
          ),
          getItem(
            <Link onClick={onPageClick} to="/add-investors">
              Add Investor
            </Link>,
            "add-investors"
          ),
          getItem(
            <Link onClick={onPageClick} to="/reference-investors">
              Referrals
            </Link>,
            "reference-investors"
          ),
        ]),
        getItem("Transaction", "Transaction", <Combine size={16} />, [
          getItem(
            <Link onClick={onPageClick} to="/profit-loss">
              Profit & Loss
            </Link>,
            "profit-loss"
          ),
          getItem(
            <Link onClick={onPageClick} to="/payouts">
              Payouts
            </Link>,
            "payouts"
          ),
          getItem(
            <Link onClick={onPageClick} to="/all-bulk-transaction">
              All Bulk Transaction
            </Link>,
            "all-bulk-transaction"
          ),
          getItem(
            <Link onClick={onPageClick} to="/transaction">
              Transactions
            </Link>,
            "transaction"
          ),
          getItem(
            <Link onClick={onPageClick} to="/pending-transaction">
              Pending Transaction
            </Link>,
            "pending-transaction"
          ),
          getItem(
            <Link onClick={onPageClick} to="/add-transaction">
              Add Transaction
            </Link>,
            "add-transaction"
          ),
          getItem(
            <Link onClick={onPageClick} to="/all-add-funds">
              List Add Funds
            </Link>,
            "all-add-funds"
          ),
          getItem(
            <Link onClick={onPageClick} to="/all-withdraws-funds">
              List Withdraw Funds
            </Link>,
            "all-withdraws"
          ),
        ]),
        getItem("Account", "Account", <Database size={16} />, [
          getItem(
            <Link onClick={onPageClick} to="/all-account">
              All Account
            </Link>,
            "all-account"
          ),
        ]),
        getItem(
          <Link onClick={onPageClick} to="/tally-export">
            Tally Export
          </Link>,
          "Tally Export",
          <GanttChartSquareIcon size={16} />
        ),
      ],
      "group"
    ),
  ];

  const [collapsed, setCollapsed] = useState(false);
  // const [isClick, setIsClick] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // setIsClick(true);
    updateWindowDimensions(); // Initialize windowWidth state
    window.addEventListener("resize", updateWindowDimensions);

    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  const updateWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    const antHeaderMain = document.getElementById("antHeaderMain");
    if (antHeaderMain) {
      antHeaderMain.style.left = !collapsed ? "100px" : "260px";
    }
    const antLayoutContent = document.getElementById("antLayoutContent");
    if (antLayoutContent) {
      antLayoutContent.style.marginLeft = !collapsed ? "100px" : "260px";
    }
    const antFooterLayout = document.getElementById("antFooterLayout");
    if (antFooterLayout) {
      antFooterLayout.style.marginLeft = !collapsed ? "100px" : "260px";
    }
  };

  const location = useLocation();
  const selectedKey = location.pathname.split("/")[1] || "dashboard";
  const [activatedItem, setActivatedItem] = useState(() => {
    const currentPath = location.pathname.replace("/", "");
    return currentPath || "dashboard";
  });
  const [openKeys, setOpenKeys] = useState([]);

useEffect(() => {
  // auto-expand based on path
  const pathSegments = location.pathname.split("/");
  if (pathSegments.length > 1) {
    const keyToOpen = items[0].children.find(group =>
      group.children?.some(child => location.pathname.includes(child.key))
    );
    if (keyToOpen) {
      setOpenKeys([keyToOpen.key]);
    }
  }
}, [location.pathname]);

  const toggleActivation = (key) => {
    setActivatedItem((prevActivatedItem) =>
      prevActivatedItem === key ? null : key
    );
  };

  const handleToggleButton = () => {
    // setIsClick((prevIsClick) => !prevIsClick); // Use the previous stateSD
    const sidebarLayout1 = document.getElementById("sidebar-layout");
    sidebarLayout1.style.display = "none"; //isClick ? "none" : "block";
  };

  return (
    <React.Fragment>
      <StyleSider
        id="sidebar-layout"
        width={themecolor.components.Menu.verticalSidebarWidth}
        collapsed={collapsed}
        collapsedWidth="100"
        breakpoint="lg"
      >
        <StyleBrandLogo className="demo-logo ant-mx-auto">
          <img
            alt="Brand logo"
            src={theme === "dark" ? BrandlightLogo : BrandLogo}
            height={25}
            style={{ lineHeight: "24px" }}
            className="brand-dark-logo ant-mx-auto"
          />
          <img
            alt="Brand sm logo"
            src={BrandSmLogo}
            height={24}
            style={{ lineHeight: "24px" }}
            className="brand-sm-logo ant-mx-auto"
          />
          <StyledCollapsedButton
            id="custom-mobile-menu-icon"
            themecolor={themecolor}
            type="link"
            onClick={toggleCollapsed}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </StyledCollapsedButton>
          <Button
            id="custom-desktop-menuunflod-icon"
            type="primary"
            onClick={handleToggleButton}
          >
            <MenuUnfoldOutlined />
          </Button>
        </StyleBrandLogo>
        <div>
          <StyleSimpleBar>
          <Menu
            selectedKeys={[selectedKey]}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            mode="inline"
            theme="light"
            items={items}
            collapsedWidth="100"
          />
          </StyleSimpleBar>
        </div>
      </StyleSider>
    </React.Fragment>
  );
};

export default withRouter(SidebarLayout);