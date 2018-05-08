const mongoose = require('mongoose');
const type = mongoose.Schema;
var DateOnly = require('mongoose-dateonly')(mongoose);
const  ObjectId = mongoose.Schema.ObjectId;
const Schema = mongoose.Schema({
  emp_id: {
    type: String,
    required: true
  },
  user_id:ObjectId,
  leave_status: String,
  date: {
    type: DateOnly,
    default: Date.now ,
    required: true
  },

  in_time: {
    type: Date,
    timestamps: true,
     default: Date.now    
  },

  out_time: {
    type: Date,
    timestamps: true   
  },

  total_hour: Number,

  marked: {
    type: Boolean,  
  },  

});

mongoose.model('Attendance', Schema);