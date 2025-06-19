/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
} from "antd";
import dayjs from "dayjs";
import usecustomStyles from "../../Common/Hooks/customStyles";
import { getAccount } from "../../slices/Invester/investerAPI";
import { useNavigate, useParams } from "react-router-dom";
import { formItemLayout, tailFormItemLayout } from "../../Constants/Const";
import Loader from "../../Component/Loader/Loader";
import {
  addAccount,
  updateAccount,
} from "../../slices/generalSetting/generalSettingAPI";

const AddAccount = () => {
  document.title = "home" + process.env.REACT_APP_PAGE_TITLE;
  const initialFields = {
    name: null,
    balance: null,
    asOnDate: null,
    amount: null,
    description: null,
  };

  const customStyles = usecustomStyles();
  const params = useParams();
  const [form] = Form.useForm();
  const [dataLoading, setDataLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const [formfields, setFormFields] = useState({});
  const [messageApiType, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!!params.slug && formfields) {
      form.setFieldsValue({
        ...formfields,
        asOnDate: dayjs(
          dayjs(formfields?.asOnDate).format("DD MMM YYYY"),
          "DD MMM YYYY"
        ),
      });
    } else {
      form.setFieldsValue(initialFields);
    }
  }, [formfields, formfields?.asOnDate, params.slug, form]);
  // TODO: if Edit Account Details then Use Params slug.
  const fetchData = async () => {
    try {
      setDataLoading(true);
      if (!!params.slug) {
        const response = await getAccount({
          accountId: params.slug,
        });
        if (response?.success) {
          setFormFields(await response.data);
        }
      }
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: "error",
        duration: 5,
      });
    }
    setDataLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (item) => {
    try {
      setFormLoading(true);
      const SubmitedItems = {
        name: item?.name,
        balance: item?.balance,
        description: item?.description,
        asOnDate: dayjs(item?.asOnDate).format("YYYY-MM-DD HH:mm:ss"),
      };
      // TODO: Due To Same User ID Edit Role API NOt Working
      if (!!params.slug) {
        await updateAccount({
          ...SubmitedItems,
          transactionAccountId: params.slug,
        });
      } else {
        await addAccount(SubmitedItems);
      }
      navigate("/all-account");
    } catch (error) {
      messageApiType.open({
        type: "error",
        content: error,
        duration: 5,
      });
    }
    setFormLoading(false);
  };
  return (
    <>
      <div>{contextHolder}</div>
      {dataLoading ? (
        <div style={{ marginTop: 100 }}>
          <Loader />
        </div>
      ) : (
        <Row gutter={[24]}>
          <Col
            xs={24}
            className="gutter-row"
            style={{ marginBottom: customStyles.margin }}
          >
            <Card
              title={!!params.slug ? `Update Account` : "Add Account"}
              style={{ margin: `${customStyles.margin}px 0px` }}
            >
              <Form
                {...formItemLayout}
                form={form}
                layout="vertical"
                name="register"
                onFinish={onFinish}
                initialValues={!!params.slug ? formfields : initialFields}
                scrollToFirstError
              >
                <Row gutter={[24, 0]}>
                  {/* name */}
                  <Col xs={24} sm={24} md={12} lg={8}>
                    <Form.Item
                      name="name"
                      label="Name"
                      labelCol={2}
                      disabled
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Account Name!",
                        },
                        { whitespace: true },
                        { min: 3 },
                      ]}
                      hasFeedback={true}
                    >
                      <Input
                        // disabled={!!params.slug}
                        placeholder="Account Name"
                      />
                    </Form.Item>
                  </Col>
                  {/* balance */}
                  <Col xs={24} sm={24} md={12} lg={8}>
                    <Form.Item
                      name="balance"
                      label="Balance"
                      rules={[
                        {
                          required: true,
                          message: "Please Input Transaction amount!",
                        },
                      ]}
                      hasFeedback
                    >
                      <InputNumber
                        placeholder="Balance"
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  {/* dateOfJoining */}

                  <Col xs={24} sm={24} md={12} lg={8}>
                    <Form.Item
                      name="asOnDate"
                      label="As on Date"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Date Of Joining!",
                        },
                      ]}
                      size="small"
                    >
                      <DatePicker
                        name="asOnDate"
                        placeholder="DD MMM YYYY"
                        placement="topLeft"
                        style={{
                          boxShadow: "none",
                          outline: "none",
                          width: "100%",
                        }}
                        format="DD MMM YYYY"
                      />
                    </Form.Item>
                  </Col>

                  {/* description */}
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item name="description" label="Description">
                      <Input.TextArea
                        placeholder="description"
                        showCount
                        maxLength={500}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item {...tailFormItemLayout}>
                      <Button
                        htmlType="submit"
                        type="primary"
                        style={{ width: "100%", margin: "10px 0px 0px" }}
                        loading={formLoading}
                      >
                        {!!params.slug ? `Update Account` : "Add Account"}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default AddAccount;
