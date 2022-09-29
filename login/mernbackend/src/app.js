const Exceljs= require('exceljs');
const moment= require('moment');

const express = require("express");
const app= express();
const path= require("path");
const port= process.env.PORT || 3000;
const hbs= require("hbs");
require("./db/conn");
const Register1=require("./models/registers");
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");
const route= require('./routes/routes');
const { json } = require('stream/consumers');


const static_path=path.join(__dirname,"../public" );
const template_path=path.join(__dirname,"../templates/views" );
const partial_path= path.join(__dirname,"../templates/partials");

app.use(express.json());

app.use(express.urlencoded({extended:false}));
app.use (express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);
app.get("/",(req,res)=>{
    res.render("index")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/register",(req,res)=>{
    res.render("register")
});
app.post("/register", async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword= req.body.confirmpassword;

        if(password=== cpassword){
            const registerEmployee= new Register1({

        
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender:req.body.gender,
            phone: req.body.phone,
            address:req.body.address,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword,

            })
            console.log("s")
         // const  token = await registerEmployee.generateAuthToken();
            console.log("s2")
            const registerd= await registerEmployee.save();
            res.status(201).render("index");


        }
        else{
            res.send("password is not match")
        }

    }catch (error){
        res.status(400).send(error);

    }
});
app.post("/login",async(req,res) =>{
    try {
        const name= req.body.username;
        let email= req.body.email;
        const password= req.body.password;

       const useremail = await Register1.findOne({email:email});
       
       const ismatch= await bcrypt.compare(password,useremail.password);
       console.log("welcome");
        if(ismatch){
            res.status(201).render("main");
        }
        else{
            res.send("invalid login details");
        }
     } catch (error) {
        res.send("invalid details");
    }
});
app.get('/sheet',async(req,res,next)=>{
    const startdate= moment(new Date()).startOf('month').toDate();
    const enddate= moment(new Date()).endOf('month').toDate();
    try {
        console.log("s1");
        const  users = await Register1.find({created_At:{$gte: startdate, $lte:enddate}});
        const workbook= new Exceljs.Workbook();
        const worksheet = workbook.addWorksheet ('users');
        worksheet.columns=[{
            header:'s_no',key:'s_no',width:10},
       { header:'Email',key:'email',width:35},
       {header:'Name',key:'firstname',width:40},
    
    ];
    console.log("s2");
    let count =1 ;
    users.forEach(user => {
        user.s_no = count;
        worksheet.addRow(user) ;
        count+=1;
    }); 
    console.log("s3");
    worksheet.getRow(1).eachCell((cell)=>{
        cell.font={bold:true};
    });
    console.log("s4");
    const data = await workbook.xlsx.writeFile('users.xlsx');
    console.log("s5");
    res.send('done');
    } catch (error) {
        
    }
});

app.get('/about',(req,res)=>{
    res.render('about');
});
app.get('/login/marks',(req,res)=>
{
    res.render('marks');
});
app.post('/login/marks',(req,res)=>{
    
})
app.get('/login/marksheet',(req,res)=>
{
    res.send('thier is no imformation such feed by you ');
});
app.get('/get-attendence',(req,res)=>{
    res.render('stat');
})
  // student attendence
app.post('/get-attendence',async(req,res)=>{
    let name= req.body.username;
    let user = await Register1.findOne({firstname:name});
   let at =user.attendence;
   let name1=user.firstname;
   let email= user.email;
   let array= [ name1,at,email]

   
   console.log(array);
      //send  a student imforamtion to a teacher
  let jsonContent = JSON.stringify(array);
   return res.send(`<hi style="size: 50px"> ${jsonContent}</hi>`);
  // return res.send(jsonContent);
});




app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})