const mongoose=require("mongoose");
const bcrypt = require ("bcrypt");
const jwt= require("jsonwebtoken");
const employeeSchema= new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    address:{
        type:String
        
    },
    attendence:{
       type:String,
       
       default:1
    },
    rollnumber:{
        type:String,
        
    },
   
    password:{
        type:String,
        required:true,

    },
    confirmpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

});
employeeSchema.method.generateAuthToken=async function(){
    //into hash
    try {
        const token =jwt.sign({_id: this._id},"mynameisourabhiamcromnarsighgarhmadhyapreadesh")
        console.log(token);
        this.tokens=this.tokens.concat({token})
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part"+error);
        console.log(error);
    }
}
//we need to create our collection by our shcmea
employeeSchema.pre("save",async function(next){
  //  const passworhash= await bcrypt.hash(password,10);
  console.log(` password ${this.password}`);
  this.password=await bcrypt.hash(this.password,10);
  console.log(` password ${this.password}`);
  
    next();
})
const register=new mongoose.model("Register",employeeSchema);
module.exports=register;