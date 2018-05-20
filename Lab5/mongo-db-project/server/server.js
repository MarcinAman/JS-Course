//sudo docker run -d -it -p 27017:27017 mongo

/*
use University
show collections
db.InformationSystem.find().pretty()
 */

const express = require('express')
const logger = require('morgan')
const faker = require('faker')
const MongoClient = require('mongodb').MongoClient
const url = require('url');

const app = express()
const subjectNames = ['Maths','Physics','PE','Art','IT']
const connectionURL = 'mongodb://localhost:27017/University'
const collectionName = 'InformationSystem'

const first_data = {
    name: "Jakob Bayer",
    position: "Academic Teacher",
    students: Array.from({length: 30},(v,k) => ({
        name: faker.name.findName(),
        student_id: k,
        grades: Array.from({length:9},() => ({
            grade:Math.floor(Math.random()*4)+2,
            subject: subjectNames[Math.floor(Math.random()*subjectNames.length)]
        }))
    }))
}

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

//Adding first pile of data to database

const updateData = (res,data) => {
    MongoClient.connect(connectionURL,(err,db)=>{
        if(err){
            res.send('error')
        }
        else{
            const db_object = db.db('University')
            db_object.createCollection('InformationSystem',{w:1},(err,result)=>{
                if(err){
                    console.log(err)
                }
            })

            const collection = db_object.collection('InformationSystem')
            collection.insert(data,{w:1},(err,result) =>{
                if(err){
                    console.log(err)
                }
                else{
                    res.send('ok')
                }
            })

        }
    })
}

app.get('/', (req,res) => {
    updateData(res,first_data)
})

app.get('/getTeacher*',(req,res)=>{
  MongoClient.connect(connectionURL,(err,db)=>{
      if(err){
          console.log(err)
      }
      else{
          const collection = db.db('University').collection('InformationSystem')

          collection.find({name: "Jakob Bayer"}).toArray((err,object)=>{
                res.send(object)
          })
      }
  })
})

app.get('/getStudent/*',(req,res)=>{
    MongoClient.connect(connectionURL,(err,db)=>{
        if(err){
            console.log(err)
        }
        else{
            const urlParts = url.parse(req.url,true)
            const student_id = parseInt(urlParts.path.split('/').pop())

            if(isNaN(student_id)){
                res.send(JSON.stringify({grades:[]}))
            }
            else{
                const collection = db.db('University').collection('InformationSystem')
                collection.find({"students.student_id":student_id}).toArray((err,object)=>{
                    if(!object[0]){
                        res.send('error')
                    }
                    else{
                        object[0].students.forEach(
                            (e)=>{
                                if(e.student_id===student_id){
                                    res.send(e)
                                }
                            }
                        )
                    }
                })
            }
        }
    })
})

const updateDatabase = (updated,db,res) => {
    const db1 = db.db('University')
    db1.dropCollection('InformationSystem')

    db1.createCollection('InformationSystem',{w:1},(a,b)=>{})

    const collection = db1.collection('InformationSystem')

    collection.insert(updated,{w:1},(err,result) =>{
        if(err){
            console.log(err)
        }
        else{
            res.send('ok')
        }
    })
}

const addMark = (student_id,mark,subject,res) =>{
    MongoClient.connect(connectionURL,(err,db)=> {
        const db1 = db.db('University')
        const collection = db1.collection('InformationSystem')

        collection.find({name: "Jakob Bayer"}).toArray((err, object) => {
            object[0].students.map(
                (student) => {
                    if (student.student_id === student_id) {
                        student.grades.push({
                            grade: mark,
                            subject: subject
                        })
                    }
                }
            )

            updateDatabase(object,db,res)
        })
    })
}

const removeMark = (student_id,mark,subject,res) => {
    MongoClient.connect(connectionURL,(err,db)=> {
    const db1 = db.db('University')
    const collection = db1.collection('InformationSystem')

    collection.find({name: "Jakob Bayer"}).toArray((err,object)=>{
        object[0].students.forEach(
            (student) => {
                if(student.student_id === student_id){
                   let isRemoved = false
                    student.grades.forEach(
                       (e,index) => {
                            if(!isRemoved && e.grade === mark && e.subject ===  subject){
                               student.grades.splice(index,1)
                                isRemoved = true
                            }
                       }

                   )
                }
            }
        )

        updateDatabase(object,db,res)
    })})
}

const updateMark = (student_id,mark,newMark,subject,res) => {
    MongoClient.connect(connectionURL,(err,db)=> {
    const db1 = db.db('University')
    const collection = db1.collection('InformationSystem')

    collection.find({name: "Jakob Bayer"}).toArray((err,object)=>{
        object[0].students.forEach(
            (student) => {
                let is_updated = false
                student.grades.forEach(
                    (e) => {
                        if(e.grade === mark && !is_updated && e.subject === subject){
                            is_updated = true
                            e.grade = newMark
                        }
                    }
                )
            }
        )

        updateDatabase(object,db,res)
    })})
}

const parseUpdate = (inputURL,res) => {
    const urlParts = url.parse(inputURL.url,true).path.split('/')

    const student_id = parseInt(urlParts[2].substring(3,urlParts[2].length))
    const grade = parseInt(urlParts[5])
    switch(urlParts[3]){
        case 'add':
            addMark(student_id,grade,urlParts[4],res)
            break
        case 'remove':
            removeMark(student_id,grade,urlParts[4],res)
            break
        case 'update':
            const newMark = parseInt(urlParts[6])
            updateMark(student_id,grade,newMark,urlParts[4],res)
            break
        default:
            res.send('error')
            return 'error'
    }

}

// /update/id:10/<add,remove,update>/subject/grade/newGrade
app.get('/update/*',(req,res)=>{
    parseUpdate(req,res)
})


app.listen(8080, function () {
    //quality content
});