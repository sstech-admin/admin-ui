/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  message,
  Row,
  Space,
  Table,
} from "antd";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { useParams } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import dharmaInfoSystemLogo from "../../assets/images/ainfinitylogo.png";
import moment from "moment";
import dayjs from "dayjs";
import {
  getAllInvestorTransaction,
  GetInvestor,
  publicGetAllInvestorTransaction,
  publicGetInvestor,
} from "../../slices/Invester/investerAPI";
import {
  AlbumIcon,
  BanknoteIcon,
  Building2Icon,
  Calendar,
  CalendarCheck,
  CreditCard,
  Fingerprint,
  LandmarkIcon,
  Mail,
  MapPinIcon,
  Phone,
  TypeIcon,
  User,
  User2Icon,
} from "lucide-react";
import styled from "styled-components";

const GetInvestorsOpen = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const { RangePicker } = DatePicker;
  const customStyles = usecustomStyles();
  const params = useParams();
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Set initialToDate to the end of the current month
  const initialToDate = dayjs().endOf("month");
  // Set initialFromDate to the start of the month that is two months prior to initialToDate
  const initialFromDate = initialToDate.subtract(2, "month").startOf("month");

  const [dates, setDates] = useState([initialFromDate, initialToDate]);
  const [dataLoading, setLoading] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const [messageApiType, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  
  // mobile view Suppot date picker
  const [startValue, setStartValue] = useState(initialFromDate);
  const [endValue, setEndValue] = useState(initialToDate);
  const [endOpen, setEndOpen] = useState(false);

  const TitleContainer = styled.div`
    font-weight: 700;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${customStyles.colorTextHeading};
  `;
  const TextMuted = styled.div`
    color: ${customStyles.textMuted};
    font-weight: bold;
    font-size: 14px;
  `;
  const IconStyle = {
    marginRight: customStyles.marginXXS,
    verticalAlign: "middle",
  };

  const formatDate = (date) => {
    let d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };


    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await GetInvestor({ userId: params.slug });
        // const response1 = await GetInvestorImage({ userId: params.slug });
        setData(response.data);
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
          const response = await getAllInvestorTransaction({
            page: page || pagination.currentPage,
            limit: limit || pagination.defaultPageSize,
            investorId: params.slug,
          });
          if (response.success === true) {
            setTableData(response.data.results);
            setPagination((pre) => ({
              ...pre,
              total: response.data?.totalResults,
              defaultPageSize: response.data?.limit,
              currentPage: response.data?.page,
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
        fetchTableData()
      }, []);
  const tableDataFormat = [
    {
      title: "Account",
      dataIndex: "accountName",
      width: "25%",
      editable: true,
      align: "center",
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
      title: "Date",
      dataIndex: "updatedAt",
      width: "25%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>
            {record?.updatedAt
              ? dayjs(record?.updatedAt).format("DD MMM YYYY")
              : ""}
          </>
        );
      },
    },
  ];

  const disabledDate = (current) => {
    const end = dayjs().endOf("month");
    return current > end;
  };

  const onChange = (dates) => {
    if (dates) {
      const [start, end] = dates;

      const adjustedStart = start.startOf("month");
      const adjustedEnd = end.endOf("month");

      const diffMonths = adjustedEnd.diff(adjustedStart, "months", true);

      if (diffMonths > 3) {
        message.error("The selected range cannot exceed 3 months.");
        return;
      }

      setDates([adjustedStart, adjustedEnd]);
      fetchData(null, null, adjustedStart, adjustedEnd);
    } else {
      setDates(null);
    }
  };

  const onReset = () => {
    setDates([initialFromDate, initialToDate]);
    fetchData(null, null, initialFromDate, initialToDate);
  };

  // mobile view Suppot date picker

  const disabledStartDate = (start) => {
    const end = dayjs().endOf("month");
    return start && start > end;
  };

  const disabledEndDate = (end) => {
    const start = startValue || initialFromDate; // Use initialFromDate if startValue is not set
    const endOfMonth = dayjs().endOf("month");
    return (end && end > endOfMonth) || (end && end < start);
  };

  const handleStartChange = (value) => {
    setStartValue(value);
  };
  const handleEndChange = (value) => {
    if (value) {
      const start = startValue ? startValue.startOf("month") : initialFromDate;
      const end = value.endOf("month");

      const diffMonths = end.diff(start, "months", true);

      if (diffMonths > 3) {
        message.error("The selected range cannot exceed 3 months.");
        setEndValue(null); // Reset endValue if the range is invalid
      } else {
        setEndValue(value);
        setDates([start, end]);
        fetchData(null, null, start, end);
      }
    } else {
      setEndValue(null);
    }
  };
  const handleStartOpenChange = (open) => {
    if (!open) {
      setEndOpen(true);
    }
  };

  const handleEndOpenChange = (open) => {
    setEndOpen(open);
  };

  const onResetMobileView = () => {
    setStartValue(initialFromDate);
    setEndValue(initialToDate);
    fetchData(null, null, initialFromDate, initialToDate);
  };

  return (
    <>
      <div>{contextHolder}</div>
      {dataLoading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
        <>
          <div
            style={{
              backgroundColor: customStyles?.colorSuccessBg,
              padding: "2% 3%",
            }}
          >
            <div style={{ margin: "auto", display: "flex", marginBottom: 10 }}>
              <img
                alt="Brand logo"
                src={dharmaInfoSystemLogo}
                height={60}
                style={{ lineHeight: "24px", margin: "auto" }}
                className="brand-dark-logo ant-mx-auto"
              />
            </div>
            <Row gutter={[12]}>
              <Col
                xs={24}
                className="gutter-row"
                // style={{ marginBottom: customStyles.margin }}
              >
                <Card
                  title={
                    data?.firstName
                      ? `${data?.firstName ?? ""} ${data?.middleName ?? ""} ${
                          data?.lastName ?? ""
                        }`
                      : "-"
                  }
                  size="default"
                  style={{ marginBottom: customStyles.margin }}
                >
                  <Row gutter={[30, 15]}>
                    {!!data?.userName && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          {/* <IndianRupee style={IconStyle} size={18} /> */}
                          <User2Icon style={IconStyle} size={18} />
                          Investor ID
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.userName ? data?.userName : "-"}
                        </TextMuted>
                      </Col>
                    )}
                    {!!data?.investorTypeName && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          {/* <IndianRupee style={IconStyle} size={18} /> */}
                          <AlbumIcon style={IconStyle} size={18} />
                          Invester Type
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.investorTypeName
                            ? data?.investorTypeName
                            : "-"}
                        </TextMuted>
                      </Col>
                    )}
                    {!!data?.paymentSystemName && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <CalendarCheck style={IconStyle} size={18} />
                          Payment System
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.paymentSystemName
                            ? data?.paymentSystemName
                            : "-"}
                        </TextMuted>
                      </Col>
                    )}
                    {!!data?.phoneNumber && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <Phone style={IconStyle} size={18} />
                          Phone Number
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.phoneNumber ? data?.phoneNumber : "-"}
                        </TextMuted>
                      </Col>
                    )}
                    {!!data?.email && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <Mail style={IconStyle} size={18} />
                          Email
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.email ? data?.email : "-"}
                        </TextMuted>
                      </Col>
                    )}

                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <BanknoteIcon style={IconStyle} size={18} />
                        Amount
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
                    {console.log("data?.asOfDate: ", data?.asOfDate)}
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <Calendar style={IconStyle} size={18} />
                        Date Of Joining
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.asOfDate
                          ? moment(data?.asOfDate).format("DD MMM YYYY")
                          : "-"}
                      </TextMuted>
                    </Col>
                    {!!data?.aadharCardNumber && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <Fingerprint style={IconStyle} size={18} />
                          Aadhar Card
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.aadharCardNumber
                            ? data?.aadharCardNumber
                            : "-"}
                        </TextMuted>
                      </Col>
                    )}
                    {!!data?.panCardNumber && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <CreditCard style={IconStyle} size={18} />
                          Pancard Card
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.panCardNumber ? data.panCardNumber : " - "}
                        </TextMuted>
                      </Col>
                    )}
                    {!!data?.panCardTypeName && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <TypeIcon style={IconStyle} size={18} />
                          Pancard Card Type
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.panCardTypeName
                            ? data.panCardTypeName
                            : " - "}
                        </TextMuted>
                      </Col>
                    )}
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <MapPinIcon style={IconStyle} size={18} />
                        Address
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.address1 ? data.address1 : ""}
                      </TextMuted>
                      <TextMuted>
                        {!!data?.address2 ? data.address2 : ""}
                      </TextMuted>
                      <TextMuted>
                        {!!data?.district ? data.district : ""}
                        {!!data?.district && ","}{" "}
                        {!!data?.state ? data.state : ""}
                      </TextMuted>
                      <TextMuted>
                        {!!data?.country ? data.country : ""}{" "}
                        {!!data?.country && "-"}{" "}
                        {!!data?.pinCode ? data.pinCode : ""}
                      </TextMuted>
                    </Col>
                    <Divider orientation="left">Bank Details</Divider>
                    {data?.nameAsPerBank && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <User style={IconStyle} size={18} />
                          Name As Per Bank
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.nameAsPerBank ? data.nameAsPerBank : ""}
                        </TextMuted>
                      </Col>
                    )}
                    {data?.bankName && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <LandmarkIcon style={IconStyle} size={18} />
                          Bank Name
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.bankName ? data.bankName : ""}
                        </TextMuted>
                      </Col>
                    )}
                    {data?.bankAccountNumber && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <Building2Icon style={IconStyle} size={18} />
                          Bank Account Number
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.bankAccountNumber
                            ? data.bankAccountNumber
                            : ""}
                        </TextMuted>
                      </Col>
                    )}
                    {data?.ifscCode && (
                      <Col xs={24} sm={12} md={12} lg={8}>
                        <TitleContainer>
                          <BanknoteIcon style={IconStyle} size={18} />
                          IFSC Code
                        </TitleContainer>
                        <TextMuted>
                          {!!data?.ifscCode ? data.ifscCode : ""}
                        </TextMuted>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>

              <Col
                xs={24}
                className="gutter-row"
                style={{ marginBottom: customStyles.margin }}
              >
                <Card
                  title={"Transaction Details"}
                  style={{ margin: `${customStyles.margin}px 0px` }}
                >
                  {isMobile && (
                    <>
                      <div style={{ marginBottom: 8 }}>
                        <b>Date Range</b>{" "}
                      </div>
                    </>
                  )}
                  <Space
                    direction="horizontal"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    {isMobile && (
                      // mobile view Suppot date picker
                      <div>
                        <div>
                          <span>
                            <b>From Date : </b>
                          </span>
                          <DatePicker
                            disabledDate={disabledStartDate}
                            picker="month"
                            value={startValue}
                            placeholder="Start"
                            onChange={handleStartChange}
                            onOpenChange={handleStartOpenChange}
                          />
                        </div>
                        <div style={{ marginTop: 20 }}>
                          <span>
                            <b>To Date : </b>
                          </span>
                          <DatePicker
                            disabledDate={disabledEndDate}
                            picker="month"
                            value={endValue}
                            placeholder="End"
                            onChange={handleEndChange}
                            open={endOpen}
                            onOpenChange={handleEndOpenChange}
                          />
                        </div>
                        <div style={{ marginTop: 20 }}>
                          <Button onClick={onResetMobileView} type="default">
                            Reset
                          </Button>
                        </div>
                      </div>
                    )}
                    {!isMobile && (
                      <>
                        <span>
                          <b>Date Range</b>{" "}
                        </span>

                        <RangePicker
                          picker="month"
                          disabledDate={disabledDate}
                          onChange={onChange}
                          value={dates}
                          mode={["month"]}
                        />
                        <Button onClick={onReset} type="default">
                          Reset
                        </Button>
                      </>
                    )}
                  </Space>

                  <Table
                    columns={tableDataFormat}
                    dataSource={tableData}
                    responsive={true}
                    style={{ textAlign: "center", marginTop: 30 }}
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
                        await fetchData(other, page, dates[0], dates[1]);
                      },
                      pageSizeOptions: [20, 50, 100, 500, 1000, 2000],
                    }}
                    scroll={{ x: "max-content" }} // Add this line
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
};

export default GetInvestorsOpen;
