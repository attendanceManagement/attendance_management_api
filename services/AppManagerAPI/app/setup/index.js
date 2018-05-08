const mongoose = require('mongoose'),
      UserModel = require('@AppManagerModels/user');
      AttendenceModel = require('@AppManagerModels/attendance');
      RegularizeModel = require('@AppManagerModels/regularize');
      TeamModel = require('@AppManagerModels/team');
      LeaveModel = require('@AppManagerModels/leave');
const models = {
  User: mongoose.model('User'),
  Attendance: mongoose.model('Attendance'),
  Regularize: mongoose.model('Regularize'),
  Team: mongoose.model('Team'),
  Leave : mongoose.model('Leave')
}
module.exports = models;