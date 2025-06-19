import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Button, Form, Input, Upload, notification } from "antd";
import DrawerComponent from "../../../Component/Drawer/DrawerComponent";
import { Loader2, Minus, Plus } from "lucide-react";
import { AddFunds } from "../../../slices/Invester/investerAPI";

const AddFundsComponent = ({ data, onSuccess }) => {
    const [form] = Form.useForm();
    const [isProceed, setIsProceed] = useState(false);
    const drawerRef = useRef(null);

    const [amount, setAmount] = useState(500000); // Start from 500,000
    const step = 500000;
    const minAmount = 500000;
    
    const increaseAmount = () => {
        const newAmount = amount + step;
        setAmount(newAmount);
        form.setFieldsValue({ withdraw_amount: newAmount });
    };
    
    const decreaseAmount = () => {
        if (amount > minAmount) {
            const newAmount = amount - step;
            setAmount(newAmount);
            form.setFieldsValue({ withdraw_amount: newAmount });
        }
    };

    const formValues = useMemo(() => ({
        bank_name_as_per: data?.nameAsPerPanCard || "",
        bank_name: data?.bankName || "",
        account_number: data?.bankAccountNumber || "",
        ifsc: data?.ifscCode || "",
        withdraw_amount: amount
        
    }), [data, drawerRef]);

    useEffect(() => {
        form.setFieldsValue(formValues);
    }, [formValues, form]);
    
    const onSubmitAddFunds = useCallback(async (values) => {
        setIsProceed(true);
        console.log('DATA >>>', data)
        try {
            const transaction_img_file = values.transaction_img?.[0]?.originFileObj;
            const addFundsBodyData = {
                amount: values.withdraw_amount,
                transactionalBankId: data?.transactionalBankId,
                investorId: data?.id,
                transactionRefNumber: values.transaction_ref,
                transactionImage: transaction_img_file,
            };

            await AddFunds(addFundsBodyData);

            form.setFieldsValue({
                withdraw_amount: undefined,
                transaction_ref: undefined,
            });

            drawerRef.current?.closeDrawer();
                
            // Trigger the parent's callback if provided
            if (onSuccess && typeof onSuccess === "function") {
                onSuccess(); // or just onSuccess() if you don't need to pass data
            }
            notification.success({
                message: "Success",
                description: "Funds details have been added successfully.",
                placement: "bottomRight",
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: error?.message || "Something went wrong!",
                placement: "bottomRight",
            });
        } finally {
            setIsProceed(false);
        }
    }, [data, form]);

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isImage) {
            notification.error({ message: "Only image files are allowed." });
            return Upload.LIST_IGNORE;
        }
        if (!isLt5M) {
            notification.error({ message: "File must be smaller than 5MB." });
            return Upload.LIST_IGNORE;
        }
        return true;
    };
    return (
        <DrawerComponent ref={drawerRef} title="Add Funds" trigger={<Button style={{ marginRight: "10px" }}>Add Funds</Button>}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Form form={form} layout="vertical" name="add_funds" onFinish={onSubmitAddFunds} style={{ flexGrow: 1 }}>
                    <Form.Item label="Investment Amount" name="withdraw_amount" rules={[{ required: true, message: "Please enter the amount" }]}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Button
                                style={{
                                    borderRadius: "50%",
                                    height: "25px",
                                    width: "25px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 0,
                                }}
                                onClick={decreaseAmount}
                                disabled={amount === minAmount}
                            >
                                <Minus size={20}/>
                            </Button>

                            <span style={{ fontSize: "16px", fontWeight: "bold", minWidth: "120px", textAlign: "center" }}>
                                {amount.toLocaleString()}
                            </span>

                            <Button
                                style={{
                                    borderRadius: "50%",
                                    height: "25px",
                                    width: "25px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 0,
                                }}
                                onClick={increaseAmount}
                            >
                                <Plus size={20} />
                            </Button>
                        </div>

                    </Form.Item>

                    <p style={{ fontSize: "16px" }}>Bank Details</p>
                    <Form.Item label="Name As Per Bank" name="bank_name_as_per" rules={[{ required: true, message: "Please enter your name" }]}>
                        <Input placeholder="Enter name as per bank" disabled style={{color: '#36454F'}}/>
                    </Form.Item>
                    <Form.Item label="Bank Name" name="bank_name" rules={[{ required: true, message: "Please enter bank name" }]}>
                        <Input placeholder="Enter bank name" disabled style={{color: '#36454F'}}/>
                    </Form.Item>
                    <Form.Item label="Account Number" name="account_number" rules={[{ required: true, message: "Please enter account number" }]}>
                        <Input type="number" placeholder="Enter account number" disabled style={{color: '#36454F'}}/>
                    </Form.Item>
                    <Form.Item label="IFSC Code" name="ifsc" rules={[{ required: true, message: "Please enter IFSC code" }]}>
                        <Input placeholder="Enter IFSC code" disabled style={{color: '#36454F'}}/>
                    </Form.Item>

                    <p style={{ fontSize: "16px" }}>Transaction Details</p>
                    <Form.Item label="Transaction Reference Number" name="transaction_ref" rules={[{ required: true, message: "Please enter transaction reference" }]}>
                        <Input placeholder="Enter transaction reference number" />
                    </Form.Item>
                    <Form.Item label="Upload Screenshot" name="transaction_img" valuePropName="fileList" getValueFromEvent={(e) => e.fileList} rules={[{ required: true, message: "Please upload a screenshot" }]}>
                        <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                            <Button>Select File (Max: 5MB)</Button>
                        </Upload>
                    </Form.Item>
                </Form>

                {/* Sticky Submit Button */}
                <div style={{
                    position: "sticky",
                    bottom: -22,
                    background: "#fff",
                    padding: "10px 0",
                    borderTop: "1px solid #ddd",
                }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        form="add_funds"
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                        disabled={isProceed}
                    >
                        {isProceed && <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />}
                        {isProceed ? "Processing..." : "Proceed"}
                    </Button>
                </div>
            </div>

            {/* Spin Animation Style */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </DrawerComponent>
    );
};

export default AddFundsComponent;
