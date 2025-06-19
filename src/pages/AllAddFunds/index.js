import React, { useState, useEffect } from "react";
import { Card, Col, Row, Table, Typography, Select } from "antd";
import { Search } from "lucide-react";
import dayjs from "dayjs";
import usecustomStyles from "../../Common/Hooks/customStyles";
import WithdrawDialogue from "./component/WithdrawDialogue";
import AddFundsDialogue from "./component/AddFundsDialogue";
import { GetAllAddWithdrawLists } from "../../slices/Invester/investerAPI";
const { Option } = Select;
const AllAddWithdraws = () => {
  document.title = "All Add - Withdraws" + process.env.REACT_APP_PAGE_TITLE;
  const customStyles = usecustomStyles();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [SelectedDropDownFilter, setSelectedDropDownFilter] = useState({
    dateYYYYMMddFilter: "",
  });
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 10,
    currentPage: 1,
  });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRequestType, setSelectedRequestType] = useState(0);

  useEffect(() => {
    fetchData();
  }, [
    selectedRequestType,
    pagination.currentPage,
    pagination.defaultPageSize,
    selectedStatus
  ]);
  // Added pagination dependency to re-fetch data when it changes

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
      defaultPageSize: pageSize,
    }));
  };

  const fetchData = async () => {
    try {
      const data = {
        transactionTypeId: 1,
        page: pagination.currentPage,
        limit: pagination.defaultPageSize,
      };
      if(selectedStatus || selectedStatus >= 0 && selectedStatus != null){
        data.transactionStatusId = selectedStatus
      }
      const response = await GetAllAddWithdrawLists(data); // <-- await here

      if (response) {
        setPagination((pre) => ({
          ...pre,
          total: response.totalResults,
          currentPage: response.page,
        }));

        const formattedData = response.results.map((item, index) => ({
          key: index,
          investorId: item.userName,
          investorName: item.investorName,
          amount: item.amount,
          transactionId: item.transactionId,
          requestType: item.requestType,
          transactionRefNumber: item?.transactionRefNumber || '',
          transactionImage: item?.transactionImage || '',
          date: item.updatedAt,
          status:
            item.transactionStatusId === 0
              ? "Pending"
              : item.transactionStatusId === 1
              ? "Approved"
              : "Rejected",
        }));

        setData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    {
      title: "Investor ID",
      dataIndex: "investorId",
      width: "15%",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "investorName",
      width: "20%",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "15%",
      align: "center",
    },
    {
      title: "Request Type",
      dataIndex: "requestType",
      width: "15%",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      width: "15%",
      align: "center",
      render: (_, record) => dayjs(record?.date).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
      align: "center",
      render: (_, record) => {
        const status = record.status;
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
      title: "View",
      dataIndex: "view",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <div>
          {record.requestType === "Withdraw" ? (
            <WithdrawDialogue data={record} refetchData={fetchData} />
          ) : (
            <AddFundsDialogue data={record} refetchData={fetchData} />
          )}
        </div>
      ),
    },
  ];

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleRequestTypeChange = (value) => {
    setSelectedRequestType(value);
  };

  return (
    <>
      <Row gutter={[24]} justify="space-between">
        <Col xs={24} md={6}>
          <Typography.Title
            level={5}
            style={{ margin: `${customStyles.margin}px 0px` }}
          >
            List Add Funds Requests
          </Typography.Title>
        </Col>
      </Row>
      <Row gutter={[24]}>
        <Col xs={24}>
          <Card>
            <Row
              align="middle"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              {/* <Input
                placeholder="Search..."
                prefix={<Search size={15} />}
                onChange={(e) => setSearchInputValue(e.target.value)}
                style={{ width: "200px" }}
              />
              <DatePicker
                format="DD MMM YYYY"
                onChange={(e) =>
                  setSelectedDropDownFilter({ dateYYYYMMddFilter: e ? dayjs(e).format("YYYY-MM-DD") : "" })
                }
              />*/}
              <Select
                name="transactionTypeFilter"
                placeholder="Transaction Type"
                onChange={handleStatusChange}
                style={{ width: 200 }}
                // allowClear
              >
                <Option value={null}>All</Option>
                <Option value={0}>Pending</Option>
                <Option value={1}>Approved</Option>
                <Option value={2}>Rejected</Option>
              </Select>
            </Row>
            <Table
              columns={columns}
              dataSource={data}
              style={{ marginTop: 32 }}
              responsive={true}
              pagination={{
                defaultPageSize: pagination?.defaultPageSize,
                total: pagination?.total,
                current: pagination?.currentPage,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                onChange: handlePageChange,
                pageSizeOptions: [1, 10, 20, 50, 100],
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AllAddWithdraws;
