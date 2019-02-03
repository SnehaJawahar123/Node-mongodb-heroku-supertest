var mongoose = require('mongoose');

var user=new mongoose.model('user',{
    name:{
        type: String
    },
    email:{
        type: String
    },
    age:{
        type: Number
    }
});

module.exports={user};