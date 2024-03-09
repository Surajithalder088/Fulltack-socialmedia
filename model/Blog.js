const mongoose=require("mongoose");
// defining blog schema 
const Schema=mongoose.Schema;
const blogSchema=new Schema({
      title:{
            type:String,
            required:true
      },
     description:{
            type:String,
            required:true
      },
      image:{
            type:String,
            required:true
      },
      user:{
            type:mongoose.Types.ObjectId,
            ref:"User",             //defining perticular blog form particular user
            required:true
      }
})

// constructing blog model
const blog=new mongoose.model("Blog",blogSchema);
module.exports=blog;