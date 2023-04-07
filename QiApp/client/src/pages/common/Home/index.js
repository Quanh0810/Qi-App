import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import PayLoader from "../../../components/PayLoader";

function Home() {
  const [exams, setExams] = React.useState([]);
  const [examsPremium, setExamsPremium] = React.useState([]);
  const [sdk, setSdk] = useState(false);
  const [price, setPrice] = useState('');
  const [questionId, setQuestionId] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        const newArr = response.data
          .filter((item) => item.premium === true);
          const exams = response.data
          .filter((item) => item.premium !== true);
        setExamsPremium(newArr);
        setExams(exams);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getExams();
  }, [sdk]);

  const handlePayment = (exam) => {
    setSdk(true);
    setPrice(exam.price);
    setQuestionId(exam._id);
  }

  return (
    user && (
      <div>
        <PageTitle title={`Hi ${user?.name}, Welcome to Qi`} />
        <div className="divider"></div>
        <Row gutter={[16, 16]}>
          {exams.map((exam) => (
            <Col span={6}>
              <div className="card-lg flex flex-col gap-1 p-2">
                <h1 className="text-2xl">{exam?.name}</h1>

                <h1 className="text-md">Category : {exam.category}</h1>

                <h1 className="text-md">Total Marks : {exam.totalMarks}</h1>
                <h1 className="text-md">Passing Marks : {exam.passingMarks}</h1>
                <h1 className="text-md">Duration : {exam.duration}</h1>

                <button
                  className="primary-outlined-btn"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  Start Exam
                </button>
              </div>
            </Col>
          ))}
        </Row>
        <PageTitle title={`Premium`} className="mt-4" />
        <p style={{ color: 'red', fontStyle: 'italic' }}>Please pay before use</p>
        <div className="divider"></div>
        <Row gutter={[16, 16]}>
          {examsPremium.map((exam) => (
            <Col span={6} className="mb-3">
              <div className="card-lg flex flex-col gap-1 p-2">
                <h1 className="text-2xl">{exam?.name}</h1>

                <h1 className="text-md">Category : {exam.category}</h1>
                <h1 className="text-md font-weight-bold" style={{ fontWeight: 'bold', color : 'red' }}>Price : {exam.price}$</h1>
                <h1 className="text-md">Total Marks : {exam.totalMarks}</h1>
                <h1 className="text-md">Passing Marks : {exam.passingMarks}</h1>
                <h1 className="text-md">Duration : {exam.duration}</h1>

                {
                  exam?.isPay ? (
                    <button
                  className="primary-outlined-btn"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  Start Exam
                </button>
                  ) : (
                    <button
                    className="danger-outlined-btn"
                    onClick={() => handlePayment(exam)}
                  >
                    Please Pay
                  </button>
                  )
                }
              </div>
            </Col>
          ))}
        </Row>
        {
          sdk && (
            <PayLoader loading={sdk} price={price} questionId={questionId} setLoading={setSdk}/>
          )
        }
      </div>
    )
  );
}

export default Home;
