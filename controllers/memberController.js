const db = require('../models');
const {Snowflake} = require('@theinternetfolks/snowflake');
const asyncHandler = require('express-async-handler')

const addMember = asyncHandler(async(req,res)=>{
  const communityId = req.body.community;
  const userId = req.body.user;
  const roleId = req.body.role;

  const resp = {
    status: false,
    content: {
      data: {}
    }
  }
  if(!communityId || !userId || !roleId){
    resp.content.data = {message: "Community, User, Role ids are required."};
    res.status(400).json(resp);
    return;
  }
  const community = await db.community.findOne({where:{id:communityId}});
  const user = await db.user.findOne({where:{id:userId}});
  const role = await db.role.findOne({where:{id:roleId}});

  if(!community || !user || !role){
    resp.content.data = {message: "Given one or more ids are not found."};
    res.status(400).json(resp);
    return;
  }

  const admin = req.user;
  const adminRoleId = await db.role.findOne({where:{name:"Community Admin"}});
  const checkAdmin = await db.member.findOne({where:{community:communityId, user: admin.id, role:adminRoleId.dataValues.id}});
  if(!checkAdmin){
    resp.content.data = {message: `Only community admins are allowed to add members.`};
    res.status(400).json(resp);
    return;
  }
  const check = await db.member.findOne({where:{community:communityId, user:userId}});
  if(check){
    resp.content.data = {message: `User with id ${userId} is already member of the community.`};
    res.status(400).json(resp);
    return;
  }

  const member = await db.member.create({
    id: Snowflake.generate(),
    community: communityId,
    user: userId,
    role: roleId
  });

  if(!member){
    resp.content.data = {message: "Internal error try again."};
    res.status(500).json(resp);
    return;
  }
  resp.status = true;
  resp.content.data = member.dataValues;
  res.status(200).json(resp);
});

const removeMember = asyncHandler(async(req,res)=>{
  const currentUser = req.user;
  const {id} = req.params;
  const resp = {
    status:false
  }
  const checkId = await db.member.findOne({where:{id:id}});
  if(!checkId){
    resp.content = {};
    resp.content.data = {message: `With id ${id} there is no member.`};
    res.status(400).json(resp);return;
  }
  if(currentUser.id == checkId.dataValues.user){
    resp.content = {};
    resp.content.data = {message: "You cannot remove yourself from the community."};
    res.status(403).json(resp);return;
  }
  const currentUserRole = await db.member.findOne({where:{community:checkId.dataValues.community,user:currentUser.id}});
  if(!currentUserRole){
    resp.content = {};
    resp.content.data = {message: `Only community members are allowed to add or remove members.`}
    res.status(403).json(resp);return;
  }
  const adminRoleId = await db.role.findOne({where:{name:"Community Admin"}});
  const moderatorRoleId = await db.role.findOne({where:{name:"Community Moderator"}});

  if(currentUserRole.dataValues.role == adminRoleId.dataValues.id){
    await db.member.destroy({where:{id:id}});
    resp.status = true;
    res.status(200).json(resp);
    return;
  }

  if(currentUserRole.dataValues.role == moderatorRoleId.dataValues.id){
    if(checkId.dataValues.role == adminRoleId.dataValues.id){
      resp.content = {};
      resp.content.data = {message:"Moderators cannot remove admins."};
      res.status(403).json(resp);return;
    }
    else{
      await db.member.destroy({where:{id:id}});
      resp.status = true;
      res.status(200).json(resp);
      return;
    }
  }
  resp.content = {};
  resp.content.data = {message: "Members cannot remove other members of the community."};
  res.status(403).json(resp);
})

module.exports = {
  addMember,
  removeMember
}