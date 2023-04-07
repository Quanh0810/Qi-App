const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.post("/api/users/get-user-info");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAllUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-all-user-info");
    // console.log(response)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteUserInfo = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/delete-user-by-id", payload);
    // console.log("user", response)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


