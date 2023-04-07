const { default: axiosInstance } = require(".");

// add report
export const addReport = async (payload) => {
    console.log(payload)
    try {
        const response = await axiosInstance.post("/api/reports/add-report", payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// get all reports
export const getAllReports = async (filters) => {
    try {
        const response = await axiosInstance.post("/api/reports/get-all-reports" , filters);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
} 

// get all reports by user
export const getAllReportsByUser = async () => {
    try {
        const response = await axiosInstance.post("/api/reports/get-all-reports-by-user");
        console.log(response);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getAllReportsByReport = async (params) => {
    try {
        const response = await axiosInstance.post("/api/reports/get-all-reports-by-report",params);
        console.log(response);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}