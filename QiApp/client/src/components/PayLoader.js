import React from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

function PayLoader({ loading, price, setLoading,questionId }) {
    const [sdkReady, setSdkReady] = useState(false);

  const successPaymentHandler = async(paymentResult) => {
      const res = await axios.post('/api/exams/edit-exam-by-id', { examId: questionId,isPay: true });
      if (res.status === 200) {
          setLoading(false);
          message.success('Thanh toán thành công');
      }
  };

    window.scroll(0, 0);
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    // if (!order || successPay) {
    //   dispatch({ type: ORDER_PAY_RESET });
    //   dispatch(getOrderDetails(orderId));
    // } else if (!order.isPaid) {
    //   if (!window.paypal) {
    //     addPayPalScript();
    //   } else {
    //     setSdkReady(true);
    //   }
    // }
    addPayPalScript();
  }, []);

  return (
    <div className="loader-parent" onClick={() => setLoading(false)}>
        {sdkReady && ( <PayPalButton amount={price} onSuccess={successPaymentHandler} />)}
    </div>
  );
}

export default PayLoader;
