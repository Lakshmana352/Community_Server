module.exports = (sequelize,DataTypes) => {
  const community = sequelize.define('community',{
    id:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING(128)
    },
    slug:{
      type: DataTypes.STRING
    },
    owner:{
      type: DataTypes.STRING
    }
  });

  return community;
}