/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Col, message, Row, Space, Table, Typography } from "antd";
import { EyeIcon } from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { Link } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import { getAllReference, getReference, getReferences } from "../../slices/Invester/investerAPI";

const ReferenceInvestors = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;

  const [data, setData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 0,
  });
  const [messageApiType, contextHolder] = message.useMessage();
  const onChange = (pageNumber) => {
    console.log("onChange Page: ", pageNumber);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "20%",
      editable: true,
      align: "center",
    },
    {
      title: "ReferenceID",
      dataIndex: "referenceId",
      width: "20%",
      editable: true,
      align: "center",
    },
    {
      title: "Total Investor",
      dataIndex: "totalInvestors",
      width: "15%",
      editable: true,
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "Action",
      width: "20%",
      align: "center",
      render: (_, record) => {
        return (
          <Space size={12}>
            <Link to={`/reference-investors/${record.referenceId}`}
              state={{ name: record.name }}
            >
              <EyeIcon
                onClick={() => {}}
                className="hovered-icon"
                color={customStyles.colorPrimary}
              />
            </Link>
          </Space>
        );
      },
    },
  ];

  const fetchData = async (limit, page) => {
    try {
      setLoading(true);
      const response = await getReferences({
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
        search: "",
      });
      if (response) {
        console.log('res', response)
        setData(response.results);
        setPagination((pre) => ({
          ...pre,
          total: response.totalResults,
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
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>{contextHolder}</div>
      <>
        <Typography.Title
          level={5}
          style={{ margin: `${customStyles.margin}px 0px` }}
        >
          Referrals
        </Typography.Title>

        <Row gutter={[24]}>
          <Col
            xs={24}
            className="gutter-row"
            style={{ marginBottom: customStyles.margin }}
          >
              <Card style={{ marginBottom: customStyles.margin }}>
                <div style={{ overflowX: "auto", overflowY: "auto" }}>
                  <Table
                    columns={columns}
                    loading={loading}
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
                      pageSizeOptions: [20, 50, 100, 500, 1000, 2000],
                    }}
                  />
                </div>
              </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default ReferenceInvestors;
