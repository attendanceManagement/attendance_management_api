const mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  config = require('@config');
var DateOnly = require('dateonly');
const moment = require('moment');
var async = require('async');

const api = {};

function querryBuilder(model, filter) {

  var props = Object.keys(model.schema.paths);
  return 'test';
}

function enumerateDaysBetweenDates(startDate, endDate) {
  startDate = moment(startDate);
  endDate = moment(endDate);

  var now = startDate,
    dates = [];

  while (now.isBefore(endDate) || now.isSame(endDate)) {
    dates.push(now.format('YYYY-MM-DD'));
    now.add(1, 'days');
  }
  return dates;
};
api.getTeamLeave = (Team, Leave, User, Token) => (req, res) => {
  let query = {};
  const manager_id = req.query.manager_id;
  const team_id = req.query.team_id;
  if (team_id) {
    query = {
      _id: mongoose.Types.ObjectId(team_id)
    };
  }
  Team.aggregate([{
      $match: query
    },
    {
      $unwind: "$members"
    },
    {
      $lookup: {
        from: "leaves",
        localField: "members",
        foreignField: "emp_id",
        as: "leaves"
      }
    }, {
      $unwind: "$leaves"
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "user"
      }
    }, {
      $unwind: "$user"
    },
    {
      $project: {
        "_id": "$leaves._id",
        "start_date": "$leaves.start_date",
        "end_date": "$leaves.end_date",
        "approve_status": "$leaves.approve_status",
        "desc": "$leaves.desc",
        "username": "$user.username",
        "emp_no": "$user.emp_id",
        "email": "$user.email",
        "role": "$user.role",
        "user_id": "$user._id"
      }
    }

  ]).exec((error, team) => {
    if (error) return res.status(400).json(error);
    res.status(200).json(team);
    return true;
  });




};


api.getAll = (Leave, Token) => (req, res) => {
  if (Token) {
    let query = {};
    const emp_id = req.query.emp_id;
    if (emp_id) {
      query = {
        emp_id: mongoose.Types.ObjectId(emp_id)
      };
    }
    Leave.aggregate([{
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: "emp_id",
          foreignField: "_id",
          as: "user"
        }
      }, {
        $unwind: "$user"
      }, {
        $project: {
          "_id": 1,
          "start_date": 1,
          "end_date": 1,
          "approve_status": 1,
          "desc": 1,
          "username": "$user.username",
          "emp_no": "$user.emp_id",
          "email": "$user.email",
          "role": "$user.role",
          "user_id": "$user._id"
        },

      }
    ]).exec((error, leave) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(leave);
      return true;
    });

  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}

api.approve = (Leave, User, Attendance, Token) => (req, res) => {
  if (Token) {
    Leave.findOne({
      _id: req.query.id
    }, (error, leave) => {
      const dates = enumerateDaysBetweenDates(new DateOnly(leave.start_date).toDate(), new DateOnly(leave.end_date).toDate());
      User.findOne({
        emp_id: req.body.emp_no
      }, (error, user) => {
        const privilegeLeave = user.leaves.privilege >= dates.length ? true : false;
        const sickLeave = user.leaves.privilege == 0 && user.leaves.sick >= dates.length ? true : false;
        console.log("privilegeLeave")
        console.log(privilegeLeave)
        console.log(user.leaves.privilege)
        console.log(sickLeave)
         console.log(dates.length)
        if (privilegeLeave || sickLeave) {
          async.eachSeries(dates, function updateObject(date, done) {
            // Model.update(condition, doc, callback)
            var add = {
              "emp_id": req.body.emp_no,
              'date': date,
              'leave_status': 'leave',
            };

            if (date) {
              Attendance.update({
                date: date
              }, add, {
                upsert: true
              }, (error, data) => {
                done();
              });
            }
          }, function allDone(err, result) {
            Leave.update({
              _id: req.query.id
            }, {
              approve_status: true
            }, {}, (error, data) => {
              if (privilegeLeave)
                user.leaves.privilege = user.leaves.privilege - dates.length
              if (sickLeave)
                user.leaves.sick = user.leaves.sick - dates.length
              user.save((error, user) => {
                if (error) return res.status(400).json({
                  success: false,
                  message: 'Username or Empoyle ID already exists.'
                });
                res.status(200).json({
                  success: true,
                  leave: user,
                })
              });
            });

          });
        }
      });

    });
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}

api.save = (Leave, User, Token) => (req, res) => {
  if (Token) {
    const start_date = moment(req.body.startDate).format('MM/DD/YYYY');
    const end_date = moment(req.body.endDate).format('MM/DD/YYYY');
    Leave.findOne({
      start_date: start_date,
      end_date: end_date,
      emp_id: req.body.emp_id
    }, (error, leave) => {
      if (leave && leave._id) {
        res.status(400).send({
          success: false,
          message: 'Leave is already applied'
        });
      } else {
        User.findOne({
          _id: req.body.emp_id
        }, (error, user) => {
          console.log(error);
          console.log(user);
          if (error) return res.status(400).json(error);
          const leaves = moment(req.body.end_date).diff(moment(req.body.start_date), 'days') + 1;
          const privilegeLeave = !!user.leaves.privilege >= leaves;
          const sickLeave = !!user.leaves.privilege == 0 && user.leaves.sick >= leaves
          if (privilegeLeave || sickLeave) {
            const leave = new Leave({
              emp_id: req.body.emp_id,
              start_date: start_date,
              end_date: end_date,
              desc: req.body.desc,
              sick_leave: sickLeave,
            });

            leave.save((error, leave) => {
              if (error) return res.status(400).json(error);
              const leaves_data = Object.assign({}, leave._doc, {
                "username": user.username,
                "emp_no": user.emp_id,
                "email": user.email,
                "role": user.role,
                "user_id": user._id
              });

              res.status(200).json({
                success: true,
                leave: leaves_data,

              })
            });
          } else return res.status(403).send({
            success: false,
            message: 'Do dont have leaves in your account'
          });
        });

      }

    });
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}


api.edit = (Leave) => (req, res) => {
  Leave.findById(req.body._id, (error, leave) => {
    if (error) return res.status(400).json(error);
    if (leave) {
      leave.start_date = moment(req.body.startDate).format('MM/DD/YYYY'),
        leave.end_date = moment(req.body.endDate).format('MM/DD/YYYY'),
        leave.desc = req.body.desc
      leave.save((error, test) => {
        if (error) return res.status(400).json({
          success: false,
          message: 'Username or Empoyle ID already exists.'
        });
        res.json({
          success: true,
          message: test
        });
      });
    }
  });
}

module.exports = api;