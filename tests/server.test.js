var expect = require('expect');
var request = require('supertest');
var {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {note} = require('./../models/notes');

var seedNotes = [{
    _id: new ObjectID(),
    text:'First seed note',
},{
    _id: new ObjectID(),
    text:'Second seed note',
    completed: true,
    completedAt: 333
}]

beforeEach((done)=>{
    note.remove({}).then(()=>{
        return note.insertMany(seedNotes);
    }).then(()=> done());
})

describe('POST notes',()=>{
    it('should create a new to do', (done)=>{
        text = 'Eat well';
        request(app)
        .post('/createTodo')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            note.find({text}).then((doc)=>{
                expect(doc[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        })
    });

    it('should not create notes with invalid data',(done)=>{
        request(app)
        .post('/createTodo')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            note.find().then((doc)=>{
                expect(doc[2]).toEqual(undefined);
                expect(doc.length).toBe(2);
                done();
            }).catch((e)=>done(e))
        })
    })
});

describe('GET notes',(done)=>{
    it('should get all notes',(done)=>{
        request(app)
        .get('/getAllTodo')
        .expect(200)
        .expect((res)=>{
            expect(res.body.docs.length).toBe(2)
        })
        .end(done)
    })
})

describe('GET note by id',(done)=>{
    it('should get the note for the id',(done)=>{
        request(app)
        .get(`/getTodoById/${seedNotes[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.doc.text).toBe(seedNotes[0].text)
        })
        .end(done)
    })

    it('should return 404 if id not found',(done)=>{
        request(app)
        .get(`/getTodoById/${new ObjectID()}`)
        .expect(404)
        .end(done)
    })

    it('should return 400 for invalid id',(done)=>{
        request(app)
        .get(`/getTodoById/123`)
        .expect(400)
        .end(done)
    })
})

describe('Delete ToDo Api', (done)=>{
    it('Should delete todo by id',(done)=>{
        var id = seedNotes[0]._id.toHexString();
        request(app)
        .delete(`/deletById/${id}`)
        .expect(200)
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            note.findById(id).then((doc)=>{
                expect(doc).toBeFalsy();
                done();
            }).catch((e)=>done(e))
        })
    })

    it('Should return 404 when no todo is present',(done)=>{
        var id = '5c66fd0c4dd97cbf83f65d17';
        request(app)
        .delete(`/deletById/${id}`)
        .expect(404)
        .end(done)
    })
  
    it('Should return 400 when id is invalid',(done)=>{
        var id = 'abc2345';
        request(app)
        .delete(`/deletById/${id}`)
        .expect(400)
        .end(done)
    })
})

describe('PATCH todo APIs',(done)=>{
    it('should update the todo',(done)=>{
        var id = seedNotes[0]._id.toHexString();
        var toDo = {
            "text" : "Updated from test suite 1",
            "completed" : true
        }
        request(app)
        .patch(`/updateToDo/${id}`)
        .send({toDo})
        .expect(200)
        .expect((res)=>{
            expect(res.body.completedAt).toBeTruthy();
            expect(res.body.text).toBe(toDo.text);
        })
        
        .end((err, res)=>{
            if(err){
                return(done(err))
            }

            note.findById(id).then((doc)=>{
                expect(doc.text).toBe(toDo.text);
                done()
            }).catch((e)=> done(e))
        })
    })

    it('should set completed at as null if completed is false',(done)=>{
        var id = seedNotes[1]._id.toHexString();
        var toDo = {
            "text" : "Updated from test suite 2",
            "completed" : false
        }
        request(app)
        .patch(`/updateToDo/${id}`)
        .send({toDo})
        .expect(200)
        .expect((res)=>{
            expect(res.body.completedAt).toBeFalsy();
            expect(res.body.text).toBe(toDo.text);
        })
        .end(done)
        
    })
})