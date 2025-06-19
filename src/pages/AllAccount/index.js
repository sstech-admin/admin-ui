/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Col, message, Modal, Row, Space, Table, Typography, Input, Button } from "antd";
import { ClipboardEditIcon, EyeIcon, Trash2 } from "lucide-react";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { Link } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import {
  deleteAccount,
  getAllAccount,
  updateAccount,
} from "../../slices/generalSetting/generalSettingAPI";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "../../helpers/useDebounce";
const AllAccount = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;

  const [data, setData] = useState([]);
  const customStyles = usecustomStyles();
  const [loading, setLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    defaultPageSize: 20,
    currentPage: 1,
  });
  const [messageApiType, contextHolder] = message.useMessage();
  const onChange = (pageNumber) => {
    console.log("onChange Page: ", pageNumber);
  };
  const { confirm } = Modal;

  const DeletAccount = async (item) => {
    try {
      setLoading(true);
      const response = await deleteAccount({
        transactionAccountId: item?.accountId,
      });
      if (response.success === true) {
        await fetchData();
        messageApiType.open({
          type: "success",
          content: "Account deleted successfully",
        });
      } else {
        messageApiType.open({
          type: "error",
          content: "Failed to delete account",
        });
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    }
    setLoading(false);
  };
  const showDeleteConfirm = (Value) => {
    console.log("Value: ", Value);
    confirm({
      title: `Are you sure delete this "${Value.name}" Account?`,
      // icon: <Icon />,
      content: "Press Yes for Permenat Delete",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      cancleType: "danger",
      autoFocusButton() {
        console.log("autoFocusButton");
      },
      centered: true,
      onOk() {
        console.log("OK");
        DeletAccount(Value);
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: true,
      confirmLoading: true,
    });
  };

  const columns = [
    // {
    //   title: "Account ID",
    //   dataIndex: "accountId",
    //   width: "20%",
    //   align: "center",
    //   editable: true,
    //   sorter: (a, b) => a.accountId - b.accountId,
    // },
    {
      title: "Name",
      dataIndex: "name",
      width: "40%",
      editable: true,
      align: "center",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: "30%",
      editable: true,
      align: "center",
      render: (_, record) => {
        return (
          <Space size={12}>
            <div
              style={{ color: `${record?.amountColour}`, fontWeight: "bold" }}
            >
              {record?.balance}
            </div>
          </Space>
        );
      },
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: "Action",
      dataIndex: "Action",
      width: "10%",
      align: "center",
      render: (_, record) => {
        return (
          <Space size={12}>
            <Link to={`/all-account/${record.accountId}`}>
              <EyeIcon
                onClick={() => {
                  console.log("On Show Icone Press", record);
                }}
                className="hovered-icon"
                color={customStyles.colorPrimary}
              />
            </Link>
            {record?.accountTypeId !== 4 && record?.accountTypeId !== 1 && (
              <Link to={`/add-account/${record.accountId}`}>
                <ClipboardEditIcon
                  onClick={() => {
                    console.log("On Edit Icone Press", record);
                  }}
                  className="hovered-icon"
                  color={customStyles.colorSecondary}
                />
              </Link>
            )}

            {record?.accountTypeId !== 4 && record?.accountTypeId !== 1 && (
              <Trash2
                onClick={() => {
                  showDeleteConfirm(record);
                }}
                className="hovered-icon"
                color={customStyles.colorDanger}
              />
            )}
          </Space>
        );
      },
    },
  ];

  const inputData = useDebounce(searchInputValue, 500);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [inputData]);

  const fetchData = async (limit, page) => {
    try {
      setLoading(true);
      const payload = {
        page: page || pagination.currentPage,
        limit: limit || pagination.defaultPageSize,
      };
      
      if (searchInputValue) {
        payload.search = inputData;
      }
      
      const response = await getAllAccount(payload);
      
      if (response.success === true) {
        setData(response.data);
        // setPagination((pre) => ({
        //   ...pre,
        //   total: response.data?.totalPages,
        //   defaultPageSize: response.data?.limit,
        //   currentPage: response.data?.page,
        // }));
        
      } else {
        setData([]);
        // setPagination((pre) => ({
        //   ...pre,
        //   total: 0,
        //   defaultPageSize: 20,
        //   currentPage: 1,
        // }));
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
      });
    }
    setLoading(false);
  };

  // Search 
  const handleSearch = () => {
    console.log("Searching for:", searchInputValue);
    // Call your API here
    fetchData();

  };

  const handleClear = () => {
    setSearchInputValue("");
    console.log("Clear Search for:", searchInputValue);
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
            All Account
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

                <Row justify="space-between" align="top">
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                      <Input
                        placeholder="Search..."
                        value={searchInputValue}
                        prefix={<SearchOutlined style={{ color: "#aaa" }} />}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        style={{ width: 250 }}
                        
                      />
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        disabled={!searchInputValue} // disable if input is empty
                      >
                        Search
                      </Button>
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={()=>{setSearchInputValue(""); handleClear()}}
                        disabled={!searchInputValue}
                      >
                        Clear
                      </Button>
                    </div>
                    </Col>
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

export default AllAccount;
