const express=require('express');
let randomstring = require("randomstring");
const rateLimit = require("express-rate-limit");
const monk=require("monk")
const app=express()
const router=express.Router();
app.use(express.json())
//Use below statement you are running on a VPS or your on server
const db = require('monk')('localhost/mydb')
//Or use 
// const db = require('monk')('user:pass@localhost:port/mydb')
const polling = db.get('polling')
//Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3,
    message:{
        status:429,
        type:'error',
        message:"Too Many request. Try again after 5 Minutes"
    }
  }
  );
  const userLimiter = rateLimit({
    max: 1,
    message:{
        status:403,
        type:'error',
        message:"Too Many Requests"
    }
  }
  );

  //Creates a New Poll :Syntax url site.com/api/v1/create?asdasd=answer1&option2=answer2&question=question
router.post("/create" ,apiLimiter,(req,res) => {
    let selectionStore=[];
    let question;
    const slug=randomstring.generate({
        length: 12,
        charset: 'alphabetic'
      });
      for (var key in req.query) {
            if(key==="question"){
              
                question=req.query[key];
                
                continue;
            }
          selectionJSON={
            key:{
                name:req.query[key],
                vote:Number(0)
            }
            
          }
          selectionStore.push(selectionJSON)
    }
 

    let data={
        slug:slug,
        question:question,
        selection:selectionStore,
        ipCollection:[]

    }

    polling.insert(data).then((doc) => {
        res.json({
            slug:doc.slug,
            question:doc.question,
            selection:selectionStore,
        })
    })
    
})
//Result API also returns current Slug and Question
router.get("/result/:slugInput",(req,res) => {
    const { slugInput }=req.params
    polling.findOne({slug: slugInput}).then((doc) => {
        // console.log(doc.selection[0].key.vote)
            res.json({
        slug:doc.slug,
        question:doc.question,
        selection:doc.selection

    })
    });
})
//Update Queries Goes Here: Voting API
router.post("/vote/:slugInput/:id",(req,res) => {
   const slugInput=req.params.slugInput
   const id=req.params.id
   polling.findOne({slug: slugInput}).then((doc) => {

    if((doc.ipCollection).includes(req.ip))
    {
        res.status(409).json({
            error:'User/Someone in Network has already voted'
        })
    }
    else
    {
        const filter = { slug: doc.slug };
        const update = { $set: {} };
       let ipArray=[...doc.ipCollection]
       ipArray.push(req.ip)
        let voteValue=Number(doc.selection[id].key.vote)+1
        update.$set[`selection.${id}.key.vote`] = voteValue;
        polling.findOneAndUpdate(filter,{$set:{ipCollection:ipArray }})
     polling.findOneAndUpdate(filter, update).then((updatedDoc) => {res.json({
        slug:updatedDoc.slug,
        question:updatedDoc.question,
        selection:updatedDoc.selection

    })})
   

    }
});
})
module.exports = router;
