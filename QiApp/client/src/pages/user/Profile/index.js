import { Button, Col, Form, Input, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfo } from "../../../apicalls/users";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Profile() {
  const { user } = useSelector((state) => state.users);
  console.log(user);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const [profiles, setProfiles] = React.useState([]);
  // const params = useParams();

  // const getProfile = async () => {
  //   try {
  //     dispatch(ShowLoading());
  //     const response = await getUserInfo({});
  //     dispatch(HideLoading());
  //     if (response.success) {
  //       setProfiles(response.data);
  //     } else {
  //       message.error(response.message);
  //     }
  //   } catch (error) {
  //     dispatch(HideLoading());
  //     message.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   getProfile();
  // }, []);

  const initialValues = {
    name : user?.name,
    email : user?.email
  }
  console.log(initialValues);

  return (
    <div>
      <PageTitle title="Contact"></PageTitle>
      <div className="divider"></div>

      <div>
        <Row className="profileContainer">
          <Col md={14}>
            <Form initialValues={initialValues}>
              <Form.Item name="name" className="pb-1">
                <label>Name</label>
                <input className="unchanged-input" readOnly></input>
              </Form.Item>
              <Form.Item name="email" className="pb-1">
                <label>Email</label>
                <input type="email" className="unchanged-input" readOnly></input>
              </Form.Item>
              <div className="divider-profile"></div>
              <div className="label-category ">
                <span className="icon-category">
                  <i class="ri-lock-2-fill"></i>
                </span>
                <span className="name-category">Password</span>
              </div>
              <Form.Item className="pb-1">
                <label>Old Password</label>
                <input type="password"></input>
              </Form.Item>
              <Form.Item className="pb-1">
                <label>New Password</label>
                <input type="password"></input>
              </Form.Item>
              <Form.Item className="pb-1">
                <label>Confirm Password</label>
                <input type="password"></input>
              </Form.Item>
              <Button className="primary-contained-btn-profile">
                Update Password
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Profile;
