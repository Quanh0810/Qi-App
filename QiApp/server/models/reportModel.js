const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exams",
    },
    time: {
      type: String
    },
    result: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const Report = mongoose.model("reports", reportSchema);

module.exports = Report;