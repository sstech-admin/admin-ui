/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Flex,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Segmented,
  Space,
  Table,
  Typography,
} from "antd";
import { IndianRupeeIcon, MoreHorizontal, Search, Trash2 } from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import Loader from "../../Component/Loader/Loader";
import {
  deleteAllTransaction,
  deleteTransaction,
  getAllTransaction,
  updateAllTransactionStatus,
  updateTransactionStatus,
} from "../../slices/transaction/transactionAPI";
import dayjs from "dayjs";
import { DownOutlined, SyncOutlined, UserOutlined } from "@ant-design/icons";
import { getAllTransactionalBank } from "../../slices/Invester/investerAPI";
import axios from "axios";
import { ColBTN, FlexBTN } from "./AllTransaction.styles";
import { useDebounce } from "../../helpers/useDebounce";
import { BgcolorGreenBg } from "../Investors/Inverstors.styles";
import { Link } from "react-router-dom";
import {
  getAllAccount,
  getAllTransactionMode,
} from "../../slices/generalSetting/generalSettingAPI";
// import { borderColor, fontFace } from "polished";

const AllPendingTransaction = () => {
  document.title = "All Transaction" + process.env.REACT_APP_PAGE_TITLE;

  const [data, setData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [valueSegmented, setValueSegmented] = useState("Approve");
  const [messageApiType, contextHolder] = message.useMessage();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [allGetAPIData, setAllGetAPIData] = useState({
    getAllAccount: [],
    getAllTransactionMode: [],
    getallTransactinalBank: [],
  });
  const [SelectedDropDownFilter, setSelectedDropDownFilter] = useState({
    accountFilter: { lable: "Account", value: -1 },
    transactionModeFilter: { lable: "Transaction Mode", value: -1 },
    transactionalBankFilter: { lable: "Transactional Bank", value: -1 },
    dateYYYYMMddFilter: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  const [allBankTransactionalDetailsm, setAllBankTransactionalDetails] =
    useState([]);
  const inputData = useDebounce(searchInputValue, 500);

  const { confirm } = Modal;
  const fetchData = async (limit, page) => {
    try {
      setLoading(true);
      const response = await getAllTransaction({
        transactionStatusId: 0,
        page: page || pagination?.currentPage,
        limit: limit || pagination?.defaultPageSize,
        search: inputData,
        transactionModeFilter:
          SelectedDropDownFilter?.transactionModeFilter?.value,
        transactionalBankFilter:
          SelectedDropDownFilter?.transactionalBankFilter?.value > 0 ? SelectedDropDownFilter?.transactionalBankFilter?.value : ''  ,
        dateYYYYMMddFilter: SelectedDropDownFilter?.dateYYYYMMddFilter,
      });

      const bankTransactionalDetails = await getAllTransactionalBank();
      const accountResponse = await getAllAccount({});
      const allTransactionModeResponse = await getAllTransactionMode({});
      if (response?.data) {
        setPagination((pre) => ({
          ...pre,
          total: response?.data?.totalResults,
          defaultPageSize: response?.data?.limit,
          currentPage: response?.data?.page,
        }));
      }
      setAllGetAPIData((pre) => ({
        ...pre,
        getAllAccount: accountResponse?.data,
        getAllTransactionMode: allTransactionModeResponse?.data,
        getallTransactinalBank: bankTransactionalDetails?.data,
      }));
      setAllBankTransactionalDetails(bankTransactionalDetails.data);
      if (response.success === true) {
        setData(response.data.results);
      } else {
        setData([]);
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    }
    setLoading(false);
  };
  const DeleteOrUpdateTransactionData = async (Data, type) => {
    try {
      setLoading(true);
      const transactionObject = {
        transactionId: Data?.transactionId,
      };
      const response = await deleteTransaction(transactionObject);

      if (response.success === true) {
        await fetchData();
        await messageApiType.open({
          type: "success",
          content: `Transaction(${Data?.transactionId}) Deleted Successfully`,
        });
      } else {
        await messageApiType.open({
          type: "error",
          content: `Failed to delete transaction (${Data?.transactionId})`,
        });
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    } finally {
      setLoading(false);
    }
  };
  const UpdateSingleTransaction = async (Data) => {
    try {
      setLoading(true);
      const transactionObject = {
        transactionId: Data?.transactionId,
        transactionStatusId: valueSegmented === "Approve" ? 0 : 1,
      };
      const response = await updateTransactionStatus(transactionObject);

      if (response.success === true) {
        await fetchData();
        await messageApiType.open({
          type: "success",
          content: `Transaction(${Data?.transactionId}) Updated Successfully`,
        });
      } else {
        messageApiType.open({
          type: "error",
          content: `Failed to update transaction (${Data?.transactionId})`,
        });
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    } finally {
      setLoading(false);
    }
  };
  const UpdateAllTransaction = async () => {
    try {
      setLoading(true);
      const transactionObject = {
        transactionStatusIdForUpdate: valueSegmented === "Approve" ? 0 : 1,
        getAllTransactionRequest: {
          transactionStatusId: valueSegmented === "Approve" ? 1 : 0,
          page: pagination?.currentPage,
          limit: pagination?.defaultPageSize,
          search: inputData,
          accountFilter: SelectedDropDownFilter?.accountFilter?.value,
          transactionModeFilter:
            SelectedDropDownFilter?.transactionModeFilter?.value,
          transactionalBankFilter:
            SelectedDropDownFilter?.transactionalBankFilter?.value,
          dateYYYYMMddFilter: SelectedDropDownFilter?.dateYYYYMMddFilter,
        },
      };
      const response = await updateAllTransactionStatus(transactionObject);

      if (response.status === "success") {
        await fetchData();
        await messageApiType.open({
          type: "success",
          content: "All Transaction Updated SuccesFully.",
        });
      } else {
        await messageApiType.open({
          type: "error",
          content: `Failed to All Transaction Update.`,
        });
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    } finally {
      setLoading(false);
    }
  };
  const DeleteAllTransaction = async () => {
    try {
      setLoading(true);
      const transactionObject = {
        transactionStatusId: valueSegmented === "Approve" ? 1 : 0,
        page: pagination?.currentPage,
        limit: pagination?.defaultPageSize,
        search: inputData,
        accountFilter: SelectedDropDownFilter?.accountFilter?.value,
        transactionModeFilter:
          SelectedDropDownFilter?.transactionModeFilter?.value,
        transactionalBankFilter:
          SelectedDropDownFilter?.transactionalBankFilter?.value,
        dateYYYYMMddFilter: SelectedDropDownFilter?.dateYYYYMMddFilter,
      };
      const response = await deleteAllTransaction(transactionObject);
      if (response.status === "success") {
        await fetchData();
        await messageApiType.open({
          type: "success",
          content: "All Transaction Delete Successfully.",
        });
      } else {
        await messageApiType.open({
          type: "error",
          content: `Failed to All delete transaction.`,
        });
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    } finally {
      setLoading(false);
    }
  };
  const showDeleteConfirm = (Value, type) => {
    confirm({
      title:
        type === "delete"
          ? `Are you sure delete this transaction Id ${Value.transactionId}?`
          : `Are you sure you want to complete this transaction Id ${Value.transactionId} ?  `,
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
        DeleteOrUpdateTransactionData(Value, type);
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
          to="#!"
          onClick={() => {
            UpdateSingleTransaction(record);
            // showDeleteConfirm(record); // heare TODO: add logic to recived and Export that.
            console.log("record", record);
          }}
          style={{
            color:
              record?.transactionMode === "Payment In"
                ? customStyles.colorPrimary
                : customStyles.colorError,
          }}
        >
          {valueSegmented === "Approve"
            ? record?.transactionMode === "Payment In"
              ? "Unreceived"
              : "Unpaid"
            : record?.transactionMode === "Payment In"
            ? "Received"
            : "Paid"}
        </Link>
      ),
      key: "0",
      icon: (
        <IndianRupeeIcon
          size={14}
          color={
            record?.transactionMode === "Payment In"
              ? customStyles.colorPrimary
              : customStyles.colorError
          }
        />
      ),
    },
    {
      label: (
        <Link
          to="#!"
          onClick={() => {
            showDeleteConfirm(record, "delete");
          }}
        >
          Delete
        </Link>
      ),
      key: "1",
      danger: true,
      icon: <Trash2 size={14} />,
    },
  ];

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

  const columns = [
    {
      title: "Investor",
      dataIndex: "investorName",
      width: "15%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>
            <div>
              {`${record?.investorFirstName ?? ""} ${
                record?.investorMiddleName ?? ""
              } ${record?.investorLastName ?? ""}`}
            </div>
            <div>{`(${record?.investorName}) `}</div>
          </>
        );
      },
    },
    {
      title: "Account",
      dataIndex: "accountName",
      width: "10%",
      editable: true,
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "15%",
      editable: true,
      align: "center",
    },
    // {
    //   title: "Transaction Mode (Dharma)",
    //   dataIndex: "transactionMode",
    //   width: "15%",
    //   editable: true,
    //   align: "center",
    // },
    {
      title: "Transaction Mode",
      dataIndex: "transactionMode",
      width: "15%",
      editable: true,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      width: "15%",
      align: "center",
      editable: true,
      render: (_, record) => {
        return <>{dayjs(record?.dateTime).format("DD MMM YYYY")}</>;
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return (
          <Space size={12}>
            <Dropdown
              overlay={<Menu items={getMenuItems(record)} />}
              trigger={["click"]}
            >
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Space>
                  <BgcolorGreenBg
                    style={{
                      height: "30px",
                      width: "30px",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MoreHorizontal
                      style={{
                        color: customStyles.colorSecondary,
                        padding: "8px",
                      }}
                    />
                  </BgcolorGreenBg>
                </Space>
              </a>
            </Dropdown>
            {/* <Trash2
              onClick={() => {
                showDeleteConfirm(record, "delete");
              }}
              className="hovered-icon"
              color={customStyles.colorDanger}
            /> */}
            {/* {valueSegmented !== "Approve" && (
              <ConfigProvider
                style={{ margin: `500px 0px` }}
                theme={{
                  components: {
                    Button: {
                      colorPrimary: `linear-gradient(116deg, ${
                        record?.transactionMode === "Payment Out"
                          ? getHoverColors(colors4Red).join(", ")
                          : getHoverColors(colors3).join(", ")
                      })`,
                      colorPrimaryHover: `linear-gradient(116deg, ${
                        record?.transactionMode === "Payment Out"
                          ? getHoverColors(colors4RedHover).join(", ")
                          : getHoverColors(colors3).join(", ")
                      })`,
                      colorPrimaryActive: `linear-gradient(116deg, ${
                        record?.transactionMode === "Payment Out"
                          ? getHoverColors(colors4RedHover).join(", ")
                          : getHoverColors(colors3).join(", ")
                      })`,
                      lineWidth: 0,
                    },
                  },
                }}
              >
                <Button
                  style={{
                    margin: `${customStyles.margin - 10}px 0px`,
                  }}
                  type="primary"
                  size="medium"
                  width="100"
                  onClick={() => {
                    console.log("BTN Click");
                    showDeleteConfirm(record);
                  }}
                >
                  {record?.transactionMode === "Payment In"
                    ? "Received"
                    : "Paid"}
                </Button>
              </ConfigProvider>
            )} */}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, [valueSegmented, inputData, SelectedDropDownFilter]);

  const handleButtonClick = (e) => {
    e.preventDefault();
  };

  function formatDate(date, format) {
    const padZero = (num) => (num < 10 ? "0" + num : num);
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1); // Months are zero-indexed
    const year = date.getFullYear();

    if (format === "DDMMYYYY") {
      return `${day}${month}${year}`;
    } else if (format === "YYYYMMDD") {
      return `${year}${month}${day}`;
    }
    return "";
  }

  const handleMenuClick = async (e) => {
    const transactionalBankId = allBankTransactionalDetailsm.filter(
      (item) => item.transactionalBankId === +e.key
    )?.[0]?.transactionalBankId;
    const UpdatedFileName =
      transactionalBankId === 1
        ? `HDFC_${formatDate(new Date(), "DDMMYYYY")}.xls`
        : `BLKPAY_${formatDate(new Date(), "YYYYMMDD")}.xlsx`;

    axios
      .post(
        "/exportPendingTransaction",
        { transactionalBankId: +e.key },
        {
          responseType: "blob",
          "Content-Type": "application/octet-stream",
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", UpdatedFileName); // or any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      });

    // try {
    //   const response = await axios.post(
    //     "/exportPendingTransaction",
    //     { transactionalBankId: +e.key },
    //     { responseType: "blob" }
    //   );

    //   // Extract the filename from the Content-Disposition header
    //   const contentDisposition = response.headers["content-disposition"];
    //   const filename = contentDisposition.match(/filename="(.+)"/)[1];

    //   // Create a blob from the response data
    //   const blob = new Blob([response.data], {
    //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   });

    //   // Create a link element
    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = filename;

    //   // Append the link to the body
    //   document.body.appendChild(link);

    //   // Programmatically click the link to trigger the download
    //   link.click();

    //   // Clean up by removing the link element
    //   document.body.removeChild(link);
    // } catch (error) {
    //   console.error("Error downloading the file", error);
    // }
  };

  const itemsAction2 = [
    {
      label: (
        <Link
          to="#!"
          style={{
            color:
              valueSegmented === "Approve"
                ? customStyles.colorSecondary
                : customStyles.colorPrimary,
          }}
        >
          {valueSegmented === "Approve" ? "All Pending" : "All Complete"}
        </Link>
      ),
      key: "0",
      icon: (
        <IndianRupeeIcon
          size={12}
          color={
            valueSegmented === "Approve"
              ? customStyles.colorSecondary
              : customStyles.colorPrimary
          }
        />
      ),
      onClick: () => {
        UpdateAllTransaction();
      },
    },
    {
      label: "All Delete",
      key: "1",
      icon: <Trash2 size={12} />,
      danger: true,
      onClick: () => {
        DeleteAllTransaction();
      },
    },
  ];

  const items2 = allBankTransactionalDetailsm?.map((item, index) => {
    return {
      label: `${item?.label} Pending Transaction`,
      key: item?.id,
      fileName: item?.label,
      transactionalBankId: item?.id,
    };
  });

  const menuProps = {
    items: items2,
    onClick: handleMenuClick,
  };

  const menuActionProps = {
    items: itemsAction2,
    // onClick: handleActionMenuClick,
  };

  return (
    <>
      <div>{contextHolder}</div>
      <>
        <Row gutter={[24]} justify="space-between">
          <Col xs={24} md={6}>
            <Typography.Title
              level={5}
              style={{ margin: `${customStyles.margin}px 0px` }}
            >
              Pending Transactions
            </Typography.Title>
          </Col>
          <ColBTN xs={24} md={6}>
            {/* <FlexBTN>
              <Dropdown.Button
                menu={menuProps}
                onClick={handleButtonClick}
                style={{
                  margin: `${customStyles.margin}px 0px`,
                  borderWidth: 2,
                  borderColor: "#156",
                }}
              >
                Export
              </Dropdown.Button>
            </FlexBTN> */}
          </ColBTN>
        </Row>
        <Row gutter={[24]}>
          <Col
            xs={24}
            className="gutter-row"
            style={{ marginBottom: customStyles.margin }}
          >
            <Card style={{ marginBottom: customStyles.margin }}>
              {/* <Row justify="space-between" align="top">
                <Flex
                  // gap="small"
                  // align="flex-start"
                  vertical
                  style={{ backgroundColor: "white", marginBottom: 30 }}
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
                            <span>Completed</span>
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
                </Flex>
                <FlexBTN
                  align="flex-start"
                  style={{ backgroundColor: "white", marginBottom: 30 }}
                >
                  <Dropdown.Button
                    menu={menuActionProps}
                    onClick={handleButtonClick}
                    style={{
                      margin: `0px 0px`,
                      borderWidth: 2,
                      borderColor: "#156",
                    }}
                  >
                    Actions
                  </Dropdown.Button>
                </FlexBTN>
              </Row> */}
              <Row gutter={[24, 24]}>
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
                  {/* </Col> */}

                  {/* <Col xs={12} sm={12} md={6} lg={6}> */}
                  <Dropdown
                    style={{ borderWidth: 1, borderColor: "#e4e4e4" }}
                    menu={{
                      items: [
                        {
                          label: "Account",
                          key: "0",
                          onClick: () => {
                            setSelectedDropDownFilter((pre) => ({
                              ...pre,
                              accountFilter: { lable: "Account", value: -1 },
                            }));
                          },
                        },
                        {
                          type: "divider",
                        },
                        ...allGetAPIData?.getAllAccount?.map((item, index) => ({
                          label: item?.name,
                          key: `${index + 1}`,
                          onClick: () => {
                            setSelectedDropDownFilter((pre) => ({
                              ...pre,
                              accountFilter: {
                                lable: item?.name,
                                value: item?.accountId,
                              },
                            }));
                          },
                        })),
                      ],
                      selectable: true,
                      defaultSelectedKeys: "0",
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
                        {SelectedDropDownFilter.accountFilter.lable}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                  {/* </Col> */}
                  {/* <Col xs={12} sm={12} md={6} lg={6}> */}
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: "Transaction Mode",
                          key: "0",
                          onClick: () => {
                            setSelectedDropDownFilter((pre) => ({
                              ...pre,
                              transactionModeFilter: {
                                lable: "Transaction Mode",
                                value: -1,
                              },
                            }));
                          },
                        },
                        {
                          type: "divider",
                        },
                        ...allGetAPIData?.getAllTransactionMode?.map(
                          (item, index) => ({
                            label: item?.name,
                            key: `${index + 1}`,
                            onClick: () => {
                              setSelectedDropDownFilter((pre) => ({
                                ...pre,
                                transactionModeFilter: {
                                  lable: item?.name,
                                  value: item?.id,
                                },
                              }));
                            },
                          })
                        ),
                      ],
                      selectable: true,
                      defaultSelectedKeys: "0",
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
                        {SelectedDropDownFilter.transactionModeFilter.lable}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                  {/* </Col> */}
                  {/* <Col xs={12} sm={12} md={6} lg={6}> */}
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: "Transactional Bank",
                          key: "0",
                          onClick: () => {
                            setSelectedDropDownFilter((pre) => ({
                              ...pre,
                              transactionalBankFilter: {
                                lable: "Transactional Bank",
                                value: -1,
                              },
                            }));
                          },
                        },
                        {
                          type: "divider",
                        },
                        ...allGetAPIData?.getallTransactinalBank?.map(
                          (item, index) => ({
                            label: item?.label,
                            key: `${index + 1}`,
                            onClick: () => {
                              setSelectedDropDownFilter((pre) => ({
                                ...pre,
                                transactionalBankFilter: {
                                  lable: item?.label,
                                  value: item?.transactionalBankId,
                                },
                              }));
                            },
                          })
                        ),
                      ],
                      selectable: true,
                      defaultSelectedKeys: "0",
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
                        {SelectedDropDownFilter.transactionalBankFilter.lable}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                  {/* </Col> */}
                  {/* <Col xs={12} sm={12} md={6} lg={6}> */}
                  <DatePicker
                    name="asOfDate"
                    placeholder="DD MMM YYYY"
                    placement="topLeft"
                    style={{
                      boxShadow: "none",
                      outline: "none",
                      width: "100%",
                    }}
                    // defaultValue={dayjs().format("DD-MM-YY")}
                    format="DD MMM YYYY"
                    onChange={(e) => {
                      setSelectedDropDownFilter((pre) => ({
                        ...pre,
                        dateYYYYMMddFilter: e
                          ? dayjs(e).format("YYYY-MM-DD")
                          : "",
                      }));
                    }}
                  />
                  {/* </Col> */}
                  {/* </Flex> */}
                </Space>
              </Row>
              <Space size={64} />
              {loading ? (
                <div style={{ marginTop: 100 }}>
                  <Loader />
                </div>
              ) : (
                <div style={{ overflowX: "auto", overflowY: "auto" }}>
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    style={{ marginTop: 32 }}
                    dataSource={data}
                    // onChange={onChange}
                    responsive={true}
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
        </Row>
      </>
    </>
  );
};

export default AllPendingTransaction;
