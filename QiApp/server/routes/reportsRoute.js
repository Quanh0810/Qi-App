const authMiddleware = require("../middlewares/authMiddleware");
const Exam = require("../models/examModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const router = require("express").Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// add report

router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    const newReport = new Report(req.body);
    // console.log(newReport);
    await newReport.save();
    res.send({
      message: "Attempt added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports

router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    const { examName, userName } = req.body;

    const exams = await Exam.find({
      name: {
        $regex: examName,
      },
    });

    const matchedExamIds = exams.map((exam) => exam._id);
    // console.log("c", matchedExamIds)

    const users = await User.find({
      name: {
        $regex: userName,
      },
    });
    // console.log("a", users);

    const matchedUserIds = users.map((user) => user._id);
    // console.log("b", matchedUserIds);

    const reports = await Report.find({
      exam: {
        $in: matchedExamIds,
      },
      user: {
        $in: matchedUserIds,
      },
    })

      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });
    // console.log("d", reports);
    res.send({
      message: "Attempts fetched successfully",
      data: reports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports by user
router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.body.userId })
      .populate("exam")
      .populate("user")
      // dữ liệu trả về giảm dần theo ngày
      .sort({ createdAt: -1 });
    res.send({
      message: "Attempts fetched successfully",
      data: reports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// router.post("/get-all-reports-by-report", authMiddleware, async (req, res) => {
//   try {
//     const reports = await Report.find({ exam: req.body.reportId })
//       .populate("exam")
//       .populate("user")
//       .sort({ createdAt: -1 });
//     res.send({
//       message: "Attempts fetched successfully",
//       data: reports,
//       success: true,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//       data: error,
//       success: false,
//     });
//   }
// });


// get all report by report
router.post("/get-all-reports-by-report", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ exam: req.body.reportId })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });

    const stat = await Report.aggregate([
      // Filter by exam id
      { $match: { exam: new ObjectId(req.body.reportId) } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                { case: { $eq: ["$_id.month", 12] }, then: "Dec" },
              ],
              default: "Unknown",
            },
          },
          count: 1,
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]);

    res.send({
      message: "Attempts fetched successfully",
      data: { reports, stat },
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

module.exports = router;
