const express=require('express');
var randomstring = require("randomstring");
const app=express()
const router=express.Router();
let tempDb=[];
let newvalue="voute"
app.use(express.json())

router.post("/create",(req,res) => {
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

router.post("/vote/:slugInput/:id",(req,res) => {
   const slugInput=req.params.slugInput
   const id=req.params.id
   let voteData=tempDb.find(voteEl => voteEl.slug === slugInput);
  voteData.selection[id].key.vote++
res.send(voteData)

})




module.exports = router;

//http://127.0.0.1:4455/api/v1/slug/question1