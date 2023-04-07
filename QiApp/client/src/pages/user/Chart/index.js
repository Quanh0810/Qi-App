import { Form, Table } from "antd";
import React from "react";
import PageTitle from "../../../components/PageTitle";
import { useState, useEffect, useCallback } from "react";
import { getAllExams } from "../../../apicalls/exams";
import { getAllReportsByReport } from "../../../apicalls/reports";

function Chart() {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Score",
      dataIndex: "score",
      sorter: {
        compare: (a, b) => a.score - b.score,
        multiple: 2,
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      sorter: {
        compare: (a, b) => a.time - b.time,
        multiple: 1,
      },
    },
  ];

  // const data = [
  //   {
  //     key: "1",
  //     name: "John Brown",
  //     score: 98,
  //     time: 60,
  //   },
  //   {
  //     key: "2",
  //     name: "Jim Green",
  //     score: 98,
  //     time: 66,
  //   },
  //   {
  //     key: "3",
  //     name: "Joe Black",
  //     score: 98,
  //     time: 90,
  //   },
  //   {
  //     key: "4",
  //     name: "Jim Red",
  //     score: 88,
  //     time: 99,
  //   },
  // ];

  const [selector, setSelector] = useState([]);
  const [item, setItem] = useState("");
  const [fetchD, setFetchD] = useState([]);


  useEffect(() => {
    new Promise(async() => {
      const res = await getAllExams();
      if (res) {
        setSelector(res.data);
      }
    })
  }, [])
  
  useEffect(() => {
    new Promise(async () => {
      await fetchingData();
    })
  },[item])

  const fetchingData = async() => {
    const res = await getAllReportsByReport({reportId: item});
    if (res) {
      setFetchD(renderData(res.data));
    }
  }

  const renderData = (array) => {
    return array.map((item,index) => {
      return {
        key: index+1,
        name: item?.user?.name,
        score: `${item?.result?.correctAnswer?.length}/${item?.exam?.totalMarks}`,
        time: item?.time,
      }
    })
  }

  //   const onChange = (pagination, filters, sorter, extra) => {
  //     console.log('params', pagination, filters, sorter, extra);
  return (
    <div>
      <PageTitle title="Chart"></PageTitle>
      <div className="divider"></div>

        <select onChange={(e)=> setItem(e.target.value)}>
          {
            selector &&
            selector.length > 0 &&
            selector?.map((e) => (
              <option key={e._id} value={e._id}>{e.name}</option>
            ))
          }
        </select>
      <Table columns={columns} dataSource={fetchD} />
    </div>
  );
}

export default Chart;
