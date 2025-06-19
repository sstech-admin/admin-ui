/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Col, message, Row, Space, Table, Typography } from "antd";
import { EyeIcon } from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { Link } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import { getAllExportPendingTransaction } from "../../slices/transaction/transactionAPI";
import dayjs from "dayjs";

const ExportBank = () => {
  document.title = "Export History" + process.env.REACT_APP_PAGE_TITLE;

  const [data, setData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  const [messageApiType, contextHolder] = message.useMessage();
  const onChange = (pageNumber) => {
    console.log("onChange Page: ", pageNumber);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "exportPendingTransactionId",
      width: "10%",
      editable: true,
      align: "center",
    },
    {
      title: "Payment System",
      dataIndex: "paymentSystem",
      width: "30%",
      editable: true,
      align: "center",
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Transactional Bank",
      dataIndex: "transactionalBank",
      width: "30%",
      editable: true,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      width: "20%",
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
    //   title: "Status",
    //   dataIndex: "bulkTransactionStatus",
    //   width: "10%",
    //   editable: true,
    //   align: "center",
    // },
    {
      title: "Action",
      dataIndex: "Action",
      width: "10%",
      align: "center",
      render: (_, record) => {
        return (
          <Space size={12}>
            <Link to={`/export-history/${record.exportPendingTransactionId}`}>
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

  const fetchData = async (limit, page) => {
    try {
      setLoading(true);
      const response = await getAllExportPendingTransaction({
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
      });
      console.log("response: ", response);
      if (response.status === "success") {
        setData(response.data);
        setPagination((pre) => ({
          ...pre,
          total: response.totalPages,
          defaultPageSize: response.limit,
          currentPage: response.page,
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
            Export Bank
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

export default ExportBank;
