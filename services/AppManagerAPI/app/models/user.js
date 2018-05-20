const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

const Schema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  email: {
    type: String,
  },

  tel_no: {
    type: String,
  },

  password: {
    type: String,
    required: true
  },
  emp_id: {
    type: String,
    required: true
  },
  profpic: String,
  position: String,
  role: {
    type: String,
    enum: ['admin', 'manager', 'employe'],
    default: 'employe',
  },
  activated:{
    active:{type:Boolean,default:true},
    deactivated_date: Date,
    reason: String
  },
  leaves: {
    privilege: {
      type: Number,
      default: 10
    },
    sick: {
      type: Number,
      default: 5
    }
  },
  permission: [{}]
});

// We won't use arrow functions here because of automatic lexical scope binding
Schema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error);
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

Schema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (error, matches) => {
    if (error) return callback(error);
    callback(null, matches);
  });
};

mongoose.model('User', Schema);