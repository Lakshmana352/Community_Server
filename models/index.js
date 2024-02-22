const {Sequelize,DataTypes} = require("sequelize");

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_host = process.env.DB_HOST;
const db_pw = process.env.DB_PW;

const sequelize = new Sequelize(db_name,db_user,db_pw,{
  host: db_host,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(()=>{
    console.log("Database connected successfully.");
  })
  .catch((err)=>{
    console.log(`Error: ${err}`);
  });

const db = {};
db.sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user')(sequelize,DataTypes);
db.community = require('./community')(sequelize,DataTypes);
db.role = require('./role')(sequelize,DataTypes);
db.member = require('./member')(sequelize,DataTypes);

db.sequelize.options.logging = false;
db.sequelize.sync({force:false})
  .then(()=>{
    console.log('Re-Sync done successfully.');
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  })

module.exports = db;