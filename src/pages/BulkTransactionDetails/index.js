/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
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
import {
  AlbumIcon,
  ArrowRightLeftIcon,
  BanknoteIcon,
  BookCheckIcon,
  Calendar,
  CalendarCheck,
  IndianRupee,
  IndianRupeeIcon,
  Mail,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import dayjs from "dayjs";
import Loader from "../../Component/Loader/Loader";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import {
  getBulkTransaction,
  getAllTransactionalBank,
  getAllBulkTransactionTransaction,
  exportBulkTransactionApi,
} from "../../slices/Invester/investerAPI";
import { useDebounce } from "../../helpers/useDebounce";
import { FlexBTN } from "./AllBulkTransaction.styles";  
import { DownOutlined, SyncOutlined, UserOutlined, FileExcelOutlined } from "@ant-design/icons";
import {
  deleteAllBulkTransactionTransaction,
  deleteTransaction,
  updateAllBulkTransactionTransactionStatus,
  updateTransactionStatus,
} from "../../slices/transaction/transactionAPI";
import { BgcolorGreenBg } from "../Investors/Inverstors.styles";
import { convertExcel } from "../../helpers/ConvertExcel";

const BulkTransactionDetails = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const params = useParams();
  const [data, setdataData] = useState();
  const [tableData, setTableData] = useState([]);
  const customStyles = usecustomStyles();
  const [fullPageLoading, setFullPageLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [valueSegmented, setValueSegmented] = useState("Approve");
  const [allGetAPIData, setAllGetAPIData] = useState({
    getallTransactinalBank: [],
  });
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  const [SelectedDropDownFilter, setSelectedDropDownFilter] = useState({
    accountFilter: { lable: "Account", value: -1 },
  });
  const inputData = useDebounce(searchInputValue, 500);
  const [messageApiType, contextHolder] = message.useMessage();
  const { confirm } = Modal;
  const TitleContainer = styled.div`
    font-weight: 700;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${customStyles.colorTextHeading};
  `;
  const fetchObject = async () => {
    try {
      setFullPageLoading(true);
      const response = await getBulkTransaction({
        bulkTransactionId: params.slug,
      });
      if (response.success === true) {
        setdataData(response.data);
      } else {
        setdataData(null);
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    } finally {
      setFullPageLoading(false);
    }
  };
  useEffect(() => {
    fetchObject();
  }, []);

  const fetchData = async (row, page) => {
    try {
      setLoading(true);
      const responseTableData = await getAllBulkTransactionTransaction({
        bulkTransactionId: params.slug,
        transactionStatusId: valueSegmented === "Approve" ? 1 : 0,
        page: page || pagination?.currentPage,
        limit: row || pagination?.defaultPageSize,
        // search: inputData,
      });
      console.log("responseTableData: ", responseTableData);
      if (responseTableData.success === true) {
        setTableData(responseTableData.data.results);
        setPagination((pre) => ({
          ...pre,
          total: parseInt(responseTableData?.data?.totalPages, 10),
          defaultPageSize: parseInt(responseTableData?.data?.limit, 10),
          currentPage: parseInt(responseTableData?.data?.page, 10),
        }));
      } else {
        setTableData([]);
      }

      const bankTransactionalDetails = await getAllTransactionalBank();

      setAllGetAPIData((pre) => ({
        ...pre,
        getallTransactinalBank: bankTransactionalDetails?.data,
      }));
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [valueSegmented, inputData, SelectedDropDownFilter]);

  // const onChange = async (pageData) => {
  //   console.log("pageData: ", pageData);
  //   await setPagination((pre) => ({
  //     ...pre,
  //     total: pageData?.total,
  //     defaultPageSize: pageData?.pageSize,
  //     currentPage: pageData?.current,
  //   }));
  //   await fetchData(pageData?.pageSize, pageData?.current);
  // };

  // // // //
  // // // // Table Data // // // //
  // // // //
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

      if (response.status === "success") {
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
              data?.transactionMode === "Payment In"
                ? customStyles.colorPrimary
                : customStyles.colorError,
          }}
        >
          {valueSegmented === "Approve"
            ? data?.transactionMode === "Payment In"
              ? "Unreceived"
              : "Unpaid"
            : data?.transactionMode === "Payment In"
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
  const columns = [
    // {
    //   title: "user Id",
    //   dataIndex: "userId",
    //   width: "15%",
    //   editable: true,
    //   align: "center",
    // },
    {
      title: "Investor",
      dataIndex: "investorName",
      width: "10%",
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
            <div>({`${record?.investorName ?? ""}`})</div>
          </>
        );
      },
    },
    {
      title: "Account", //  "Payment Out"
      dataIndex: "accountName",
      width: "15%",
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
    {
      title: "Transaction Mode",
      dataIndex: "transactionMode",
      width: "15%",
      editable: true,
      align: "center",
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      width: "15%",
      editable: true,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "transactionStatusId",
      width: "15%",
      align: "center",
      render: (_, record) => {
        let status = record.transactionStatusId;
        if (status === 0) {
          status = "Pending";
        } else if (status === 1) {
          status = "Approved";
        } else if (status === 2) {
          status = "Rejected";
        }
        let statusStyle = {};

        // Set style based on status
        if (status === "Pending") {
          statusStyle = {
            backgroundColor: "#FFC107",
            color: "#000",
            padding: "7px 10px",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "14px",
          };
        } else if (status === "Approved") {
          statusStyle = {
            backgroundColor: "#468e39",
            color: "white",
            padding: "7px 10px",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "14px",
          };
        } else if (status === "Rejected") {
          statusStyle = {
            backgroundColor: "#DC3545",
            color: "white",
            padding: "7px 10px",
            borderRadius: "50px",
            fontWeight: "bold",
            fontSize: "14px",
          };
        }

        return <span style={statusStyle}>{status}</span>;
      },
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
    // {
    //   title: "User Id",
    //   dataIndex: "userId",
    //   width: "15%",
    //   editable: true,
    //   align: "center",
    // },
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
          </Space>
        );
      },
    },
  ];

  /*
  "transationModeId === 2" means Payment Out then add Amount Colum in Table
  */
  if (data?.transactionModeId === 2) {
    const Amount = {
      title: "Amount",
      dataIndex: "amount",
      width: "15%",
      editable: true,
      align: "center",
    };

    columns.splice(3, 0, Amount);
  }

  const TextMuted = styled.div`
    color: ${customStyles.colorPrimary};
    font-weight: bold;
    font-size: 18px;
    padding: 2px 5px;
  `;
  const IconStyle = {
    marginRight: customStyles.marginXXS,
    verticalAlign: "middle",
  };

const UpdateAllTransactionStatus = async (transactionType) => {
  try {
    setLoading(true);

    if (transactionType === 'pending') {
      const response = await updateAllBulkTransactionTransactionStatus({
        bulkTransactionId: params?.slug,
        bulkTransactionStatusId: 3
      });

      if (response.success) {
        setValueSegmented('Approve')
        setLoading(true);
        await fetchObject();
        await messageApiType.open({
          type: "success",
          content: "All Transaction Updated Successfully.",
        });
        setLoading(false);
      } else {
        await messageApiType.open({
          type: "error",
          content: "Failed to update all transactions.",
        });
      }
    }

  } catch (error) {
    messageApiType.open({
      type: "error",
      content: error.message || "Something went wrong.",
    });
  } finally {
    setLoading(false);
  }
};
  
  
  const exportBulkTransactionData = async () => {
    try {
      setExportLoading(true);
      const exportResponse = await exportBulkTransactionApi({ bulkTransactionId: params?.slug });
      convertExcel(exportResponse?.data?.buffer?.data, exportResponse?.data?.filename)
      setExportLoading(false);
    } catch (error) {
      setExportLoading(false);
      console.error('EXCEL Export Failed:', error);
    }
  };


const showCompleteConfirm = (Value, type) => {
  confirm({
    title: `Are you sure you want to complete this transaction Id ${params?.slug} ?  `,
    // icon: <Icon />,
    content: "Press Yes for Complete Transaction",
    okText: "Yes",
    okType: "primary",
    cancelText: "No",
    cancleType: "danger",
    autoFocusButton() {
      console.log("autoFocusButton");
    },
    centered: true,
    onOk() {
      console.log("OK");
      UpdateAllTransactionStatus('pending');
    },
    onCancel() {
      console.log("Cancel");
    },
    okButtonProps: true,
    confirmLoading: true,
  });
};

  const DeleteAllTransaction = async () => {
    try {
      setLoading(true);
      const transactionObject = {
        transactionStatusId: valueSegmented === "Approve" ? 1 : 0,
        bulkTransactionId: data?.bulkTransactionId || params?.slug,
        page: pagination?.currentPage,
        limit: pagination?.defaultPageSize,
        search: inputData,
        accountFilter: SelectedDropDownFilter?.accountFilter?.value,
      };
      const response = await deleteAllBulkTransactionTransaction(
        transactionObject
      );
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
  const handleButtonClick = (e) => {
    e.preventDefault();
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
        valueSegmented === 'Approve' ? showDeleteConfirm() : showCompleteConfirm()
       },
    },
    // {
    //   label: "All Delete",
    //   key: "1",
    //   icon: <Trash2 size={12} />,
    //   danger: true,
    //   onClick: () => {
    //     DeleteAllTransaction();
    //   },
    // },
  ];

  const menuActionProps = {
    items: itemsAction2,
    // onClick: handleActionMenuClick,
  };
  return (
    <>
      <div>{contextHolder}</div>
      {fullPageLoading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
        <>
          <Typography.Title
            level={5}
            style={{ margin: `${customStyles.margin}px 0px`, display: 'flex', justifyContent: 'space-between' }}
          >
            <div>
              Bulk Transaction Details
            </div>
            <div>
            <Button
              onClick={exportBulkTransactionData}
              className="ml-5"
              disabled={!tableData.length || exportLoading}
              loading={exportLoading} // 🔄 Show loader when true
            >
              {
                exportLoading ? 'Loading...' : (
                  <p>
                  <FileExcelOutlined style={{  }} /> <span>Export</span>
                  </p>
                )
              }
            </Button>

        
            </div>
          </Typography.Title>
          <Row gutter={[24]}>
            <Col
              xs={24}
              className="gutter-row"
              style={{ marginBottom: customStyles.margin }}
            >
              <Card style={{ marginBottom: customStyles.margin }}>
                <Row gutter={[30, 15]}>
                  {!!data?.createdAt && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <Calendar style={IconStyle} size={18} />
                        Date
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.createdAt
                          ? dayjs(data?.createdAt).format("DD-MM-YYYY")
                          : "-"}
                      </TextMuted>
                    </Col>
                  )}
                  {!!data?.transactionType && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <BanknoteIcon style={IconStyle} size={18} />
                        Transaction Type
                      </TitleContainer>
                      <TextMuted
                        style={{
                          color:
                            data?.transactionType === "Payout"
                              ? customStyles.colorPrimary
                              : data?.transactionType === "Loss"
                              ? customStyles.colorError
                              : customStyles.colorPrimary,
                        }}
                      >
                        {!!data?.transactionType ? data?.transactionType : "-"}
                      </TextMuted>
                    </Col>
                  )}
                  {!!data?.paymentSystem && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <CalendarCheck style={IconStyle} size={18} />
                        Payment System
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.paymentSystem ? data?.paymentSystem : "-"}
                      </TextMuted>
                    </Col>
                  )}
                  {!!data?.bulkTransactionStatus && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <BookCheckIcon style={IconStyle} size={18} />
                        Bulk Transaction Status
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.bulkTransactionStatus
                          ? data?.bulkTransactionStatus
                          : "-"}
                      </TextMuted>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          </Row>

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
                <Row justify="space-between" align="top">
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
                          value: "Pending",
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
                    {data?.transactionType === 'Profit' ? null : (
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
                    ) } 
                  </FlexBTN>
                </Row>

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
                          ...allGetAPIData?.getallTransactinalBank?.map(
                            (item, index) => ({
                              label: item?.name,
                              key: `${index + 1}`,
                              onClick: () => {
                                setSelectedDropDownFilter((pre) => ({
                                  ...pre,
                                  accountFilter: {
                                    lable: item?.name,
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
                          {SelectedDropDownFilter.accountFilter.lable}
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Dropdown>
                    {/* </Col> */}
                    {/* <Col xs={12} sm={12} md={6} lg={6}> */}
                    {/* <Dropdown
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
                                    value: item?.transactionModeId,
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
                      <Button type="text" style={{ fontSize: "12px" }}>
                        <Space>
                          {SelectedDropDownFilter.transactionModeFilter.lable}
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Dropdown> */}
                    {/* </Col> */}
                    {/* <Col xs={12} sm={12} md={6} lg={6}> */}
                    {/* <Dropdown
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
                              label: item?.name,
                              key: `${index + 1}`,
                              onClick: () => {
                                setSelectedDropDownFilter((pre) => ({
                                  ...pre,
                                  transactionalBankFilter: {
                                    lable: item?.name,
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
                    </Dropdown> */}
                  </Space>
                </Row>
                {loading ? (
                  <div style={{ marginTop: 0, marginBottom: 150, padding: 50 }}>
                    <Loader />
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 32,
                      overflowX: "auto",
                      overflowY: "auto",
                    }}
                  >
                    <Table
                      columns={columns}
                      dataSource={tableData}
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
                        pageSizeOptions: [20, 50, 100, 500, 1000, 2000],
                      }}
                    />
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default BulkTransactionDetails;
