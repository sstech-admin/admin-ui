import React, { useRef, useState, useEffect } from "react";
import { Button, Form, Input, notification, Radio } from "antd";
import DrawerComponent from "../../../Component/Drawer/DrawerComponent";
import { Landmark, Loader2, Minus, Plus } from "lucide-react";
import { withdrawFunds } from "../../../slices/Invester/investerAPI";

const Withdraw = ({ data, withdrawData, onSuccess }) => {
    const [form] = Form.useForm();
    const [isProceed, setIsProceed] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawType, setWithdrawType] = useState("capital");
    const [tdsDeduction, setTdsDeduction] = useState(0);
    const [tdsPercent, setTdsPercent] = useState(10);
    const [finalAmount, setFinalAmount] = useState(0); // New state for after TDS deduction
    const [availableWithdrawBalance, setAvailableWithdrawBalance] = useState(0);
    const [availableProfitLossBalance, setAvailableProfitLossBalance] = useState(1500000);
    const drawerRef = useRef(null);

    const [error, setError] = useState("");
    useEffect(() => {
        if (data) {
            console.log('DATA', data)
            form.setFieldsValue({
                bank_name_as_per: data.nameAsPerPanCard || "",
                bank_name: data.bankName || "",
                account_number: data.bankAccountNumber || "",
                ifsc: data.ifscCode || "",
                withdraw_type: withdrawType
            });
            
        }
        setAvailableWithdrawBalance(withdrawData?.data?.capitalAmount)
        setAvailableProfitLossBalance(withdrawData?.data?.pnlAmount)
    }, [data, withdrawData ,form, withdrawType]);

    const handleAmountChange = (type) => {
        setWithdrawAmount((prev) => {
            let newAmount = type === "increment" ? prev + 500000 : prev - 500000;
            if (newAmount < 0) newAmount = 0;
            if (newAmount > availableWithdrawBalance) newAmount = availableWithdrawBalance;

            // Calculate TDS deduction
            let deduction = withdrawType === "profit" && newAmount >= 0 ? newAmount * 0.1 : 0;
            setTdsDeduction(deduction);
            setFinalAmount(newAmount - deduction);

            return newAmount;
        });
    };

    const handleWithdrawTypeChange = (e) => {
        form.setFieldsValue({ withdraw_type: withdrawType });
        setWithdrawType(e.target.value);
        setWithdrawAmount(0);
        setTdsDeduction(0);
        setFinalAmount(0);
    };

    const handleProfitAmountChange = (e) => {
        let amount = Number(e.target.value);
        if (amount > availableProfitLossBalance) {
            setError(`Amount cannot exceed available balance (${availableProfitLossBalance})`);
        } else {
            setError("");
        }
        if (amount < 0) {
            amount = 0;
        }

        let deduction = amount >= 0 ? amount * 0.1 : 0;
        let final = amount - deduction;

        setWithdrawAmount(amount);
        setTdsDeduction(deduction);
        setFinalAmount(final);
    };

    const onSubmiWithdrawFunds = async () => {
        if (withdrawAmount <= 0) {
            notification.error({
                message: "Error",
                description: "Withdraw amount must be greater than zero",
                placement: "bottomRight",
            });
            return;
        }

        setIsProceed(true);
        const withdrawFundsBodyData = {
            amount: finalAmount,
            type: withdrawType,
            transactionalBankId: data.transactionalBankId,
            investorId: data.id,
        };

        await withdrawFunds(withdrawFundsBodyData);

        setWithdrawAmount(0);
        setFinalAmount(0);
        setTdsDeduction(0);
        drawerRef.current?.closeDrawer();
        // Trigger the parent's callback if provided
        if (onSuccess && typeof onSuccess === "function") {
            onSuccess(); // or just onSuccess() if you don't need to pass data
        }
        setIsProceed(false);

        notification.success({
            message: "Success",
            description: "Transaction created successfully",
            placement: "bottomRight",
        });
    };

    return (
        <DrawerComponent ref={drawerRef} title="Withdraw" trigger={<Button style={{ marginRight: "10px" }}>Withdraw</Button>}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Form form={form} layout="vertical" name="withdraw_funds" style={{ flexGrow: 1 }}>
                    <Form.Item label="Withdraw Type" name="withdraw_type">
                        <Radio.Group onChange={handleWithdrawTypeChange} value={withdrawType}>
                            <Radio value="capital">Capital</Radio>
                            <Radio value="profitOrLoss">Profit</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {withdrawType === "capital" ? (
                        <>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", fontWeight: 'bold', marginTop: '10px' }}>
                                <p>Withdrawal Amount: </p>
                                <p>₹{availableWithdrawBalance.toLocaleString()}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: '100%', marginBottom: '20px' }}>
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
                                    onClick={() => handleAmountChange("decrement")}
                                    disabled={withdrawAmount <= 0}
                                >
                                    <Minus size={20} />
                                </Button>

                                <span style={{ fontSize: "16px", fontWeight: "bold", minWidth: "120px", textAlign: "center" }}>
                                    {withdrawAmount.toLocaleString()}
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
                                    onClick={() => handleAmountChange("increment")}
                                    disabled={withdrawAmount >= availableWithdrawBalance}
                                >
                                    <Plus size={20} />
                                </Button>
                            </div>
                            <div style={{ background: "#eee", padding: "10px", marginBottom: '20px', borderRadius: '10px' }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontWeight: 'bold',
                                    gap: "10px",
                                    marginBottom: '10px'
                                }}>
                                    <span style={{
                                        padding: '5px',
                                        background: '#FFF',
                                        borderRadius: '50px',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center' /* Centers the icon inside */
                                    }}>
                                        <Landmark size={20} />
                                    </span>
                                    <p style={{ margin: 0 }}>Capital Details</p> {/* Remove unwanted margin */}
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", fontWeight: 'bold' }}>
                                    <p>Withdraw Type: </p>
                                    <p style={{textTransform: 'capitalize'}}>{withdrawType === 'profitOrLoss' ? 'Profit' : withdrawType}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", color: '#468e39', fontWeight: 'bold' }}>
                                    <p>Total Amount:  </p>
                                    <p>₹{withdrawAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", fontWeight: 'bold', marginTop: '10px' }}>
                                <p>Withdrawal Amount: </p>
                                <p>₹{availableProfitLossBalance.toLocaleString()}</p>
                            </div>
                            <Form.Item
                                label="Enter Profit Amount"
                                name="profit_amount"
                                validateStatus={error ? "error" : ""}
                                help={error}
                                rules={[{ required: true, message: "Please enter amount" }]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={withdrawAmount}
                                    onChange={handleProfitAmountChange}
                                    min={50000}
                                    max={availableProfitLossBalance}
                                    style={{ appearance: "textfield" }}
                                />
                            </Form.Item>

                            <div style={{ background: "#eee", padding: "10px", borderRadius: '10px' }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontWeight: 'bold',
                                    gap: "10px",
                                    marginBottom: '10px'
                                }}>
                                    <span style={{
                                        padding: '5px',
                                        background: '#FFF',
                                        borderRadius: '50px',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center' /* Centers the icon inside */
                                    }}>
                                        <Landmark size={20} />
                                    </span>
                                    <p style={{ margin: 0 }}>Profit Details</p> {/* Remove unwanted margin */}
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", fontWeight: 'bold' }}>
                                    <p>Withdraw Type: </p>
                                    <p style={{textTransform: 'capitalize'}}>{withdrawType === 'profitOrLoss' ? 'Profit' : withdrawType}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <p>Withdraw Amount:  </p>
                                    <p>₹{withdrawAmount.toLocaleString()}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <p>TDS Percentage:  </p>
                                    <p>{tdsPercent}%</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <p>TDS Amount:  </p>
                                    <p>- ₹{tdsDeduction.toLocaleString()}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderTop: '1px dashed' }}>
                                    <p style={{ marginTop: '10px', color: '#468e39', fontWeight: 'bold' }}>Total Amount: </p>
                                    <p style={{ marginTop: '10px', color: '#468e39', fontWeight: 'bold' }}>₹{finalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </>
                    )}

                    <p style={{ fontSize: "16px", marginTop: '10px' }}>Bank Details</p>
                    <Form.Item label="Name As Per Bank" name="bank_name_as_per" rules={[{ required: true, message: "Please enter your name" }]}>
                        <Input placeholder="Enter name as per bank" disabled style={{color: '#36454F'}}/>
                    </Form.Item>
                    <Form.Item label="Bank Name" name="bank_name" rules={[{ required: true, message: "Please enter bank name" }]}>
                        <Input placeholder="Enter bank name" disabled style={{color: '#36454F'}}/>
                    </Form.Item>
                    <Form.Item label="Account Number" name="account_number" rules={[{ required: true, message: "Please enter account number" }]}>
                        <Input type="number" placeholder="Enter account number" style={{ appearance: "textfield" , color: '#36454F' }} disabled/>
                    </Form.Item>
                    <Form.Item label="IFSC Code" name="ifsc" rules={[{ required: true, message: "Please enter IFSC code" }]}>
                        <Input placeholder="Enter IFSC code" disabled style={{color: '#36454F'}}/>
                    </Form.Item>
                </Form>
                <div style={{
                    position: "sticky",
                    bottom: -22,
                    background: "#fff",
                    padding: "10px 0",
                    borderTop: "1px solid #ddd",
                }}>
                    <Button
                        type="primary"
                        onClick={onSubmiWithdrawFunds}
                        style={{ width: "100%" }}
                        disabled={isProceed || withdrawAmount <= 0 || (withdrawType === "capital" ? withdrawAmount > availableWithdrawBalance : withdrawAmount > availableProfitLossBalance) || error}
                    >
                        {isProceed ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Proceed"}
                    </Button>
                </div>
                <style>
                    {`
                        input[type=number]::-webkit-inner-spin-button, 
                        input[type=number]::-webkit-outer-spin-button { 
                            -webkit-appearance: none; 
                            margin: 0; 
                        }
                    `}
                </style>
            </div>
        </DrawerComponent>
    );
};

export default Withdraw;
