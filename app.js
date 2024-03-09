const express=require("express");  // by surajit full stack here

const app=express();
const port=process.env.PORT|| 8000;
const mongoose=require("mongoose");
const bcrypt =require("bcryptjs");
const cors=require("cors")

const corsOrigin={
      origin:['http://localhost:3000/'],
      optionSuccessStatus:200,
}
app.use(cors(corsOrigin))
// const router=require("./routes/user-routes");
const User =require("./model/User") ; // importng user schema
const Blog=require("./model/Blog");// importing blog schema
app.use(express.json());// telling our server that bodyy data are in json format

// connecting to data base
mongoose.connect("mongodb+srv://surajithalder088:IOZkPkGB7rJKvb6K@cluster2.9197ftj.mongodb.net/").then(()=>{
      console.log(" connected to database")
}).catch((e)=>{
      console.log("not connected")
})

// ----------------------------------------------------------------------user routes here

app.get("/",(req,res)=>{
      res.send(" working")
})
// creating user account  registration according body data
app.post("/api/user/signup",async(req,res)=>{
      const {name,email,password}=req.body; //recieving data from body
      
      let existingUser;
      try{
            existingUser=await User.findOne({email})
      }catch(e){
            console.log(e)
      }
      if( existingUser){ // checking of existing email address
            return res.status(400).json({messege:"User already exist ! Login instead"});
      }
      
      const hashPassword=bcrypt.hashSync(password); // craeting hash password using bcryptjs

      const user= new User({ //creat new user with that email
            name,
            email,
           password: hashPassword, //creatted password will not  visible on database
           blogs:[]
      })
     
      try{
             await user.save(); //saving new user data to datbase
      }catch(e){
            console.log(e)
      }
      return res.status(201).json({user });
})

// creating login function 
app.post("/api/user/login",async (req,res)=>{
      const {email,password}=req.body;
      let existingUser;
      try{
            existingUser=await User.findOne({email})
      }catch(e){
            console.log(e)
      }
      if( !existingUser){ // checking of existing email address
            return res.status(404).json({messege:"could not find any id on this mail"});
      }
      const isPasswordCorrect=bcrypt.compareSync(password,existingUser.password); // matching password 
      if(! isPasswordCorrect){
            return res.status(400).json({messege:"password not matched"})
      }
      return res.status(200).json({messege:"Login Successful" ,user:existingUser})
})

// viewing uer data
app.get("/api/user",async (req,res)=>{
      let user;
      try{user= await User.find();

      } catch(e){
            console.log("cannot find")
      }
      if(!user){
            return res.status(404).json({messege:"No user found"})
      }
      return res.status(200).json({user})
});

// ----------------------------------------------------------------Blog routes here


// viewing blogs 
app.get("/api/blog", async(req,res)=>{
      let blogs;
      try{
            blogs= await Blog.find().populate("user");
      }catch(e){
            console.log(e)
      }
      if(!blogs){
            return res.status(404).json({messege:"no blogs found"})
      }
      return res.status(200).json({blogs})
})
// creating or posting new blog
app.post("/api/blog/add",async (req,res)=>{
      const {title,description,image,user}=req.body;
      // finding user who post the blog
      let existingUser;
      try{
            existingUser=await User.findById(user); 
      }catch(e){
            return console.log(e);
      }
      if(!existingUser){
            return res.status(400).json({messege:"Unable to find user by id"})
      }
      const blog =new Blog({
            title,
            description,
            image,
            user
      })
      try{
      //      // saving blog data to database according user with user data and in user db too
      //      const session =await mongoose.startSession();  //starting session 
      //      session.startTransaction();
           await blog.save(); // saving the blog
           existingUser.blogs.push(blog); // sending blog to the existinguser array
           await existingUser.save(); // saving the user also
          // await session.commitTransaction();   //commiting the transaction
      // await blog.save();
      }catch(e){
           console.log(e);
            return res.status(500).json({messege:e});
      }
      return res.status(200).json({blog});
})

// update blog 
app.put("/api/blog/update/:id", async(req,res,next)=>{
      const {title,description}=req.body;
      const blogId=req.params.id;
      let blog;
      try{blog=await Blog.findByIdAndUpdate(blogId,{
            title,description
      })
      }catch(e){
            return console.log(e);
      }
      if(!blog){
            return res.status(500).json({messege:"Unable to upadate"})
      }
      return res.status(200).json({blog});
        
})
//get blog by id
app.get("/api/blog/:id",async (req,res)=>{
      const id=req.params.id;
      let blog;
      try{
            blog= await Blog.findById(id);
      }catch(e){
            return console.log(e);
      }
      if(!blog){
            return res.status(404).json({messege:"No blog found"})
      }
      return res.status(200).json({blog})
})
// delete blog by id

app.delete("/api/blog/:id",async (req,res)=>{
      const id=req.params.id;
      let blog;
      try{
            blog=await Blog.findByIdAndRemove(id).populate('user'); // using populate getting user value of that blog
            await blog.user.blogs.pull(blog); // removing blog from user array as well
            await blog.user.save(); // saving  user after deleting blog
      }catch(e){
            console.log(e);
      }
      if(!blog){
            return res.status(500).json({messege:"Unable to delete"})
      }
      return res.status(200).json({messege:"successfully deleted"})
})


//------------------------------------------- getting blog by user

// getting blog of user by  that user id
 
app.get("/api/blog/user/:id",async (req,res)=>{
      const userId=req.params.id;
      let userBlog;
      try{
            userBlog= await User.findById( userId).populate('blogs') // will get full blog with user data
            // userBlog=user.blogs; //getting blogs of that user
      }catch(e){
            console.log(e)
      }
      if(!userBlog){
            return res.status(404).json({messege:"No blog found"})

      }
      return res.status(200).json({user:userBlog})
})



app.listen(port,(req,res)=>{
      console.log(`server is running on ${port}`)
      
})



 // -------------------- now backend is ready 
 // for creating frontend react ,in root directory > npx create-react-app frontend

 // then a new folder automatically will be created 