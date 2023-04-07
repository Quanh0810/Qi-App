import { Button, Space } from "antd";
import "./stylesheets/theme.css";
import "./stylesheets/alignments.css";
import "./stylesheets/textelement.css";
import "./stylesheets/custim-components.css";
import "./stylesheets/form-elements.css";
import "./stylesheets/layout.css";
import "./stylesheets/contact.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/common/Home";
import Exams from "./pages/admin/Exams";
import AddEditExam from "./pages/admin/Exams/AddEditExam";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import WriteExam from "./pages/user/WriteExam";
import UserReports from "./pages/user/UserReports";
import AdminReports from "./pages/admin/AdminReports";
// import Profile from "./pages/user/Profile";
import Users from "./pages/admin/Users";
import Chart from "./pages/user/Chart";
import Contact from "./pages/user/Contact";

function App() {
  const { loading } = useSelector((state) => state.loader);
  const { user } = useSelector((state) => state.users);
  console.log(user)
  return (
    <>
      {loading && <Loader></Loader>}
      <BrowserRouter>
        <Routes>
          {/* common routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* guest route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* user route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/write-exam/:id"
            element={
              <ProtectedRoute>
                <WriteExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute>
                <UserReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/user/chart"
            element={
              <ProtectedRoute>
                <Chart />
              </ProtectedRoute>
            }
          /> 
          {/* admin route */}
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exams/add"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exams/edit/:id"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
