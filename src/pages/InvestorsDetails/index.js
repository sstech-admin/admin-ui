/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Row,
  Space,
  Table,
  Typography,
  Form,
  Input,
  Upload,
  Modal,
  DatePicker,
  Tooltip,
  notification,
  Select,
  Skeleton,
} from "antd";
import {
  AlbumIcon,
  BanknoteIcon,
  Building2Icon,
  Calendar,
  CalendarCheck,
  CreditCard,
  Eye,
  Fingerprint,
  LandmarkIcon,
  Mail,
  MapPinIcon,
  Phone,
  TypeIcon,
  User,
  User2Icon,
  UploadIcon,
  Download,
  GanttChartSquare,
} from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import dayjs from "dayjs";
import Loader from "../../Component/Loader/Loader";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import {
  AddTdsCertificate,
  getAllInvestorTransaction,
  GetInvestor,
  GetInvestorImage,
  GetTdsCertificateByUser,
  GetWithdrawFunds,
  getReferences,
  exportCsvApi
} from "../../slices/Invester/investerAPI";
import FileShow from "../FileShow";
import { ColBTN } from "../BulkTransactionDetails/AllBulkTransaction.styles";
import DrawerComponent from "../../Component/Drawer/DrawerComponent";
import AddFunds from "./component/AddFunds";
import Withdraw from "./component/Withdraw";
import "./datepicker.css";
import { months } from "moment";
import { FileExcelFilled, FileExcelOutlined } from "@ant-design/icons";
import { convertExcel } from "../../helpers/ConvertExcel";
const { Option } = Select;

const InvestorsDetails = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const params = useParams();
  const [data, setdataData] = useState();
  const [tdsData, setTdsData] = useState();
  const [yearFilter, setYearFilter] = useState("");
  const [tableData, setTableData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [tdsLoading, setTdsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [getReference, setGetReferences] = useState([]);
  const [withdrawData, setWithdrawData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  const [form] = Form.useForm();
  const [allGetFileDocumnet, setAllGetFileDocumnet] = useState({
    aadharCardURL: null,
    panCardURL: null,
    chequeORPassbookURL: null,
    bankStatementURL: null,
    signatureURL: null,
  });
  const [messageApiType, contextHolder] = message.useMessage();
  const TitleContainer = styled.div`
    font-weight: 700;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${customStyles.colorTextHeading};
  `;
  const formatIndianNumber = (num) =>
    new Intl.NumberFormat("en-IN").format(num);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await GetInvestor({ userId: params.slug });
      // const response1 = await GetInvestorImage({ userId: params.slug });
      setdataData(await response.data);
      setAllGetFileDocumnet({
        aadharCardURL: response.data.aadharCardURL,
        panCardURL: response.data.panCardURL,
        chequeORPassbookURL: response.data.chequeORPassbookURL,
        bankStatementURL: response.data.bankStatementURL,
        signatureURL: response.data.signatureURL,
      });
      const withdrawresponse = await GetWithdrawFunds({ investorId: params.slug });
      const getReferencesResponse = await getReferences();
      setGetReferences(await getReferencesResponse.results)
      setWithdrawData(withdrawresponse);
      setGetReferences(await getReferencesResponse.results)

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
  const fetchTdsCertificates = async () => {
    try {
      setTdsLoading(true);
      const userId = params.slug;
      const currentYear = new Date().getFullYear();
      const param = {
        year: yearFilter ? yearFilter : currentYear,
        page: 1,
        limit: 10,
      };

      const response = await GetTdsCertificateByUser(userId, param);

      // Add quarter info to each record
      const formattedData = response?.data?.map((item) => ({
        ...item,
        quarter: getQuarterLabel(item.fromDate),
      }));

      setTdsData(formattedData);
      setTdsLoading(false);
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error.message || "Failed to fetch TDS Certificates",
        duration: 5,
      });
    } finally {
      setTdsLoading(false);
    }
  };

  const fetchDataInUseEffect = async () => {
    await fetchData();
    await fetchTableData();
  };

  useEffect(() => {
    fetchDataInUseEffect();
  }, []);

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
          setSelectedRowKeys(tdsData.map((item) => item.key)); // Select all rows
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

  useEffect(() => {
    fetchTdsCertificates();
  }, [yearFilter]);

  const onChange = (pageNumber) => {
    console.log("onChange Page: ", pageNumber);
  };

  const columns = [
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
              {formatIndianNumber(record?.amount)}
            </div>
          </Space>
        );
      },
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
      dataIndex: "createdAt",
      width: "25%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <>
            {record?.createdAt
              ? dayjs(record?.createdAt).format("DD MMM YYYY")
              : ""}
          </>
        );
      },
    },
  ];

  const formatDateTime = (date) => {
    return dayjs(date).format("DD-MM-YYYY HH:mm:ss");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadCertificateForm] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleUpload = async (values) => {
    try {
      console.log("FORM values", values);

      // Extract the uploaded file correctly
      const file = values.certificateFile?.fileList?.[0]?.originFileObj || null;

      if (!file) {
        throw new Error("No file uploaded");
      }

      // Format dates in UTC ISO format
      const data = {
        userId: params.slug, // Add the correct userId here
        remarks: values.remarks || "",
        fromDate: values.fromDateTime
          ? dayjs(values.fromDateTime).format("YYYY-MM-DDTHH:mm:ss[Z]")
          : null,
        toDate: values.toDateTime
          ? dayjs(values.toDateTime).format("YYYY-MM-DDTHH:mm:ss[Z]")
          : null,
        tdsCertificateFile: file, // Correct file extraction
      };

      console.log("FORMATTED FORM VALUES", data);

      // Call API
      const response = await AddTdsCertificate(data);
      fetchTdsCertificates();
      // Show success notification
      notification.success({
        message: "Success",
        description: "TDS Certificate has been added successfully.",
        placement: "bottomRight",
      });

      // Reset form and close modal
      uploadCertificateForm.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading TDS Certificate:", error.message || error);

      // Show error notification
      notification.error({
        message: "Upload Failed",
        description:
          error.message || "There was an issue uploading the TDS Certificate.",
        placement: "bottomRight",
      });
      uploadCertificateForm.resetFields();
    }
  };
  const handleYearChange = (value) => {
    setYearFilter(value);
    setSelectedYear(value);
    fetchTdsCertificates();
  };

  const getQuarterLabel = (date) => {
    if (!date) return "Unknown";
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    if (month >= 1 && month <= 3) return `Quarter-1 of ${year}`;
    if (month >= 4 && month <= 6) return `Quarter-2 of ${year}`;
    if (month >= 7 && month <= 9) return `Quarter-3 of ${year}`;
    if (month >= 10 && month <= 12) return `Quarter-4 of ${year}`;

    return "Unknown";
  };

  const downloadFile = async (fileUrl) => {
    try {
      if (!fileUrl) {
        message.error("No file available to download");
        return;
      }

      const response = await fetch(fileUrl, { mode: "no-cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileUrl.split("/").pop()); // Extract filename from URL
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      message.error("Failed to download file");
    }
  };

  const skeletonRows = Array.from({ length: 3 }).map((_, index) => ({
    key: `skeleton-${index}`,
    certificateId: <Skeleton.Input style={{ width: 120 }} active />,
    certificateFileUrl: <Skeleton.Input style={{ width: 60 }} active />,
    quarter: <Skeleton.Input style={{ width: 50 }} active />,
    fromDate: <Skeleton.Input style={{ width: 100 }} active />,
    toDate: <Skeleton.Input style={{ width: 100 }} active />,
    remarks: <Skeleton.Input style={{ width: 100 }} active />,
  }));

  const tdsCertificateColumns = [
    {
      title: "Certificate ID",
      dataIndex: "certificateId",
      width: "20%",
      editable: true,
      align: "center",
    },
    {
      title: "TDS Certificate",
      dataIndex: "certificateFileUrl",
      width: "20%",
      editable: true,
      align: "center",
      render: (text) =>
        text.length > 0 ? (
          <a
            onClick={() => downloadFile(text)}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            Download
          </a>
        ) : (
          <Skeleton.Input style={{ width: 100 }} active />
        ),
    },
    {
      title: "Quarter",
      dataIndex: "quarter",
      width: "15%",
      align: "center",
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      width: "10%",
      editable: true,
      align: "center",
      render: (_, record) =>
        record?.fromDate.length > 0 ? (
          <Tooltip title={`From: ${formatDateTime(record.fromDate)}`}>
            {formatDateTime(record.fromDate)}
          </Tooltip>
        ) : (
          <Skeleton.Input style={{ width: 100 }} active />
        ),
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      width: "10%",
      editable: true,
      align: "center",
      render: (_, record) =>
        record?.toDate.length > 0 ? (
          <Tooltip title={`${formatDateTime(record.toDate)}`}>
            {formatDateTime(record.toDate)}
          </Tooltip>
        ) : (
          <Skeleton.Input style={{ width: 100 }} active />
        ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      width: "25%",
      editable: true,
      align: "center",
    },
  ];

  const TextMuted = styled.div`
    color: ${customStyles.textMuted};
    font-weight: bold;
    font-size: 14px;
  `;
  const IconStyle = {
    marginRight: customStyles.marginXXS,
    verticalAlign: "middle",
  };

  // const colors3 = ["#40e495", "#30dd8a", "#2bb673"];
  // const colors4Red = ["#f50538", "#f50538", "#f50538"];
  // const colors4RedHover = ["#bf0f35", "#bf0f35", "#bf0f35"];
  // const getHoverColors = (colors) =>
  //   colors.map((color) => new TinyColor(color).lighten(5).toString());
  // const getActiveColors = (colors) =>
  //   colors.map((color) => new TinyColor(color).darken(5).toString());
  const onSubmitAddFunds = (values) => {
    form.resetFields();
  };

  function downloadExcel(bufferData, filename) {
    const byteArray = new Uint8Array(bufferData);
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  
  const exportCsv = async () => {
    try {
      setExportLoading(true);
      const exportResponse = await exportCsvApi({ investorId: params?.slug });
      convertExcel(exportResponse?.data?.buffer?.data, exportResponse?.data?.filename)
      setExportLoading(false);
    } catch (error) {
      setExportLoading(false);
      console.error('CSV Export Failed:', error);
    }
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
          <Row gutter={[24]} align="middle" justify="space-between">
            <Col xs={24} md={6}>
              <Typography.Title
                level={5}
                style={{ margin: `${customStyles.margin}px 0px` }}
              >
                Investor Detail
              </Typography.Title>
            </Col>
            <ColBTN xs={24} md={6}>
              <AddFunds data={data} onSuccess={()=>{fetchDataInUseEffect()}}/>
              <Withdraw data={data} withdrawData={withdrawData} onSuccess={()=>{fetchDataInUseEffect()}}/>
              <Button onClick={() => {}} style={{marginRight: '10px'}}>
                <Link
                  to={`/statement/${data?.publicIdentifier}/${params?.slug}`}
                >
                  Statement
                </Link>
              </Button>
              <Button onClick={() => {exportCsv()}} 
                disabled={!tableData.length || exportLoading}
                loading={exportLoading} // 🔄 Show loader when true
              >
                {
                  exportLoading ? 'Loading...' :(
                    <p>
                    <FileExcelOutlined style={{  }} /> <span>Export</span>
                    </p>
                  )
                }
              </Button>
            </ColBTN>
          </Row>
          <Row gutter={[24]}>
            <Col
              xs={24}
              className="gutter-row"
              style={{ marginBottom: customStyles.margin }}
            >
              <Card
                title={
                  data?.firstName
                    ? `${data?.firstName} ${data?.middleName} ${data?.lastName}`
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
                      <TextMuted>{!!data?.email ? data?.email : "-"}</TextMuted>
                    </Col>
                  )}
                  {!!data?.referenceId && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <Mail style={IconStyle} size={18} />
                        Reference
                      </TitleContainer>
                      <TextMuted>{!!data?.referenceId ? getReference.find(ref => ref.referenceId === data.referenceId)?.name : "-"}</TextMuted>
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
                      {!!data?.amount ? formatIndianNumber(data?.amount) : 0}{" "}
                      {data?.amountText ? `(${data?.amountText})` : ""}
                    </div>
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={8}>
                    <TitleContainer>
                      <GanttChartSquare style={IconStyle} size={18} />
                      Profit/Loss
                    </TitleContainer>
                    <TextMuted>
                      {data?.profitOrLossAmount > 0
                        ? `+${data?.profitOrLossAmount}`
                        : `-${data?.profitOrLossAmount}`}
                    </TextMuted>
                  </Col>

                  <Col xs={24} sm={12} md={12} lg={8}>
                    <TitleContainer>
                      <Calendar style={IconStyle} size={18} />
                      Date
                    </TitleContainer>
                    <TextMuted>
                      {!!data?.asOfDate
                        ? dayjs(data?.asOfDate).format("DD-MM-YYYY")
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
                        Pan Card
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
                        {!!data?.panCardTypeName ? data.panCardTypeName : " - "}
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

                  <Divider orientation="left">Nominee Details</Divider>
                  {data?.nomineeName && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <User style={IconStyle} size={18} />
                        Nominee Name
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.nomineeName ? data.nomineeName : ""}
                      </TextMuted>
                    </Col>
                  )}
                  {data?.nomineeRelation && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <CreditCard style={IconStyle} size={18} />
                        Nominee Relation
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.nomineeRelation ? data.nomineeRelation : ""}
                      </TextMuted>
                    </Col>
                  )}
                  {data?.nomineeAadharCardNumber && (
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <TitleContainer>
                        <Fingerprint style={IconStyle} size={18} />
                        Nominee AadharCard Number
                      </TitleContainer>
                      <TextMuted>
                        {!!data?.nomineeAadharCardNumber
                          ? data.nomineeAadharCardNumber
                          : ""}
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
                title={"Documents Details"}
                size="default"
                style={{ marginBottom: customStyles.margin }}
              >
                <Row gutter={[30, 15]}>
                  {!!allGetFileDocumnet?.aadharCardURL && (
                    <Col xs={24} sm={12} md={8} lg={8}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TitleContainer>Aadhar Card</TitleContainer>
                        <a
                          style={{ display: "flex", marginLeft: "5px" }}
                          href={allGetFileDocumnet?.aadharCardURL}
                          target="_blank"
                        >
                          <Eye />
                        </a>
                      </div>
                      <FileShow link={allGetFileDocumnet?.aadharCardURL} />
                    </Col>
                  )}
                  {!!allGetFileDocumnet?.panCardURL && (
                    <Col xs={24} sm={12} md={8} lg={8}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TitleContainer>Pan Card</TitleContainer>
                        <a
                          style={{ display: "flex", marginLeft: "5px" }}
                          href={allGetFileDocumnet?.panCardURL}
                          target="_blank"
                        >
                          <Eye />
                        </a>
                      </div>
                      <FileShow link={allGetFileDocumnet?.panCardURL} />
                    </Col>
                  )}
                  {!!allGetFileDocumnet?.bankStatementURL && (
                    <Col xs={24} sm={12} md={8} lg={8}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TitleContainer>Bank Statement</TitleContainer>
                        <a
                          style={{ display: "flex", marginLeft: "5px" }}
                          href={allGetFileDocumnet?.bankStatementURL}
                          target="_blank"
                        >
                          <Eye />
                        </a>
                      </div>
                      <FileShow link={allGetFileDocumnet?.bankStatementURL} />
                    </Col>
                  )}
                  {!!allGetFileDocumnet?.chequeORPassbookURL && (
                    <Col xs={24} sm={12} md={8} lg={8}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TitleContainer>Cheque</TitleContainer>
                        <a
                          style={{ display: "flex", marginLeft: "5px" }}
                          href={allGetFileDocumnet?.chequeORPassbookURL}
                          target="_blank"
                        >
                          <Eye />
                        </a>
                      </div>
                      <FileShow
                        link={allGetFileDocumnet?.chequeORPassbookURL}
                      />
                    </Col>
                  )}
                  {!!allGetFileDocumnet?.signatureURL && (
                    <Col xs={24} sm={12} md={8} lg={8}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TitleContainer>Signature</TitleContainer>
                        <a
                          style={{ display: "flex", marginLeft: "5px" }}
                          href={allGetFileDocumnet?.signatureURL}
                          target="_blank"
                        >
                          <Eye />
                        </a>
                      </div>
                      <FileShow link={allGetFileDocumnet?.signatureURL} />
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
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px ",
                      marginTop: "10px",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ justifyItems: "center" }}>TDS Certificates</p>
                    <Button
                      type="primary"
                      onClick={showModal}
                      style={{
                        marginBottom: 16,
                        display: "flex",
                        fontSize: "16px",
                      }}
                    >
                      <UploadIcon style={{ marginRight: "10px" }} />
                      <p>Upload Certificate</p>
                    </Button>
                  </div>
                }
                size="default"
                style={{ marginBottom: 16 }}
              >
                <div style={{ overflowX: "auto", overflowY: "auto" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      padding: "5px",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <Select
                      name="yearFilter"
                      placeholder="Year"
                      style={{ width: 230 }}
                      onChange={handleYearChange}
                      value={selectedYear} // Ensure this is a state variable
                      allowClear
                    >
                      {Array.from(
                        { length: new Date().getFullYear() - 2010 + 1 },
                        (_, i) => {
                          const startYear = new Date().getFullYear() - i; // Get years in descending order
                          return (
                            <Option key={startYear} value={startYear}>
                              Financial Year {`${startYear}-${startYear + 1}`}
                            </Option>
                          );
                        }
                      )}
                    </Select>
                  </div>
                  <Table
                    rowSelection={rowSelection}
                    columns={tdsCertificateColumns}
                    dataSource={tdsLoading ? skeletonRows : tdsData}
                  />
                </div>

                {/* Upload Modal */}
                <Modal
                  title="Upload TDS Certificate"
                  open={isModalOpen}
                  onCancel={handleCancel}
                  footer={null}
                  width={500}
                >
                  <Form
                    form={uploadCertificateForm}
                    layout="vertical"
                    onFinish={handleUpload}
                  >
                    <Form.Item
                      label="Certificate File"
                      name="certificateFile"
                      rules={[
                        {
                          required: true,
                          message: "Please upload the certificate file",
                        },
                      ]}
                    >
                      <Upload beforeUpload={() => false}>
                        <Button
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {" "}
                          <UploadIcon style={{ marginRight: "5px" }} /> Click to
                          Upload
                        </Button>
                      </Upload>
                    </Form.Item>

                    <Form.Item
                      label="Select From Date"
                      name="fromDateTime"
                      rules={[
                        {
                          required: true,
                          message: "Please select from date and time",
                        },
                      ]}
                    >
                      <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        dropdownClassName="custom-datepicker"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Select To Date"
                      name="toDateTime"
                      rules={[
                        {
                          required: true,
                          message: "Please select to date and time",
                        },
                      ]}
                    >
                      <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        dropdownClassName="custom-datepicker"
                      />
                    </Form.Item>

                    <Form.Item label="Remarks" name="remarks">
                      <Input.TextArea placeholder="Enter remarks (optional)" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
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
                      pageSizeOptions: [10, 20, 50, 100],
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

export default InvestorsDetails;
