const mongoose =require("mongoose");
// creating schema for user details
const schema=mongoose.Schema;
const userScema=new schema({
      name:{
            type:String,
            reqired:true
      },
      email:{
            type:String,
            reqired:true,
            unique:true
      },
      password:{
            type:String,
            reqired:true,
            minlength:8
      },
      blogs:[                       /// a user can have multiple blogs so we use array here
            {type:mongoose.Types.ObjectId,
            ref:"Blog",
            required:true
            }
      ]
      
})
// constructing model
const user=new mongoose.model("User",userScema);
module.exports=user;