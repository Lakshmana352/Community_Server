const db = require('../models');
const asyncHandler = require('express-async-handler');
const {Snowflake} = require('@theinternetfolks/snowflake');


const pageSize = 10;

const createCommunity = asyncHandler(async(req,res)=>{
  const {name} = req.body;
  const slug = name.toLowerCase();
  const user = req.user;
  const resp = {
    status: true,
    content: {}
  }
  if(!name || name.split(' ').length>1 || name.length<5){
    resp.status = false;
    resp.content.data = {message: "Name of the community is need to be atleast 5letters and contains no spaces."};
    res.status(400).json(resp);return;
  }
  const check = await db.community.findOne({where:{slug:slug}});
  if(check){
    resp.status = false;
    resp.content.data = {message: `Community already exists with the name ${name}.`};
    res.status(400).json(resp);return;
  }
  const role = await db.role.findOne({where:{name:"Community Admin"}});
  const community = await db.community.create({
    id: Snowflake.generate(),
    name: name,
    slug: slug,
    owner: user.id
  });
  const member = await db.member.create({
    id: Snowflake.generate(),
    community: community.dataValues.id,
    user: user.id,
    role: role.id
  });
  console.log(member);
  resp.content.data = community.dataValues;
  res.status(200).json(resp);
});

const getAll = asyncHandler(async(req,res)=>{
  const communities = await db.community.findAll();
  const resp = {
    status: true,
    content: {
      data: []
    }
  }
  for(const community of communities) {
    const owner = await db.user.findOne({where:{id:community.dataValues.owner}});
    community.dataValues.owner = {
      id: owner.dataValues.id,
      name: owner.dataValues.name
    }
    // console.log(community.dataValues.owner);
  };
  // console.log(communities);
  resp.content.data = communities;
  res.status(200).json(resp)
});

const getAllMembers = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  const resp = {
    status: false,
    content: {
      meta:{},
      data:{}
    }
  }
  const check = await db.community.findOne({where:{slug:id}});
  if(!check){
    resp.content.data = {message: `Community with id ${id} doest not exists.`};
    res.status(400).json(resp);
  }
  let members = await db.member.findAll({where:{community:check.dataValues.id}});
  for(const member of members){
    const user = await db.user.findOne({where:{id:member.dataValues.user}});
    const role = await db.role.findOne({where:{id:member.dataValues.role}});
    member.dataValues.user = {
      id: user.dataValues.id,
      name: user.dataValues.name
    };
    // console.log(role);
    member.dataValues.role = {
      id: role.dataValues.id,
      name: role.dataValues.name
    }
  };
  const slicedMembers = members.slice(0, pageSize);
  resp.content.meta = {
    total: members.length,
    pages: Math.ceil(members.length/pageSize),
    page: 1
  }
  resp.status = true;
  resp.content.data = slicedMembers;
  res.status(200).json(resp);
})

const getMeOwner = asyncHandler(async(req,res)=>{
  const user = req.user;
  const resp = {
    status: true,
    content: {
      meta: {},
      data: {}
    }
  };
  const communities = await db.community.findAll({where:{owner:user.id}});
  const slicedCommunities = communities.slice(0,pageSize);
  resp.content.data = slicedCommunities
  resp.content.meta = {
    total: communities.length,
    pages: Math.ceil(communities.length/pageSize),
    page: 1
  }
  res.status(200).json(resp);
});

const getMeJoined = asyncHandler(async(req,res)=>{
  const user = req.user;
  const resp = {
    status: true,
    content: {
      meta: {},
      data: []
    }
  }
  const ids = await db.member.findAll({where:{user:user.id}});
  for(const id of ids){
    let community = await db.community.findOne({where:{id:id.dataValues.community}});
    const user = await db.user.findOne({where:{id:community.dataValues.owner}});
    community.dataValues.owner = {
      id: user.dataValues.id,
      name: user.dataValues.name
    }
    if(resp.content.data.length < 10) resp.content.data.push(community.dataValues);
    else break;
  }
  resp.content.meta = {
    total: ids.length,
    pages: Math.ceil(ids.length/pageSize),
    page: 1
  }
  res.status(200).json(resp);
})

module.exports = {
  createCommunity,
  getAll,
  getAllMembers,
  getMeOwner,
  getMeJoined
}