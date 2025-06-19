/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Card, Col, message, Row, Space, Table, Typography } from "antd";
import {
  AlbumIcon,
  BanknoteIcon,
  Calendar,
  CalendarCheck,
  CreditCard,
  EyeIcon,
  Fingerprint,
  Mail,
  Phone,
  User2Icon,
} from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import dayjs from "dayjs";
import Loader from "../../Component/Loader/Loader";
import styled from "styled-components";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  getAllReferenceInvestor,
  GetInvestor,
  getReferenceInvestor,
} from "../../slices/Invester/investerAPI";

const ReferenceInvestorsDetails = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const params = useParams();
  const location = useLocation();
  const {name} = location.state || {};
  const [data, setdataData] = useState();
  const [tableData, setTableData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [messageApiType, contextHolder] = message.useMessage();
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
      const response = await GetInvestor({ userId: params.slug });
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
  const fetchTableData = async () => {
    try {
      setLoading(true);
      const response = await getReferenceInvestor(params?.slug);
      if (response) {
        setTableData(response);
      } else {
        setTableData([]);
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
    fetchTableData();
  }, []);

  const onChange = (pageNumber) => {
    console.log("onChange Page: ", pageNumber);
  };

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "userId",
    //   width: "5%",
    //   editable: true,
    //   align: "center",
    // },
    {
      title: "Invetore ID",
      dataIndex: "userName",
      width: "20%",
      editable: true,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "firstName",
      width: "20%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>{`${record?.firstName ?? " "} ${record?.middleName ?? " "} ${
            record?.lastName ?? " "
          }`}</>
        );
      },
    },

    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      width: "20%",
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
                {record?.amount ? record?.amount + (record?.profitOrLossAmount || 0) : 0}
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
        </Space>
      ),
    },
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
            {name? `${name}'s` : " "} Investors List 
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
                    dataSource={tableData}
                    onChange={onChange}
                    responsive={true}
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

export default ReferenceInvestorsDetails;
