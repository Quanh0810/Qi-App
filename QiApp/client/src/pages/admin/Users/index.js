import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../../../components/PageTitle";
import moment from "moment";
import {
  deleteUserInfo,
  getAllUserInfo,
  getUserInfo,
} from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { message, Table } from "antd";
import { useNavigate } from "react-router-dom";

function Users() {
  const [usersData, setUsersData] = React.useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllUserInfo();

      if (response.success) {
        const userArr = response.data.map((user) => {
          return {
            name: user?.name,
            date: user?.createdAt,
            email: user?.email,
          };
        });
        setUsersData(userArr);
        // console.log("a", response.data)
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // loi khong xoa duoc user
  const deleteUser = async (userName) => {
    try {
      dispatch(ShowLoading());

      const response = await deleteUserInfo({ userName });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        const userList = await getAllUserInfo();
        const userArr = userList.data.map((user) => {
          return {
            name: user?.name,
            date: user?.createdAt,
            email: user?.email,
          };
        });
        setUsersData(userArr);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      render: (text, record) => <>{record?.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (text, record) => <>{record?.email}</>,
    },
    {
      title: "Action",
      dataIndex: "action",
      // render: (text, record) => console.log(record)
      render: (text, record) => (
        <i
          class="ri-delete-bin-5-line"
          onClick={() => deleteUser(record?.name)}
        ></i>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <PageTitle title="User Infomation"></PageTitle>
      <div className="divider"></div>
      <Table columns={columns} dataSource={usersData} className="mt-2" />
    </div>
  );
}

export default Users;
