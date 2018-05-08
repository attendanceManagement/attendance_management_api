const mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  config = require('@config');

const api = {};

api.getAll = (Regularize, Token) => (req, res) => {
  if (Token) {

    Regularize.aggregate([{
        $lookup: {
          from: "users",
          localField: "emp_id",
          foreignField: "_id",
          as: "user"
        }
      }, {
        $unwind: "$user"
      },
      {
        $project: {
          "approve_status": 1,
          "checkin": 1,
          "checkout": 1,
          "date": 1,
          "_id": 1,
          "reason":1,
          "username": "$user.username",
          "emp_no": "$user.emp_id",
          "user_id": "$user._id",
          "email": "$user.email",
        }
      }
    ]).exec((error, Regularize) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(Regularize);
      return true;
    })
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}

api.save = (Regularize, Token) => (req, res) => {
  if (Token) {
    Regularize.findOne({
      emp_id: req.body.emp_id,
      date: req.body.date,
      checkin: req.body.in_time,
      checkout: req.body.out_time
    }, (error, data) => {
      if ( data && data._id) {
        if (error) return res.status(400).json(error);
        res.status(403).json({
          success: true,
          message: "Duplicate entry"
        });
      } else {
        const regularize = new Regularize({
          emp_id: req.body.emp_id,
          date: req.body.date,
          checkin: req.body.in_time,
          checkout: req.body.out_time,
          reason: req.body.reason
        });

        regularize.save((error, regularize) => {
          if (error) return res.status(400).json(error);
          res.status(200).json({
            success: true,
            regularize: regularize
          });
        })
      }



    });

  }
}
module.exports = api;