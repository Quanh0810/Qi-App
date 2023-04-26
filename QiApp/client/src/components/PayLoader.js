import React from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

function PayLoader({ loading, price, setLoading, questionId }) {
  const [sdkReady, setSdkReady] = useState(false);

  // xử lý khi thanh toán thành công
  const successPaymentHandler = async (paymentResult) => {
    const res = await axios.post("/api/exams/edit-exam-by-id", {
      examId: questionId,
      isPay: true,
    });
    if (res.status === 200) {
      setLoading(false);
      message.success("Thanh toán thành công");
    }
  };

  window.scroll(0, 0);

  // tích hợp thanh toán
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      // thiết lập thuộc tính để tải mã js
      const script = document.createElement("script");
      script.type = "text/javascript";
      // script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&disable-funding=card`;
      script.async = true;
      // sự kiện onload khi mã được tải xong
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    addPayPalScript();
  }, []);

  return (
    <div className="loader-parent" onClick={() => setLoading(false)}>
      {sdkReady && (
        <PayPalButton
          amount={price}
          onSuccess={successPaymentHandler}
          style={{".paypal-button-card-container:last-of-type": {
            display: "none",
          },}}
          fundingSourcePriority={["paypal"]}
        />
      )}
    </div>
  );
}

export default PayLoader;


