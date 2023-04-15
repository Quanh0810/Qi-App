import { Col, Form, message, Row, Select, Table } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addExam, deleteQuestionById, editExamById, getExamById } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { Tabs, Checkbox } from "antd";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import AddEditQuestion from "./AddEditQuestion";
import { imageUpload } from "../../../util/util";

import { Modal, Upload } from 'antd';
// const {TabPane} = Tabs;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function AddEditExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = React.useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const params = useParams();
  const [form] = Form.useForm();

  const [image, setImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);


  const handleCancel = () => {
    setPreviewOpen(false)
    setFileList([]);
  }
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = async({ fileList: newFileList }) => {
    const newFile = newFileList.map((e) => {
      return {
        ...e,
        status: 'done',

      }
    })
  
    const res = await imageUpload(newFile[0]?.originFileObj)
      if (res) {
        setFileList(newFile)
        setImage(res);
      }

  }
  const uploadButton = (
    <div>
      <i class="ri-file-add-fill"></i>
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const onFinish = async (values) => {
    console.log(values);
    try {
      dispatch(ShowLoading());
      let response;

      if (params.id) {
        response = await editExamById({
          ...values,
          examId: params.id,
          image: image
        });
      } else {
        response = await addExam({...values,isPay: false, image: image});
      }

      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
        if (response?.data?.image) {
          setFileList([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: response?.data?.image,
            },
          ])
          setImage(response?.data?.image)
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        questionId,
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name",
    },
    {
      title: "Options",
      dataIndex: "options",
      render: (text, record) => {
        return Object.keys(record.options).map((key) => {
          return (
            <div>
              {key} : {record.options[key]}
            </div>
          );
        });
      },
    },
    {
      title: "Correct Option",
      dataIndex: "correctOption",
      render: (text, record) => {
        return ` ${record.correctOption} : ${
          record.options[record.correctOption]
        }`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteQuestion(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];

  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
    const errors = form.getFieldError('price');
    if (errors && errors.length > 0) {
      form.setFields([
        {
          name: 'price',
          errors: [],
        },
      ]);
    }
  };

  const handleRemove = (file, fileList) => {
    setFileList([
    ])
    setImage("");
  }

  return (
    <div>
      <PageTitle title={params.id ? "Edit Exam" : "Add Exam"}></PageTitle>
      <div className="divider"></div>
      {(examData || !params.id) && (
        <Form validateOnMount layout="vertical" form={form} onFinish={onFinish} initialValues={examData}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Exam Details" key="1">
              <Row gutter={[20, 10]}>
                <Col span={8}>
                  <Form.Item label="Exam Name" name="name">
                    <input type="text"></input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Exam Duration" name="duration">
                    <input type="number"></input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Category" name="category">
                    <select>
                      <option value="">Select Category</option>
                      <option value="Javascript">Javascript</option>
                      <option value="React">React</option>
                      <option value="Node">Node</option>
                      <option value="MongoDB">MongoDB</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Total Marks" name="totalMarks">
                    <input type="number"></input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Passing Marks" name="passingMarks">
                    <input type="number"></input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Premium"
                    name="premium"
                    valuePropName="checked"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                    
                  >
                    <Checkbox>Premium</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                      { required: isCheckboxChecked, message: 'Please input a value for the input field'}
                    ]}
                  >
                  <input type="number" ></input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-circle"
                    fileList={fileList}
                    maxCount={1}
                    onRemove={handleRemove}
                    onPreview={handlePreview}
                    onChange={handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Col>
              </Row>
              <div className="flex justify-end gap-2">
                <button
                  className="primary-outlined-btn"
                  type="button"
                  onClick={() => navigate("/admin/exams")}
                >
                  Cancel
                </button>
                <button className="primary-contained-btn" type="submit">
                  Save
                </button>
              </div>
            </TabPane>
            {params.id && (
              <TabPane tab="Questions" key="2">
                <div className="flex justify-end">
                  <button
                    className="primary-outlined-btn-add"
                    type="button"
                    onClick={() => setShowAddEditQuestionModal(true)}
                  >
                    Add Question
                  </button>
                </div>

                <Table
                  columns={questionsColumns}
                  dataSource={examData?.questions || []}
                ></Table>
              </TabPane>
            )}
          </Tabs>
        </Form>
      )}
      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        ></AddEditQuestion>
      )}
    </div>
  );
}

export default AddEditExam;
