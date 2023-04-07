import { Form, Table } from "antd";
import React from "react";
import PageTitle from "../../../components/PageTitle";
import { useState, useEffect, useCallback } from "react";
import { getAllExams } from "../../../apicalls/exams";
import { getAllReportsByReport } from "../../../apicalls/reports";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";

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
  const [stat, setStat] = useState([]);

  useEffect(() => {
    new Promise(async () => {
      const res = await getAllExams();
      if (res) {
        setSelector(res.data);
      }
    });
  }, []);

  useEffect(() => {
    new Promise(async () => {
      await fetchingData();
    });
  }, [item]);

  const convertStat = (stat) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      // "May",
    ];

    const outputArray = months.map((month) => {
      const matchingObject = stat.find((obj) => obj.month === month);
      if (matchingObject) {
        return { Total: matchingObject.count, name: month };
      } else {
        return { Total: 0, name: month };
      }
    });

    return outputArray;
  };

  const fetchingData = async () => {
    const res = await getAllReportsByReport({ reportId: item });
    if (res) {
      setFetchD(renderData(res.data.reports));
      setStat(convertStat(res.data.stat));
    }
  };

  const renderData = (array) => {
    return array.map((item, index) => {
      return {
        key: index + 1,
        name: item?.user?.name,
        score: `${item?.result?.correctAnswer?.length}/${item?.exam?.totalMarks}`,
        time: item?.time,
      };
    });
  };

  //   const onChange = (pagination, filters, sorter, extra) => {
  //     console.log('params', pagination, filters, sorter, extra);
  return (
    <div>
      <PageTitle title="Chart"></PageTitle>
      <div className="divider"></div>

      <select onChange={(e) => setItem(e.target.value)}>
        {selector &&
          selector.length > 0 &&
          selector?.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
      </select>
      <ResponsiveContainer width="100%" aspect={3 / 1}>
        <AreaChart
          width={730}
          height={250}
          data={stat}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
          <YAxis />
        </AreaChart>
      </ResponsiveContainer>
      <Table columns={columns} dataSource={fetchD} />
    </div>
  );
}

export default Chart;
