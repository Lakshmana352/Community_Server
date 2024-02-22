const express = require("express");
const dotenv = require("dotenv");dotenv.config();
require("./models");

const app = express();
app.use(express.json());

// app.use('/',(req,res)=>{
//   res.json({message: "Successful"});
// });

app.use('/v1/role',require('./routes/roleRoutes'));

app.use('/v1/auth',require('./routes/userRoutes'));

app.use('/v1/community',require('./routes/communityRoutes'));

app.use('/v1/member',require('./routes/memberRoutes'));

app.listen(process.env.SERVER_PORT,()=>{
  console.log(`Server running successfully.`);
});

module.exports = app;