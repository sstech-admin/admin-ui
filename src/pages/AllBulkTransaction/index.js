/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Col, message, Row, Space, Table, Typography, Dropdown, Button } from "antd";
import { EyeIcon } from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { Link } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import { getAllBulkTransaction } from "../../slices/transaction/transactionAPI";
import dayjs from "dayjs";
import { getAllTransactionMode } from "../../slices/generalSetting/generalSettingAPI";
import { DownOutlined } from "@ant-design/icons";

const AllBulkTransaction = () => {
  document.title = "Bulk Transactions" + process.env.REACT_APP_PAGE_TITLE;

  const [data, setData] = useState([]);
  const [transactionModeLists, setTransactionModeLists] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });

  const [SelectedDropDownFilter, setSelectedDropDownFilter] = useState({
    transactionModeFilter: { lable: "Transaction Mode", value: null },
  });
    const [transactionTypeId, setTransactionModeId] = useState(null);
    const [paymentTypeId, setPaymentTypeId] = useState(null);
  
    const paymentTypeOptions = [
      { label: "Weekly", value: 7 },
      { label: "Monthly", value: 31 },
      { label: "None", value: 0 },
    ];
    const paymentTypeLabel =
    paymentTypeOptions.find((item) => item.value === paymentTypeId)?.label || "Payment Type";
  const [messageApiType, contextHolder] = message.useMessage();
  const onChange = (pageNumber) => {
    console.log("onChange Page: ", pageNumber);
  };

  const columns = [
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      width: "15%",
      editable: true,
      align: "center",
    },
    {
      title: "Payment System",
      dataIndex: "paymentSystem",
      width: "15%",
      editable: true,
      align: "center",
      // sorter: (a, b) => a.age - b.age,
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      width: "15%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return record?.createdAt
          ? dayjs(record.createdAt).format("DD MMM YYYY")
          : "";
      },
    },
    {
      title: "Status",
      dataIndex: "bulkTransactionStatus",
      width: "15%",
      editable: true,
      align: "center",
      render: (_, record) => {
        let status = record.bulkTransactionStatus;
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
        } else if (status === "Completed") {
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

    // {
    //   title: "Account",
    //   dataIndex: "accountName",
    //   width: "15%",
    //   editable: true,
    //   align: "center",
    // },
    // {
    //   title: "Amount",
    //   dataIndex: "amount",
    //   width: "15%",
    //   editable: true,
    //   align: "center",
    // },
    // {
    //   title: "Date",
    //   dataIndex: "dateTime",
    //   width: "15%",
    //   editable: true,
    //   align: "center",
    //   render: (_, record) => {
    //     return (
    //       <>
    //         {record?.dateTime
    //           ? dayjs(record?.dateTime).format("DD MMM YYYY")
    //           : ""}
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "Status",
    //   dataIndex: "bulkTransactionStatus",
    //   width: "10%",
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
            <Link to={`/all-bulk-transaction/${record.bulkTransactionId}`}>
              <EyeIcon
                onClick={() => {
                  console.log("On Show Icone Press", record);
                }}
                className="hovered-icon"
                color={customStyles.colorPrimary}
              />
            </Link>
            {/* <Link to={`/dashboard`}>
              <ClipboardEditIcon
                onClick={() => {
                  console.log("On Edit Icone Press", record);
                }}
                className="hovered-icon"
                color={customStyles.colorSecondary}
              />
            </Link> */}

            {/* <Trash2
              onClick={() => {
                showDeleteConfirm(record);
              }}
              className="hovered-icon"
              color={customStyles.colorDanger}
            /> */}
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [SelectedDropDownFilter, paymentTypeId]);

  const fetchData = async (limit, page) => {
    try {
      setLoading(true);
      const payload = {
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
      };
      // Only include if value is not null/undefined
      if (SelectedDropDownFilter?.transactionModeFilter?.value != null) {
        payload.transactionTypeId = SelectedDropDownFilter.transactionModeFilter.value;
      }

      if (paymentTypeId != null) {
        payload.paymentSystemId = paymentTypeId;
      }

      const response = await getAllBulkTransaction(payload);
      console.log("response: ", response);
      const allTransactionModeResponse = await getAllTransactionMode({});
      setTransactionModeLists(allTransactionModeResponse?.data);
      if (response.success === true) {
        setData(response.data.results);
        console.log("response.data.results: ", response.data.results);
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
  };

  return (
    <>
      <div>{contextHolder}</div>
      {loading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
        <>
          <Typography.Title
            level={5}
            style={{ margin: `${customStyles.margin}px 0px` }}
          >
            Bulk Transactions
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

              <Row justify="start" align="top" style={{marginBottom: '20px'}}>
              <Space
                size={[24, 24]}
                wrap
                block={false}
                style={{ marginLeft: 15 }}
              >
              <Dropdown 
                menu={{
                  items: [
                    {
                      label: "Transaction Type",
                      key: "0",
                      onClick: () => {
                        setSelectedDropDownFilter((pre) => ({
                          ...pre,
                          transactionModeFilter: {
                            label: "Transaction Type",
                            value: null,
                          },
                        }));
                      },
                    },
                    {
                      type: "divider",
                    },
                    ...transactionModeLists?.map((item, index) => ({
                      label: item?.name,
                      key: `${index + 1}`,
                      onClick: () => {
                        setSelectedDropDownFilter((pre) => ({
                          ...pre,
                          transactionModeFilter: {
                            label: item?.name,
                            value: item?.id,
                          },
                        }));
                      },
                    })),
                  ],
                  selectable: true,
                  defaultSelectedKeys: ["0"],
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
                    {SelectedDropDownFilter.transactionModeFilter?.label || "Transaction Type"}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>


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
                <div style={{ overflowX: "auto", overflowY: "auto" }}>
                  <Table
                    columns={columns}
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
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default AllBulkTransaction;
