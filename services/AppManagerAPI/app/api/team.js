const mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  config = require('@config');

const api = {};

api.get = (Team, Token) => (req, res) => {
  let querry = { active: true};
  const manager_id = req.query.manager_id;
  if (manager_id) {
    querry = {
      manager_id: manager_id,
      active: true,
    };
  }
  if (Token) {
    Team.find(querry, (error, team) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(team);
      return true;
    })
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}

api.save = (Team, Token) => (req, res) => {
  console.log(Team);
  if (Token) {
    const team = new Team({
      name: req.body.name,
      manager_id: req.body.manager_id,
      members: req.body.members
    });

    team.save((error, team) => {
      if (error) return res.status(400).json(error);
      res.status(200).json({
        success: true,
        team: team
      });
    })
  }
}

api.edit = (Team, Token) => (req, res) => {  
  if (Token) {
    Team.findOneAndUpdate({_id: req.body._id},req.body,(error, team) => {
      if (error) return res.status(400).json(error);
      res.status(200).json({
        success: true,
        team: team
      });
    })
  }
}

api.delete = (Team, Token) => (req, res) => {  
  if (Token) {
    Team.findOneAndUpdate({_id: req.body._id},{actie:false},(error, team) => {
      if (error) return res.status(400).json(error);
      res.status(200).json({
        success: true,
        message: "deleted"
      });
    })
  }
}

api.members= (Team, User, token) => (req, res) => {
  if (token) {

   let query ={};
  const manager_id = req.query.manager_id;
  const team_id = req.query.team_id;
  if (manager_id) {
    query = {
      manager_id: manager_id
    };
  }
  if (team_id) {
     query = {
      _id: mongoose.Types.ObjectId(team_id)
    };
  }
    Team.aggregate([
      { $match : query} , 
      {
        $unwind: "$members"
      },
      {
        $group: {
          _id: null,
          member: {
            $addToSet: "$members"
          }
        }
      },
    ]).exec((err, test) => {

      console.log(test);
      User.find({
        _id: {
          $in: test[0]?test[0].member:[]
        }
      }, (err, data) => {
        if (err) throw err;
        res.status(200).json(data);

      });
    })

  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });

}



api.getRegularize = (Team, Token) => (req, res) => {
  if (Token) {
    const team_id = req.query.team_id;
    let query ={};
    if (team_id) {
      query = {
       _id: mongoose.Types.ObjectId(team_id)
      };
    }

    Team.aggregate([
   {$match:query},
   {$unwind: "$members"},
    {
      $lookup: {
        from: "regularizes",
        localField: "members",
        foreignField: "emp_id",
        as: "regularize"
      }
    },{$unwind: "$regularize"},
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "user"
      }},{
      $unwind: "$user"
    },
    {
      $project: {
        "approve_status" : "$regularize.approve_status",
        "checkin" : "$regularize.checkin",
        "checkout" : "$regularize.checkout",
        "date" : "$regularize.date",
        "_id" :  "$regularize._id",
        "username": "$user.username",
        "emp_no": "$user.emp_id",
        "email": "$user.email",
      }
    }
   
  ]).exec((error, team) => {
    console.log(team)
      if (error) return res.status(400).json(error);
      res.status(200).json(team);
      return true;
    });

  } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

module.exports = api;