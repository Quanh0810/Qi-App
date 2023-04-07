import { Form, message, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
  selectedQuestion,
  setSelectedQuestion
}) {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        exam: examId,
      };

      let response 
      if(selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: selectedQuestion._id
        })
      }else {
        response = await addQuestionToExam(requiredPayload);
      }
      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      setSelectedQuestion(null)
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={selectedQuestion ? "Edit Question" : "Add Question"}
      open={showAddEditQuestionModal}
      footer={false}
      onCancel={() => {
        setShowAddEditQuestionModal(false)
        setSelectedQuestion(null)
      }}
    >
      <div className="divider"></div>
      <Form onFinish={onFinish} layout="vertical"
      initialValues={{
        name: selectedQuestion?.name,
        A: selectedQuestion?.options?.A,
        B: selectedQuestion?.options?.B,
        C: selectedQuestion?.options?.C,
        D: selectedQuestion?.options?.D,
        correctOption: selectedQuestion?.correctOption,
      }}>

        <Form.Item name="name" label="Quesion">
          <input type="text"></input>
        </Form.Item>
        <Form.Item name="correctOption" label="Correct Option">
          <input type="text"></input>
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item name="A" label="Option A">
            <input type="text"></input>
          </Form.Item>
          <Form.Item name="B" label="Option B">
            <input type="text"></input>
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item name="C" label="Option C">
            <input type="text"></input>
          </Form.Item>
          <Form.Item name="D" label="Option D">
            <input type="text"></input>
          </Form.Item>
        </div>

        <div className="flex justify-end mt-2 gap-4">
          <button
            className="primary-outlined-btn"
            type="button"
            onClick={() => setShowAddEditQuestionModal(false)}
          >
            Cancel
          </button>
          <button className="primary-contained-btn">Save</button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditQuestion;
