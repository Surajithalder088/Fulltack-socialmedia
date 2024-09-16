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
