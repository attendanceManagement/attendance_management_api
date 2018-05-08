const mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);
const  ObjectId = mongoose.Schema.ObjectId;
const Schema = mongoose.Schema({
  emp_id: {
    type: ObjectId,
  },
  start_date: {
    type: DateOnly,   
  },
  end_date: {
    type: DateOnly,   
  },
  desc: String,
  approve_status: {
    type: Boolean,
    default: false
  },
  half_day: Boolean,
  sick_leave: Boolean,
  
  numberOfDays: Number
});

mongoose.model('Leave', Schema);