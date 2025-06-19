/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Typography,
  message,
  Space,
  Form,
  Alert
} from "antd";
import { FileExcelOutlined , ExclamationCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import { convertExcel } from "../../helpers/ConvertExcel";
import {exportPayoutTds} from "../../slices/Invester/investerAPI";
const PayoutTds = () => {
  document.title = "Payout Tds" + process.env.REACT_APP_PAGE_TITLE;

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  const [exportLoading, setExportLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const typeOptions = ["All", "Payout"];
  const convertDateFormat = (inputDate, type = "fromDate") => {
    if (!inputDate) return null;
  
    const date = dayjs(inputDate);
  
    if (type === "toDate") {
      return date.endOf("day").toISOString(); // 23:59:59.999
    }
  
    // Default to "fromDate"
    return date.startOf("day").toISOString(); // 00:00:00.000
  };

  const exportCsv = async () => {
    try {
      setExportLoading(true);
      const exportResponse = await exportPayoutTds({ 
        type: selectedType ? selectedType : 'All',
        fromDate: convertDateFormat(fromDate, "fromDate"),
        toDate: convertDateFormat(toDate, "toDate"),
      });
      convertExcel(exportResponse?.data?.buffer?.data, exportResponse?.data?.filename)
      setExportLoading(false);
      setSelectedType('All')
      setFromDate(null)
      setToDate(null)
    } catch (error) {
      setExportLoading(false);
      console.error('CSV Export Failed:', error);
    }
  };

  return (
    <>
      {contextHolder}
      <Row gutter={[24]} justify="space-between">
        <Col xs={24} md={6}>
          <Typography.Title level={5} style={{ margin: "16px 0" }}>
            Payout TDS
          </Typography.Title>
        </Col>
      </Row>

      <Row gutter={[24]}>
        <Col xs={24}>
        <Card>
          <Row gutter={[24, 24]} align="top" style={{ marginTop: 20 }}>
            <Col>
              <Form.Item label={<Typography.Text strong>From Date</Typography.Text>}>
                <DatePicker
                  placeholder="DD MMM YYYY"
                  format="DD MMM YYYY"
                  value={fromDate}
                  onChange={(date) => setFromDate(date)}
                  style={{ width: 160 }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item label={<Typography.Text strong>To Date</Typography.Text>}>
                <DatePicker
                  placeholder="DD MMM YYYY"
                  format="DD MMM YYYY"
                  value={toDate}
                  onChange={(date) => setToDate(date)}
                  style={{ width: 160 }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item label={<Typography.Text strong>Type</Typography.Text>}>
                <Select
                  value={selectedType}
                  onChange={(value) => setSelectedType(value)}
                  style={{ width: 160 }}
                  options={typeOptions.map((type) => ({
                    label: type,
                    value: type,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  onClick={() => exportCsv()}
                  disabled={exportLoading}
                  loading={exportLoading}
                  style={{ width: 160 }}
                >
                  <FileExcelOutlined style={{ marginRight: 8 }} />
                  Export
                </Button>
              </Form.Item>
            </Col>
          </Row>

          {/* Warning section below form */}
            <div
              style={{
                marginTop: 24,
                backgroundColor: '#393E46',
                color: '#fff',
                borderRadius: 8,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 24, marginTop: 2, color: '#faad14' }}>
                <ExclamationCircleFilled />
              </div>

              <div>
                <div style={{ color: '#faad14', fontWeight: 600, fontSize: 16 }}>
                  Large amount of data included
                </div>
                <div style={{ marginTop: 4, fontSize: 14, color: '#e0e0e0' }}>
                  You’re about to queue a large amount of data that may take a while to export and appear in your email. Consider picking a different date range.
                </div>
              </div>
            </div>

        </Card>
        </Col>
      </Row>
    </>
  );
};

export default PayoutTds;
