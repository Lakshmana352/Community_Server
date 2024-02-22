module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user',{
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(64)
    },
    email: {
      type: DataTypes.STRING(128)
    },
    password: {
      type: DataTypes.STRING(64)
    }
  },{updatedAt:false});

  return user;
}