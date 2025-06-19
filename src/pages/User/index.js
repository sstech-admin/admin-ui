/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Dropdown,
  Flex,
  Menu,
  message,
  Modal,
  Row,
  Segmented,
  Space,
  Table,
  Typography,
  Button,
  Input,
  Skeleton,
  Tag
} from "antd";
import {
  ClipboardEditIcon,
  EyeIcon,
  MoreHorizontal,
  Trash2,
  Search
} from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { Link, useLocation } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import { GetAllUsers } from "../../slices/Invester/investerAPI";
import { SyncOutlined, UserOutlined } from "@ant-design/icons";
import { BgcolorGreenBg } from "./Users.styles";
const Users = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const [data, setData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [loadingInvestors, setLoadingInvestors] = useState(false);
  const [valueSegmented, setValueSegmented] = useState("Approve");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [messageApiType, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  const { confirm } = Modal;
  
  const UserTypesMap = {
    1001: { label: "Owner", color: "#3f51b5" },        // Blue
    1004: { label: "Investor", color: "#4caf50" },     // Green
    1011: { label: "Administrator", color: "#ff9800" },// Orange
    1021: { label: "Employee", color: "#9c27b0" },     // Purple
  };
  
  const UserStatusMap = {
    1: { label: "Active", color: "#4caf50" },   // Green
    0: { label: "Inactive", color: "#f44336" }, // Red
  };


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };
    // Row selection settings
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        {
          key: "all-data",
          text: "Select All",
          onSelect: () => {
            setSelectedRowKeys(data.map((item) => item.transactionId)); // Select all rows
          },
        },
        {
          key: "clear",
          text: "Clear Selection",
          onSelect: () => {
            setSelectedRowKeys([]); // Clear selection
          },
        },
      ],
    };

  const tableDataFormat = [
    {
      title: "Username",
      dataIndex: "userName",
      width: "25%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>
            <div style={{ textAlign: "center" }}>{`${record?.userName ?? ""}`}</div>
          </>
        );
      },
    },
    {
      title: "Full Name",
      dataIndex: "userName",
      width: "25%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>
            <div style={{ textAlign: "center" }}>{`${record?.firstName ?? ""} ${
              record?.middleName ?? ""
            } ${record?.lastName ?? ""}`}</div>
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
      editable: true,
      align: "center",
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Phone No",
      dataIndex: "phoneNumber",
      width: "15%",
      editable: true,
      align: "center",
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: "User Type",
      dataIndex: "userTypeId",
      width: "15%",
      editable: true,
      align: "center",
      render: (value) => {
        const userType = UserTypesMap[value];
        return (
          <Tag color={userType?.color || "default"}>
            {userType?.label || "Unknown"}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "userStatusId",
      width: "15%",
      editable: true,
      align: "center",
      render: (value) => {
        const status = UserStatusMap[value];
        return (
          <Tag color={status?.color || "default"}>
            {status?.label || "Unknown"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      width: "30%",
      align: "center",
      render: (_, record) => (
        <Space>
          {/* View Button */}
          {/* <Link to={`/investors/${record.userId}`}>
            <Button type="text" icon={<EyeIcon size={18} color={customStyles.colorPrimary} />} />
          </Link> */}

          {/* Edit Button */}
          {/* <Link to={`/add-investors/${record.userId}`}>
            <Button type="text" icon={<ClipboardEditIcon size={18} color={customStyles.colorSecondary} />} />
          </Link> */}

          {/* Delete Button */}
          <Button
            type="text"
            danger
            icon={<Trash2 size={18} />}
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },

  ];


  const showDeleteConfirm = (Value, type) => {
    confirm({
      title:
        type === "delete"
          ? `Are you sure delete this User ${Value.userName}?`
          : `Are you sure you want to delete this User ${Value.userName} ?  `,
      // icon: <Icon />,
      content: "Press Yes for Permenat Delete",
      okText: "Yes",
      okType: `${type === "delete" ? "danger" : "primary"}`,
      cancelText: "No",
      cancleType: "danger",
      autoFocusButton() {
        console.log("autoFocusButton");
      },
      centered: true,
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: true,
      confirmLoading: true,
    });
  };


  const skeletonRows = Array.from({ length: 3 }).map((_, index) => {
    const skeletonRow = { key: `skeleton-${index}` };
  
    tableDataFormat.forEach((column) => {
      skeletonRow[column.dataIndex] = (
        <Skeleton.Input style={{ width: column.width || 100 }} active />
      );
    });
  
    return skeletonRow;
  });

  if (pathSegments.includes("approve")) {
    tableDataFormat.unshift({
      title: "Invetore ID",
      dataIndex: "userName",
      width: "10%",
      editable: true,
      align: "center",
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchInputValue]);

  const fetchData = async (limit, page) => {
    try {
      setLoadingInvestors(true);
      const response = await GetAllUsers({
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
        search: searchInputValue,
      });
      if (response.success === true) {
        setData(response.data.users);
        setPagination((pre) => ({
          ...pre,
          total: response?.data?.totalUsers,
          defaultPageSize: response?.data?.limit || 10,
          currentPage: response?.data?.currentPage,
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

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    console.log("pagination: ", pagination);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <>
      <div>{contextHolder}</div>

      <>
        <Typography.Title
          level={5}
          style={{ margin: `${customStyles.margin}px 0px` }}
        >
          Users
        </Typography.Title>

        <Row gutter={[24]}>
          <Col
            xs={24}
            className="gutter-row"
            style={{ marginBottom: customStyles.margin }}
          >
            <Card
              // title="Filter in Tree"
              style={{ marginBottom: customStyles.margin }}
            > 
              {loading ? (
                <div style={{ marginTop: 100 }}>
                  <Loader />
                </div>
              ) : (
                <div style={{ overflowX: "auto", overflowY: "auto" }}>
                  <Space
                    size={[24, 24]}
                    wrap
                    block={false}
                    style={{ marginBottom: 15 }}
                  >
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0px",
                      // width: 150,
                    }}
                  >
                    <Search
                      size={15}
                      style={{
                        color: customStyles.textMuted,
                        position: "absolute",
                        zIndex: "1",
                        marginLeft: "10px",
                        outline: "none",
                        boxShadow: "none",
                      }}
                    />
                    <Input
                      placeholder="Search..."
                      style={{
                        paddingLeft: "30px",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      id="search-user"
                      onChange={(e) => {
                        setSearchInputValue(e.target.value);
                      }}
                    />
                  </div>
                  </Space>
                  <Table
                    rowSelection={rowSelection}
                    data
                    loading={loadingInvestors}
                    columns={tableDataFormat}
                    dataSource={data}
                    responsive={true}
                    style={{ textAlign: "center" }}
                    // onChange={handleTableChange}
                    // pagination={tableParams.pagination}
                    align="center"
                    pagination={{
                      defaultPageSize: pagination?.defaultPageSize,
                      total: pagination?.total,
                      current: pagination?.currentPage,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                      showSizeChanger: true,
                      onChange: async (page, other) => {
                        await setPagination((pre) => ({
                          ...pre,
                          defaultPageSize: other,
                          currentPage: page,
                        }));
                        await fetchData(other, page);
                      },
                      pageSizeOptions: [10, 20, 50, 100],
                    }}
                  />
                </div>
              )}
            </Card>
          </Col>

          {/* <Col span={24} className="gutter-row">
            <Pagination
              showQuickJumper
              // onShowSizeChange={() => {}}
              onChange={onChange}
              defaultCurrent={3}
              total={500}
              responsive={true}
              // disabled
            />
          </Col> */}
        </Row>
      </>
    </>
  );
};

export default Users;
