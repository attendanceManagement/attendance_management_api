const mongoose = require('mongoose');
const api = {};
api.setup = (User) => (req, res) => {
  const admin = new User({
    username: 'admin',
    password: 'admin123456',
    emp_id :  'EMP01',
    clients: []
  });
admin.save(error => {
    if (error) throw error;
console.log('Admin account was succesfully set up');
    res.json({ success: true });
  })
}

api.index = (User, BudgetToken) => (req, res) => {
  const token = BudgetToken;
if (token) {
    User.find({}, (error, users) => {
      if (error) throw error;
      res.status(200).json(users);
    });
  } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

api.signup = (User) => (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.emp_id) res.json({ success: false, message: 'Please, pass an username and password.' });
  else {
    const user = new User({
      username: req.body.username,
      name: req.body.name,
      password: req.body.password,
      emp_id: req.body.emp_id,
      role: req.body.role,
      tel_no: req.body.tel_no,
      email: req.body.email,    
    });
  
    user.save(error => {
      if (error) return res.status(400).json({ success: false, message: error });
      res.json({ success: true, message: 'Account created successfully' });
    });
  }
}


api.edit = (user) => (req, res) => {
user.findById(req.body._id,(error, user) =>  { 
   if (error) return res.status(400).json(error);
   if (user) {
    let activated = req.body.activated;
    if (!req.body.activated.active){
      activated.deactivated_date = new Date();
    }
    user.password = req.body.password ? req.body.password : user.password;
    user.username = req.body.username ? req.body.username : user.username;
    user.emp_id = req.body.emp_id ? req.body.emp_id : user.emp_id;
    user.role = req.body.role ? req.body.role : user.role;
    user.email = req.body.email ? req.body.email : user.email;
    user.tel_no = req.body.tel_no ? req.body.tel_no : user.tel_no;
    user.leaves=req.body.leaves ? req.body.leaves: user.leaves;
    user.name = req.body.name ? req.body.name : user.name;
    user.activated = activated;
    console.log(activated);
   
    user.save((error,test) => {
      if (error) return res.status(400).json({ success: false, message: 'Username or Empoyle ID already exists.' });
      res.json({ success: true, message: test });
    });
   }
  });
}

api.getAll = (User, Token) => (req, res) => {
  if (Token) {
    User.find({}, (error, user) => {
      if (error) return res.status(400).json(error);
      res.status(200).json(user);
      return true;
    })
  } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

api.getByQuery = (User,Token) => (req, res) => {
  if (Token) {  
  const emp_id = req.query._id;
  let query ={};
  if (emp_id) {
     query = { _id: emp_id };
  }
   User.find(query,{ password: 0}, (error, user) => {
          if (error) res.status(400).json(error);
          delete user.password;
          res.status(200).json(user);
        })   
  } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}



module.exports = api;
