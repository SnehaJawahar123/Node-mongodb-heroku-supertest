var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {note} = require('./models/notes');
var {user} = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/createTodo',(req,res)=>{
    var newNote = new note(req.body);
    newNote.save().then((doc)=>{
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/getAllTodo',(req, res)=>{
    note.find().then((docs)=>{
        res.send({docs});
    },(e)=>{
        res.send(e);
    })
})

app.get('/getTodoById/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
     return res.status(400).send("Invalid Id sent")
    }
        note.findById(id).then((doc)=>{
            if(!doc){
                return res.status(404).send("Id not found in database");
            }
           res.send({doc});
        }).catch((e)=>{
            res.send(e);
        })
    
})

app.delete('/deletById/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid Id');
    }
    else{
        note.findByIdAndDelete(id).then((result)=>{
            if(result != null){
                return res.status(200).send(result);
            }
        res.status(404).send('No document found for data')
        }).catch((e)=>{
            res.status(400).send(e);
        })
    }
})

app.patch('/updateToDo/:id',(req,res)=>{
    var id = req.params.id;
    if(!_.has(req.body,'toDo')){
        return res.status(400).send('No request present');
    }
    var body = _.pick(req.body.toDo, ['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid Id');
    }
     if(_.isBoolean(body.completed) && body.completed){
         body.completedAt = new Date().getTime();
     }
     else{
         body.completed = false;
         body.completedAt = null;
     }
     note.findByIdAndUpdate(id, {$set : body}, {new : true}).then((doc)=>{
         if(!doc){
             return res.status(404).send('Todo with this id does not exist');
         }
        res.status(200).send(doc);
     }).catch((e)=>{
        res.status(400).send(e);
     })

})

app.listen(port,()=>{
    console.log(`App running on port ${port}`);
})

module.exports = {app}

