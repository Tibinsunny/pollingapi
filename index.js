const express=require('express');
const app=express();
const port='4455';
const v1=require("./api/apicalls")
app.use('/api/v1',v1)
app.get("/",(req,res)=> {
    res.status(200).json({
     error:"This is not an API call"   
    })
})
app.listen(port,() => {
    console.log("App is Up and Running on https://127.0.0.1:4455 ")
})