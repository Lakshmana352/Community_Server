module.exports = (sequelize,DataTypes) => {
  const member = sequelize.define('member',{
    id: {
      type:DataTypes.STRING,
      primaryKey: true
    },
    community: {
      type:DataTypes.STRING
    },
    user: {
      type:DataTypes.STRING
    },
    role: {
      type:DataTypes.STRING
    }
  },{updatedAt: false});

  return member;
}