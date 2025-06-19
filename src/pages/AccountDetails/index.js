/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  message,
  // Modal,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import {
  AlbumIcon,
  BanknoteIcon,
  Calendar,
  // Trash2,
  User2Icon,
} from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import dayjs from "dayjs";
import Loader from "../../Component/Loader/Loader";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  getAccount,
  getAllAccountTransaction,
} from "../../slices/Invester/investerAPI";
// import { updateTransaction } from "../../slices/transaction/transactionAPI";

const AccountDetails = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const params = useParams();
  const [data, setdataData] = useState();
  const [tableData, setTableData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 0,
  });
  const [messageApiType, contextHolder] = message.useMessage();
  // const { confirm } = Modal;
  const TitleContainer = styled.div`
    font-weight: 700;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${customStyles.colorTextHeading};
  `;
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAccount({ accountId: params.slug });
      setdataData(await response.data);
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
        duration: 5,
      });
    }
    setLoading(false);
  };
  const fetchTableData = async (limit, page) => {
    try {
      setLoading(true);
      const response = await getAllAccountTransaction({
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
        accountId: params.slug,
      });
      if (response.success === true) {
        setTableData(response.data.results);
        setPagination((pre) => ({
          ...pre,
          total: response.data.totalPages,
          defaultPageSize: response.data.limit,
          currentPage: response.data.page,
        }));
      } else {
        setTableData([]);
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
  useEffect(() => {
    fetchData();
    fetchTableData();
  }, []);

  const onChange = (pageNumber) => {
    console.log("onChange Page: ", pageNumber);
  };

  // const DeleteOrUpdateTransactionData = async (Data) => {
  //   try {
  //     setLoading(true);
  //     const transactionObject = {
  //       transactionId: Data?.transactionId,
  //       accountId: Data?.accountId,
  //       transactionModeId: Data?.transactionModeId,
  //       investorId: Data?.investorId,
  //       amount: Data?.amount,
  //       dateTime: Data?.dateTime,
  //     };
  //     const response = await updateTransaction({
  //       ...transactionObject,
  //       deletedOnly: true,
  //     });
  //     const statusData = await response.status;
  //     if (statusData === "success") {
  //       fetchData();
  //       fetchTableData();
  //     }
  //     await messageApiType.open({
  //       type: "success",
  //       content: statusData,
  //     });
  //   } catch (error) {
  //     messageApiType.open({
  //       type: "error",
  //       content: error,
  //     });
  //   }
  //   setLoading(false);
  // };
  // const showDeleteConfirm = (Value) => {
  //   confirm({
  //     title: `Are you sure delete this transaction Id ${Value.transactionId}?`,
  //     content: "Press Yes for Permenat Delete",
  //     okText: "Yes",
  //     okType: "danger",
  //     cancelText: "No",
  //     cancleType: "danger",
  //     autoFocusButton() {
  //       console.log("autoFocusButton");
  //     },
  //     centered: true,
  //     onOk() {
  //       console.log("OK");
  //       DeleteOrUpdateTransactionData(Value);
  //     },
  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //     okButtonProps: true,
  //     confirmLoading: true,
  //   });
  // };

  const columns = [
    {
      title: "Investor",
      dataIndex: "investorName",
      width: "20%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>
            <div>{`${record?.investorFirstName ?? ""}`}</div>
            <div style={{ fontSize: 12 }}>
              {record?.investorName ? `(${record?.investorName})` : "-"}
            </div>
          </>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "15%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <Space size={12}>
            <div
              style={{ color: `${record?.amountColour}`, fontWeight: "bold" }}
            >
              {record?.amount}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Transaction Mode",
      dataIndex: "transactionMode",
      width: "20%",
      editable: true,
      align: "center",
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      width: "15%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>
            {record?.dateTime
              ? dayjs(record?.dateTime).format("DD MMM YYYY")
              : ""}
          </>
        );
      },
    },
    // {
    //   title: "Action",
    //   dataIndex: "Action",
    //   width: "10%",
    //   align: "center",
    //   render: (_, record) => {
    //     return (
    //       <Space size={12}>
    //         <Trash2
    //           onClick={() => {
    //             showDeleteConfirm(record);
    //           }}
    //           className="hovered-icon"
    //           color={customStyles.colorDanger}
    //         />
    //       </Space>
    //     );
    //   },
    // },
  ];
  const TextMuted = styled.div`
    color: ${customStyles.textMuted};
    font-weight: bold;
    font-size: 18px;
  `;
  const IconStyle = {
    marginRight: customStyles.marginXXS,
    verticalAlign: "middle",
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
            Account Detail
          </Typography.Title>
          <Row gutter={[24]}>
            <Col
              xs={24}
              className="gutter-row"
              style={{ marginBottom: customStyles.margin }}
            >
              <Card
                size="default"
                style={{ marginBottom: customStyles.margin }}
              >
                <Row gutter={[30, 15]}>
                  {!!data?.accountId && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        {/* <IndianRupee style={IconStyle} size={18} /> */}
                        <User2Icon style={IconStyle} size={18} />
                        Account ID
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.accountId ? data?.accountId : "-"}
                      </TextMuted>
                    </Col>
                  )}
                  {!!data?.name && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        {/* <IndianRupee style={IconStyle} size={18} /> */}
                        <AlbumIcon style={IconStyle} size={18} />
                        Name
                      </TitleContainer>
                      <TextMuted>{!!data?.name ? data?.name : "-"}</TextMuted>
                    </Col>
                  )}

                  <Col xs={24} sm={12} md={12} lg={8}>
                    <TitleContainer>
                      <BanknoteIcon style={IconStyle} size={18} />
                      Balance
                    </TitleContainer>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: `${data?.amountColour}`,
                      }}
                    >
                      {!!data?.amount ? data?.amount : 0}{" "}
                      {data?.amountText ? `(${data?.amountText})` : ""}
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <TitleContainer>
                      <BanknoteIcon style={IconStyle} size={18} />
                      Opening Balance
                    </TitleContainer>
                    <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                      {!!data?.balance ? data?.balance : 0}
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <TitleContainer>
                      <Calendar style={IconStyle} size={18} />
                      Date
                    </TitleContainer>
                    <TextMuted>
                      {!!data?.asOnDate
                        ? dayjs(data?.asOnDate).format("DD-MM-YYYY")
                        : "-"}
                    </TextMuted>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col
              xs={24}
              className="gutter-row"
              style={{ marginBottom: customStyles.margin }}
            >
              <Card
                // title="Filter in Tree"
                style={{ marginBottom: customStyles.margin }}
              >
                <div style={{ overflowX: "auto", overflowY: "auto" }}>
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
                        await fetchTableData(other, page);
                      },
                      pageSizeOptions: [20, 50, 100, 500, 1000, 2000],
                    }}
                  />
                </div>
              </Card>
            </Col>

            {/* <Col span={24} className="gutter-row">
          <Pagination
            showQuickJumper
            onShowSizeChange={onShowSizeChange}
            onChange={onChange}
            defaultCurrent={3}
            total={500}
            responsive={true}
            // disabled
          />
        </Col> */}
          </Row>
        </>
      )}
    </>
  );
};

export default AccountDetails;
