const {ObjectID} =  require('mongodb');
var {mongoose} = require('./../db/mongoose');
var {user} = require('./../models/user');

var id= '6c570d6d0474b3085c10b4c6';

if(!ObjectID.isValid(id)){
    console.log('id is invalid');
}

// user.remove({}).then(()=>{
//     return user.find().then((doc)=>{
//         console.log(doc);
//     });
// });

// var userNew = new user({
//     email:'ambi@gmail.com'
// })

// userNew.save().then((doc)=>{
//     console.log('saved data',JSON.stringify(doc, undefined, 2));
// });

/*user.find().then((doc)=>{
    console.log(JSON.stringify(doc, undefined, 2));
})

user.find({
    _id: id
}).then((doc)=>{
    if(doc.length == 0) {
      return  console.log('no data found');
    }
    console.log(`Fetched find with condition: ${doc}`);
})

user.findById(id).then((doc)=>{
    if(!doc) {
      return  console.log('no data found');
    }
    console.log(`Fetched find with condition: ${doc}`);
})
*/
