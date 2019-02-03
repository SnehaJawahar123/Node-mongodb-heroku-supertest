var mongoose = require('mongoose');

var note = mongoose.model('note',{
    text:{
        type: String,
        required: true
    },
    completed:{
        type: Boolean
    },
    completedAt:{
        type: Date
    }
})

module.exports ={note};