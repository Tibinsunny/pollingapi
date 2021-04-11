const express=require('express');
let randomstring = require("randomstring");
const rateLimit = require("express-rate-limit");
const app=express()
const router=express.Router();
let tempDb=[];
ipdb=[]
let newvalue="voute"
app.use(express.json())

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
        message:"User/Someone in your network has already voted"
    }
  }
  );

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
        selection:selectionStore

    }

    tempDb.push(data)
    res.json(tempDb)
})
//This should be removed 

router.get("/",(req,res) => {
    res.json(tempDb)
  
})


router.get("/result/:slugInput",(req,res) => {
    const { slugInput }=req.params
    let data=tempDb.find(el => el.slug === slugInput);
    res.json(data)
})


//Update Queries Goes Here

router.get("/vote/:slugInput/:id",(req,res) => {
   const slugInput=req.params.slugInput
   const id=req.params.id
   let voteData=tempDb.find(voteEl => voteEl.slug === slugInput);
  voteData.selection[id].key.vote++
res.send(voteData)

})




module.exports = router;

//http://127.0.0.1:4455/api/v1/slug/question1