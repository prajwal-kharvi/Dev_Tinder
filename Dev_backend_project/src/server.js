const express=require("express")

const app=express()

app.use("/test", (req, res) => {
    res.send("Hello from the server!!");
});


// app.use((req,res)=>{
//     res.send("hello !!!")
//
// })

app.use((req,res)=>{
    res.status(404).send("hello wdwfffw!!!")

})


app.listen(7777,()=>{
    console.log("Server is running on port 7777")
})