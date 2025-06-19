import React, { useCallback, useRef, useState } from "react";
import { Button, Form, notification } from "antd";
import DrawerComponent from "../../../Component/Drawer/DrawerComponent";
import { BgcolorGreenBg } from "../../Investors/Inverstors.styles";
import { updatedTransactionStatus } from "../../../slices/Invester/investerAPI";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";

const WithdrawDialogue = ({ data, refetchData }) => {
    const [form] = Form.useForm();
    const drawerRef = useRef(null);
    const [isProceed, setIsProceed] = useState(false);

    const handleTransaction = useCallback(async (status) => {
        setIsProceed(true);
        try {
            const updatedTransactionStatusBodyData = {
                transactionId: data?.transactionId,
                transactionStatusId: status,
            };

            await updatedTransactionStatus(updatedTransactionStatusBodyData);
            drawerRef.current?.closeDrawer();
            notification.success({
                message: status === 1 ? "Approved" : "Rejected",
                description: status === 1
                    ? "Transaction request has been approved."
                    : "Transaction request has been rejected.",
                placement: "bottomRight",
            });
            refetchData();
        } catch (error) {
            notification.error({
                message: "Error",
                description: error?.message || "Something went wrong!",
                placement: "bottomRight",
            });
        } finally {
            setIsProceed(false);
        }
    }, [data]);
    return (
        <DrawerComponent ref={drawerRef} title="View Withdraw Details" trigger={
            <BgcolorGreenBg style={{ padding: "5px 5px", borderRadius: "5px", cursor: "pointer" }}>-</BgcolorGreenBg>
        }>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Form form={form} layout="vertical" name="withdraw_funds" style={{ flexGrow: 1 }}>
                    <p><strong>Withdraw Amount:</strong> {data?.amount}</p>
                    <p><strong>Investor ID</strong> {data?.investorId || ''}</p>
                    <p><strong>Investor Name</strong> {data?.name || ''}</p>
                    <p><strong>Request Type:</strong> {data?.requestType}</p>
                    <p><strong>Date:</strong> {dayjs(data?.date).format("DD MMM YYYY")}</p>
                    <p><strong>Status:</strong> {data?.status}</p>
                </Form>

                <div style={{ position: "sticky", bottom: -20, background: "#fff", padding: "10px 0", borderTop: "1px solid #ddd", justifyContent: "space-between" }}>
                    <Button
                        type="primary"
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                        onClick={() => handleTransaction(1)} // Calls handleTransaction only on button click
                        disabled={isProceed}
                    >
                        {isProceed && <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />}
                        {isProceed ? "Processing..." : "Approve"}
                    </Button>

                    <Button
                        type="default"
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            marginTop: "10px"
                        }}
                        onClick={() => handleTransaction(2)} // Calls handleTransaction only on button click
                        disabled={isProceed}
                    >
                        {isProceed && <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />}
                        {isProceed ? "Processing..." : "Reject"}
                    </Button>
                </div>
            </div>
        </DrawerComponent>
    );
};

export default WithdrawDialogue;