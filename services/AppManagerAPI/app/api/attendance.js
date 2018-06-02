const mongoose = require('mongoose');
const moment = require('moment');
const api = {};
var DateOnly = require('dateonly');

api.getAll = (User, Attendance, Token) => (req, res) => {
  if (Token) {
    Attendance.find({}, (error, Attendance) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(Attendance);
      return true;
    })
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}

api.getByEmp = (User, Attendance, Token) => (req, res) => {
  if (Token) {
    let query = {};
    query = {
      $lt: Date.now()
    }

    if (req.query.month) {
      const start = new Date(req.query.month);
      const end = new Date(req.query.month);
      end.setMonth(end.getMonth() + 1);
      query = {
        $gte: start,
        $lte: end
      }
    }
    console.log(query);
    Attendance.find({
      emp_id: req.query.emp_id,
      date: query
    }, (error, Attendance) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(Attendance);
      return true;
    })
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}



api.getAllEmp = (User, Attendance, Token) => (req, res) => {
  if (Token) {
    let query = {};
    query = {
      $lt: Date.now()
    }

    if (req.query.month) {
     
      const start = new Date(req.query.month);
      const end = new Date(req.query.month);
       console.log(new DateOnly(start).valueOf())
      end.setMonth(end.getMonth() + 1);
      query = {
        $gte: new DateOnly(start).valueOf(),
        $lte: new DateOnly(end).valueOf()
      }
    }
    console.log(query)
    Attendance.aggregate([
      {$match:{
           date: query
    }},   
      {
        $group: {
          _id: "$emp_id",
          "attendance": {
            $push: "$$ROOT"
          }
        }
      },
       {$lookup: {
        from: "users",
        localField: "_id",
        foreignField: "emp_id",
        as: "user"
      }
    }, {
      $unwind: "$user"
    },
    ]).exec((error, Attendance) => {

if (error) return res.status(400).json(error);
      res.status(200).json(Attendance);
      return true;


    })
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}



api.checkAttendance = (Attendance, Token) => (req, res) => {
  if (Token) {
    Attendance.find({
      emp_id: req.query.emp_id,
      date: Date.now()
    }, (error, Attendance) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(Attendance);
      return true;
    })
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}


api.store = (Regularize, Attendance, Token) => (req, res) => {
  if (Token) {
    const date = req.body.date ? req.body.date : Date.now();
    let regId = req.body.regularize_id;
    Attendance.find({
      date: date,
      emp_id: req.body.emp_id
    }, (error, attendance) => {
      if (attendance.length < 1) {
        const total_hour = req.body.out_time ? ((moment(req.body.out_time).diff(moment(req.body.in_time), 'minutes')) / 60).toFixed(2) : 0;
        const attendance = new Attendance({
          emp_id: req.body.emp_id,
          user_id: req.body.user_id,
          date: req.body.date,
          in_time: req.body.in_time,
          out_time: req.body.out_time,
          total_hour: total_hour
        });

        attendance.save((error, attendance) => {
          if (regId) {
            console.log('test')
            Regularize.findOneAndUpdate({
              _id: regId
            }, {
              approve_status: true
            }, (error, regularize) => {
              if (error) return res.status(400).json(error);
              res.status(200).json({
                success: true,
                attendance: attendance,
                regularize: regularize
              });
            });
          } else {
            if (error) return res.status(400).json(error);
            res.status(200).json({
              success: true,
              attendance: attendance
            });
          }

        })

      } else {
        res.status(200).json({
          success: true,
          message: "attendance is allready  added"
        })
      }
    });
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}

api.edit = (User, Attendance, Token) => (req, res) => {
  if (Token) {
    const emp_id = req.query.emp_id;
    Attendance.findOneAndUpdate({
      emp_id: emp_id
    }, req.body, (error, attendance) => {
      if (error) res.status(400).json(error);
      res.status(200).json(attendance);
    })
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}

api.checkout = (User, Attendance, Token) => (req, res) => {
  if (Token) {
    const emp_id = req.body.emp_id;
    const attendance_id = req.body.attendance_id;
    console.log(attendance_id);
    Attendance.findOne({
      emp_id: emp_id,
      _id: attendance_id
    }, (error, attendance) => {
      if (error) res.status(400).json(error);
      attendance.out_time = Date.now()
      attendance.total_hour = ((moment(Date.now()).diff(moment(attendance.in_time), 'minutes')) / 60).toFixed(2);

      attendance.save((error, attendance1) => {
        if (error) return res.status(400).json({
          success: false,
          message: 'Username or Empoyle ID already exists.'
        });
        res.json({
          success: true,
          message: attendance1
        });
      });
    })
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}

module.exports = api;