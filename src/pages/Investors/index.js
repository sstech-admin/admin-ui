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
  Skeleton
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
import {
  deleteInvestor,
  GetAllInvestor,
  // updateInvestor,
} from "../../slices/Invester/investerAPI";
import { SyncOutlined, UserOutlined, SearchOutlined, CloseOutlined, DownOutlined  } from "@ant-design/icons";
import { BgcolorGreenBg } from "./Inverstors.styles";
const Investors = () => {
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
  const [paymentTypeId, setPaymentTypeId] = useState(null);
  const formatIndianNumber = (num) =>
    new Intl.NumberFormat("en-IN").format(num);
  const paymentTypeOptions = [
    { label: "Weekly", value: 7 },
    { label: "Monthly", value: 31 },
    { label: "None", value: 0 },
  ];
  const paymentTypeLabel =
  paymentTypeOptions.find((item) => item.value === paymentTypeId)?.label || "Payment Type";
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  const { confirm } = Modal;
  // const getActionUpdateInvestorStatus = async (dataofInvester) => {
  //   try {
  //     setLoading(true);
  //     const response = await updateInvestor({
  //       investorId: dataofInvester?.investorId,
  //       deletedOnly: true,
  //       userName: dataofInvester?.userName,
  //       email: dataofInvester?.email,
  //       phoneNumber: dataofInvester?.phoneNumber,
  //       firstName: dataofInvester?.firstName,
  //       middleName: dataofInvester?.middleName,
  //       lastName: dataofInvester?.lastName,
  //       referenceId: 1,
  //       investorTypeId: dataofInvester?.investorTypeId,
  //       paymentSystemId: dataofInvester?.paymentSystemId,
  //       asOfDate: dataofInvester?.asOfDate,
  //       amount: dataofInvester?.amount,
  //       toPayORToReceive: dataofInvester?.toPayORToReceive,
  //       openingBalance: dataofInvester?.openingBalance,
  //       panCardNumber: dataofInvester?.panCardNumber,
  //       aadharCardNumber: dataofInvester?.aadharCardNumber,
  //       investorStatusId: dataofInvester?.investorStatusId === 0 ? 1 : 0,
  //     });
  //     if (response?.status === "success") {
  //       await fetchData();
  //     }
  //   } catch (error) {
  //     messageApiType.open({
  //       type: "error",
  //       content: error,
  //     });
  //   }
  //   setLoading(false);
  // };

  const deletInvestor = async (item) => {
    console.log("item: ", item);
    try {
      setLoading(true);
      const response = await deleteInvestor({
        investorId: item?.investorId,
      });
      if (response?.success === true) {
        await fetchData();
        messageApiType.open({
          type: "success",
          content: "Investor deleted successfully.",
        });
      } else {
        messageApiType.open({
          type: "error",
          content: "Failed to delete Investor.",
        });
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error.message || "An unknown error occurred.",
      });
    }
    setLoading(false);
  };

  const showDeleteConfirm = (Value) => {
    confirm({
      title: `Are you sure delete this user ${Value.userName}?`,
      content: "Press Yes for Permenat Delete",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      cancleType: "danger",
      autoFocusButton() {
        console.log("autoFocusButton");
      },
      centered: true,
      onOk() {
        console.log("OK");
        deletInvestor(Value);
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: true,
      confirmLoading: true,
    });
  };

  const getMenuItems = (record) => [
    {
      label: (
        <Link
          to={`/investors/${record.investorId}`}
          style={{ color: customStyles.colorPrimary }}
        >
          View
        </Link>
      ),
      key: "0",
      icon: <EyeIcon size={14} color={customStyles.colorPrimary} />,
    },
    {
      label: (
        <Link
          to={`/add-investors/${record.investorId}`}
          color={customStyles.colorSecondary}
          style={{ color: customStyles.colorSecondary }}
        >
          Edit
        </Link>
      ),
      key: "1",
      icon: <ClipboardEditIcon size={14} color={customStyles.colorSecondary} />,
    },
    {
      label: (
        <Link
          to="#!"
          onClick={() => {
            showDeleteConfirm(record);
          }}
        >
          Delete
        </Link>
      ),
      key: "2",
      danger: true,
      icon: <Trash2 size={14} />,
    },
  ];
  const skeletonRows1 = Array.from({ length: 3 }).map((_, index) => ({
      key: `skeleton-${index}`,
      firstName: <Skeleton.Input style={{ width: 120 }} active />,
      investorTypeName: <Skeleton.Input style={{ width: 60 }} active />,
      paymentSystemName: <Skeleton.Input style={{ width: 50 }} active />,
      amount: <Skeleton.Input style={{ width: 100 }} active />,
      action: <Skeleton.Input style={{ width: 100 }} active />,
      remarks: <Skeleton.Input style={{ width: 100 }} active />,
    }));
    
  const tableDataFormat = [
    {
      title: "Name",
      dataIndex: "name",
      width: "25%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>
            <div style={{ textAlign: "center" }}>{`${record?.name ?? ""}`}</div>
          </>
        );
      },
    },
    {
      title: "Username",
      dataIndex: "userName",
      width: "15%",
      editable: true,
      align: "center",
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Payment System",
      dataIndex: "paymentSystemName",
      width: "15%",
      editable: true,
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "20%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 10,
                color: `${record?.amountColour}`,
                fontWeight: "bold",
              }}
            >
              {record?.amountText ? `${record?.amountText}` : ""}
            </div>
            <div>
              <div
                style={{
                  color: `${record?.amountColour}`,
                  fontWeight: "bold",
                  paddingRight: 8,
                }}
              >
                {record?.amount ? formatIndianNumber(record?.amount + (record?.profitOrLossAmount || 0)) : 0}
              </div>
            </div>
          </div>
        );
      },
      // sorter: (a, b) => a.age - b.age,
    },
  {
    title: "Action",
    dataIndex: "Action",
    width: "30%",
    align: "center",
    render: (_, record) => (
      <Space>
        {/* View Button */}
        <Link to={`/investors/${record.investorId}`}>
          <Button type="text" icon={<EyeIcon size={18} color={customStyles.colorPrimary} />} />
        </Link>

        {/* Edit Button */}
        <Link to={`/add-investors/${record.investorId}`}>
          <Button type="text" icon={<ClipboardEditIcon size={18} color={customStyles.colorSecondary} />} />
        </Link>

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

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    fetchData();
  }, [searchInputValue, paymentTypeId]);

  const fetchData = async (limit, page) => {
    try {
      setLoadingInvestors(true);
      const payload = {
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
        search: searchInputValue,
        investorStatusId: 1,
      };
      
      if (paymentTypeId) {
        payload.paymentSystemId = paymentTypeId;
      }
      
      const response = await GetAllInvestor(payload);
      console.log("response: ", response);
      if (response.success === true) {
        setData(response.data.results);
        setPagination((pre) => ({
          ...pre,
          total: response.data.totalResults,
          defaultPageSize: response.data.limit,
          currentPage: response.data.page,
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

  // Search 
  const handleSearch = () => {
    console.log("Searching for:", searchInputValue);
    // Call your API here
    fetchData();

  };

  const handleClear = () => {
    setSearchInputValue("");
    console.log("Clear Search for:", searchInputValue);
  };
  return (
    <>
      <div>{contextHolder}</div>

      <>
        <Typography.Title
          level={5}
          style={{ margin: `${customStyles.margin}px 0px` }}
        >
          Investors
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
              {/* <Flex
                gap="small"
                align="flex-start"
                vertical
                style={{ backgroundColor: "white", marginBottom: 20 }}
              >
                <Segmented
                  options={[
                    {
                      label: (
                        <div
                          style={{
                            padding: 4,
                            color: customStyles.colorPrimary,
                          }}
                        >
                          <UserOutlined
                            style={{
                              fontSize: 14,
                              color: customStyles.colorPrimary,
                            }}
                          />{" "}
                          <span>Active</span>
                        </div>
                      ),
                      value: "Approve",
                    },
                    {
                      label: (
                        <div
                          style={{
                            padding: 4,
                            color: customStyles.colorSecondary,
                          }}
                        >
                          <SyncOutlined style={{ fontSize: 14 }} />
                          {"  "}
                          <span>Pending</span>
                        </div>
                      ),
                      value: "Pendding",
                    },
                  ]}
                  value={valueSegmented}
                  onChange={(value) => {
                    console.log(value);
                    setValueSegmented(value); // string
                  }}
                />
              </Flex> */}
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Input
                      placeholder="Search..."
                      value={searchInputValue}
                      prefix={<SearchOutlined style={{ color: "#aaa" }} />}
                      onChange={(e) => setSearchInputValue(e.target.value)}
                      style={{ width: 250 }}
                      
                    />
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={handleSearch}
                      disabled={!searchInputValue} // disable if input is empty
                    >
                      Search
                    </Button>
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      onClick={()=>{setSearchInputValue(""); handleClear()}}
                      disabled={!searchInputValue}
                    >
                      Clear
                    </Button>

                    <Row gutter={[24, 24]} style={{marginTop: 0}}>
                      <Space
                        size={[24, 24]}
                        wrap
                        block={false}
                        style={{ marginLeft: 15 }}
                      >
                        {/* <Flex
                        horizontal
                        // gap="small"
                        // align="flex-start"
                        wrap="wrap"
                        flex
                        style={{ backgroundColor: "white", marginBottom: 30 }}
                      > */}

                        {/* <Col xs={12} sm={12} md={6} lg={6}> */}
                        <Dropdown
                        style={{ borderWidth: 1, borderColor: "#e4e4e4" }}
                        menu={{
                          items: [
                            {
                              label: "Payment Type",
                              key: "payment-type-all",
                              onClick: () => {
                                setPaymentTypeId(null);
                              },
                            },
                            ...paymentTypeOptions.map((item) => ({
                              label: item.label,
                              key: `mode-${item.value}`,
                              onClick: () => {
                                setPaymentTypeId(item.value);
                              },
                            })),
                            {
                              type: "divider",
                            },
                          ],
                          selectable: true,
                          defaultSelectedKeys: ["payment-type-all"],
                        }}
                        trigger={["click"]}
                      >
                        <Button
                          type="text"
                          style={{
                            fontSize: "12px",
                            borderWidth: 1,
                            borderColor: "#e4e4e4",
                          }}
                        >
                          <Space>
                            {paymentTypeLabel ||
                              "Select payment type"}
                            <DownOutlined />
                          </Space>
                        </Button>
                      </Dropdown>
                      </Space>
                    </Row>
                  </div>
                  </Space>
                  <Table
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

export default Investors;
