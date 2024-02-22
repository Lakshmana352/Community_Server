const db = require('../models');
const asyncHandler = require('express-async-handler');
const {Snowflake} = require('@theinternetfolks/snowflake');

const createRole = asyncHandler(async(req,res)=>{
  const {name} = req.body;
  const response = {
    status: true,
    content: {
    }
  }
  if(!name){
    response.status = false;
    response.content.data = {message:"Name should not be empty."}
    res.status(400).json(response);
    return;
  }
  const check = await db.role.findOne({where:{name:name}});
  if(check){
    response.status = false;
    response.content.data = {message:`Role with name ${name} already exits.`}
    res.status(400).json(response);
    return;
  }
  const role = await db.role.create({id:Snowflake.generate(),name:name});
  console.log(role);
  // const jsonres = JSON.stringify(response);
  response.content.data = role;
  res.status(200).json(response);
});

const getAllRoles = asyncHandler(async(req,res)=>{
  const roles = await db.role.findAll();
  const pageSize = 10;
  const currentPage = 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const slicedRoles = roles.slice(startIndex, endIndex);
  const response = {
    status: true,
    content: {
      meta: {
        total: roles.length,
        pages: Math.ceil(roles.length / pageSize),
        page: 1
      },
      data: slicedRoles
    }
  };
  // const jsonres = JSON.stringify(response);
  res.status(200).json(response);
})

module.exports = {
  createRole,
  getAllRoles
}