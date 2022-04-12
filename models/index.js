const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");

// sequelize: instance of Sequelize : represent connection to DB
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  timezone: "+07:00",

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// testing connection
sequelize
  .authenticate()
  .then(() => console.log(`CONNECTION SUCCESSFULL . . .`))
  .catch((err) => console.log(`ERROR: ${err}`));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// all models
db.products = require("./productModel")(sequelize, DataTypes);
db.categories = require("./categoryModel")(sequelize, DataTypes);
db.users = require("./userModel")(sequelize, DataTypes);
db.addresses = require("./addressModel")(sequelize, DataTypes);
db.admins = require("./adminModel")(sequelize, DataTypes);
db.restock_headers = require("./restockHeaderModel")(sequelize, DataTypes);
db.restock_details = require("./restockDetailModel")(sequelize, DataTypes);
db.couriers = require("./courierModel")(sequelize, DataTypes);
db.carts = require("./cartModel")(sequelize, DataTypes);
db.invoice_headers = require("./invoiceHeaderModel")(sequelize, DataTypes);
db.payment_confirmations = require("./paymentConfirmationModel")(
  sequelize,
  DataTypes
);
db.invoice_details = require("./invoiceDetailModel")(sequelize, DataTypes);

// sync all model at once
db.sequelize.sync({ force: false }).then(() => {
  console.log(`re-sync done!`);
});

// relations
db.categories.hasMany(db.products);
db.products.belongsTo(db.categories);

db.users.hasMany(db.addresses);
db.addresses.belongsTo(db.users);

db.admins.hasOne(db.restock_headers);
db.restock_headers.belongsTo(db.admins);

db.restock_headers.hasMany(db.restock_details);
db.restock_details.belongsTo(db.restock_headers);

db.products.hasMany(db.restock_details);
db.restock_details.belongsTo(db.products);

db.users.hasMany(db.carts);
db.carts.belongsTo(db.users);

db.products.hasMany(db.carts);
db.carts.belongsTo(db.products);

db.users.hasOne(db.invoice_headers);
db.invoice_headers.belongsTo(db.users);

db.admins.hasOne(db.invoice_headers);
db.invoice_headers.belongsTo(db.admins);

db.invoice_headers.hasOne(db.couriers);
db.couriers.belongsTo(db.invoice_headers);

db.invoice_headers.hasOne(db.payment_confirmations);
db.payment_confirmations.belongsTo(db.invoice_headers);

db.admins.hasOne(db.payment_confirmations);
db.payment_confirmations.belongsTo(db.admins);

db.invoice_headers.hasMany(db.invoice_details);
db.invoice_details.belongsTo(db.invoice_headers);

// product sama invoice-detail ??????
db.products.hasMany(db.invoice_details);
db.invoice_details.belongsTo(db.products);

module.exports = db;
