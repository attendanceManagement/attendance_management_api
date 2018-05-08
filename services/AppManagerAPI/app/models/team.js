const mongoose = require('mongoose');
var  ObjectId = mongoose.Schema.ObjectId;
const Schema = mongoose.Schema({ 
    name: { 
        type: String        
    },
    active:{
        type:Boolean,
        default: true,        
    },
    members:[{ type: ObjectId}],
    manager_id: ObjectId,
    desc:String
});

mongoose.model('Team', Schema);