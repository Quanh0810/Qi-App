import React from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Logo from "../../../assets/images/quiz-logo.png"

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);
      dispatch(HideLoading());
      if(response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-primary" style={{
      position: "relative"
    }}>
      <div className="card w-400 p-3 bg-white form">
        <div className="flex flex-col">
          <h1 className="text-2xl">Qi - REGISTER <i class="ri-user-add-line"></i></h1>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="name" label="Name">
              <input type="text"></input>
            </Form.Item>
            <Form.Item name="email" label="Email">
              <input type="text"></input>
            </Form.Item>
            <Form.Item name="password" label="Password">
              <input type="password"></input>
            </Form.Item>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="primary-contained-btn mt-2 w-100"
              >
                Register
              </button>
              <Link to="/login" className="underline">
                Already a member? Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
      <div className="absolute" style={{
        position: "absolute",
        top: "20px",
        left: "20px"
      }}>
        <img src={Logo} style={{
          width:"60px",
          height:"60px",
          margin: "5px 15px"
        }}/>
        <div style={{
          color:"white",
          margin: "0 20px"
        }}>QiQuiz</div>
      </div>
    </div>
  );
}

export default Register;
