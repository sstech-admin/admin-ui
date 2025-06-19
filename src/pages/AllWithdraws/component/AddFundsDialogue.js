import React, { useCallback, useRef, useState } from "react";
import { Button, Form, Image, notification } from "antd";
import DrawerComponent from "../../../Component/Drawer/DrawerComponent";
import { BgcolorGreenBg } from "../../Investors/Inverstors.styles";
import { updatedTransactionStatus } from "../../../slices/Invester/investerAPI";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";

const AddFundsDialogue = ({data, refetchData}) => {
    const drawerRef = useRef(null);
    const [isProceed, setIsProceed] = useState(false);
    console.log('DATA ADD FUNDS',data)
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
        <DrawerComponent ref={drawerRef} title="View Add Funds Details" trigger={
            <BgcolorGreenBg style={{ padding: "5px 5px", borderRadius: "5px", cursor: 'pointer' }}>-</BgcolorGreenBg>
        }>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Form layout="vertical" name="add_funds" style={{ flexGrow: 1 }}>
                    <p><strong>Add Funds Amount:</strong> {data?.amount}</p>
                    <p><strong>Investor ID</strong> {data?.investorId || ''}</p>
                    <p><strong>Investor Name</strong> {data?.name || ''}</p>
                    <p><strong>Request Type:</strong> {data?.requestType}</p>
                    <p><strong>Date:</strong> {dayjs(data?.date).format("DD MMM YYYY")}</p>
                    <p><strong>Status:</strong> {data?.status}</p>
                    <p><strong>Transaction Reference Number:</strong> {data?.transactionRefNumber}</p>
                    <p>
                    <strong>Transaction Reference Screenshot:</strong> 
                        <Image src={data?.transactionImage} />
                    </p>
                </Form>

                <div style={{
                    position: "sticky",
                    bottom: -20,
                    background: "#fff",
                    padding: "10px 0",
                    borderTop: "1px solid #ddd",
                    justifyContent: "space-between"
                }}>
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

export default AddFundsDialogue;
