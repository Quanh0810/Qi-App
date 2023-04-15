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

  const handleCheck = (status,exam) => {
    if (status) {
      navigate(`/user/write-exam/${exam._id}`)
    } else {
      handlePayment(exam)
    }
  }

  return (
    user && (
      <div>
        <PageTitle title={`Hi ${user?.name}, Welcome to Qi`} />
        <div className="divider"></div>
        <h2 className="title-home">Bộ câu hỏi cơ bản</h2>
        <Row className="d-flex align-item-center justify-content-center">
          {exams.map((exam) => (
            <Col span={6} className="m-3">
              <div className="card-lg flex flex-col slide-img" onClick={() => navigate(`/user/write-exam/${exam._id}`)}>
                <img src={exam.image} className="img-post" alt="" />
                <h1 className="text-xl p-2  font-bold">{exam?.name}</h1>

                <h1 className="text-sm p-2  text-slate-300">{exam?.questions.length} Questions</h1>
              </div>
            </Col>
          ))}
        </Row>
        <div className="divider"></div>
        <h2 className="title-home my-3">Bộ câu hỏi trả phí</h2>
        <Row className="d-flex align-item-center justify-content-center">
          {examsPremium.map((exam) => (
            <Col span={6} className="mb-3">
              <div className="card-lg flex flex-col slide-img mr-ad" onClick={()=>handleCheck(exam?.isPay, exam)}>
              <img src={exam.image} className="img-post" alt="" />
                <h1 className="text-xl px-2 p-1 font-bold">{exam?.name}</h1>

                <h1 className="text-md px-2 font-weight-bold" style={{ fontWeight: 'bold', color : 'red' }}>Price : {exam.price}$</h1>

                {
                  exam?.isPay ? (
                    <h1 className="text-md px-2 p-2 font-sm text-slate-300">Đã thanh toán</h1>
                    
                    ): (
                    <h1 className="text-md px-2 p-2 font-sm text-slate-300">Chưa thanh toán</h1>
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
