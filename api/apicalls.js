const express=require('express');
let randomstring = require("randomstring");
const rateLimit = require("express-rate-limit");
const app=express()
const router=express.Router();
let tempDb=[];
let ipdb=[]
app.use(express.json())

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

    tempDb.push(data)
    // res.json(tempDb) uncomment this For development
    res.json(data)
})
//Result API also returns current Slug and Question
router.get("/result/:slugInput",(req,res) => {
    const { slugInput }=req.params
    let data=tempDb.find(el => el.slug === slugInput);
    res.json({
        slug:data.slug,
        question:data.question,
        selection:data.selection

    })
})


//Update Queries Goes Here: Voting API
router.post("/vote/:slugInput/:id",(req,res) => {
   const slugInput=req.params.slugInput
   const id=req.params.id
   let voteData=tempDb.find(voteEl => voteEl.slug === slugInput); 
   if((voteData.ipCollection).includes(req.ip))
   {
       res.status(409).json({
           error:'User/Someone in Network has already voted'
       })
   }
   else
   {
    voteData.selection[id].key.vote++
    (voteData.ipCollection).push(req.ip)
    res.json({
        slug:voteData.slug,
        question:voteData.question,
        selection:voteData.selection

    })
   }
 


   

})
module.exports = router;
