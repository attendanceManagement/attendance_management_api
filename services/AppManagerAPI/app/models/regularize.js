const mongoose = require('mongoose');
const type = mongoose.Schema;
var DateOnly = require('mongoose-dateonly')(mongoose);
const  ObjectId = mongoose.Schema.ObjectId;
const Schema = mongoose.Schema({ 
    emp_id: {
       type: ObjectId,        
    },    
    date: {
        type: DateOnly,
        default: Date.now ,
        required: true
    },
    checkin: {
       type:  Date
    },

    checkout: {
       type:  Date
    },
    reason:String,
    approve_status:{type:Boolean,default:false}
});

mongoose.model('Regularize', Schema);