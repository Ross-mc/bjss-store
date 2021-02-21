const sequelizePackage = require("sequelize");
const { Sequelize, DataTypes } = sequelizePackage;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

try {
  sequelize.authenticate();
  console.log("Database connection successful.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// MODELS

const Product = sequelize.define("Product", {
  CategoryId: DataTypes.INTEGER,
  SupplierId: DataTypes.INTEGER,
  shortDescription: DataTypes.STRING,
  longDescription: DataTypes.STRING,
  price: DataTypes.FLOAT,
  quantity: DataTypes.INTEGER,
  referenceNumber: DataTypes.STRING,
});

const Supplier = sequelize.define("Supplier", {
  CustomerId: DataTypes.INTEGER,
  name: DataTypes.STRING,
});

const Supplier_Order = sequelize.define("Supplier_Order", {
  SupplierId: DataTypes.INTEGER,
  ProductId: DataTypes.INTEGER,
  date: DataTypes.DATE,
  cost: DataTypes.FLOAT,
  quantity: DataTypes.INTEGER,
  paid: DataTypes.BOOLEAN,
});

const Order = sequelize.define("Order", {
  address: DataTypes.STRING,
  total: DataTypes.INTEGER,
});

const Order_Item = sequelize.define(
  "Order_Item",
  {
    OrderId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    quantity: DataTypes.STRING,
  },
  {
    timestamps: false,
  }
);

const Deal = sequelize.define("Deal", {
  ProductId: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
});

const Category = sequelize.define("Category", {
  name: DataTypes.STRING,
});

const Customer = sequelize.define("Customer", {
  name: DataTypes.STRING,
  addressLineOne: DataTypes.STRING,
  addressLineTwo: DataTypes.STRING,
  addressLineThree: DataTypes.STRING,
  addressPostcode: DataTypes.STRING,
  emailAddress: DataTypes.STRING,
  passwordHash: DataTypes.STRING,
  registered: DataTypes.BOOLEAN,
});

// RELATIONS

Order.hasMany(Order_Item, {
  foreignkey: "OrderId",
  sourceKey: "id",
});

Order_Item.belongsTo(Order, {
  foreignKey: "OrderId",
  targetKey: "id",
});

Category.hasMany(Product, {
  foreignKey: "CategoryId",
  sourceKey: "id",
});

Product.belongsTo(Category, {
  foreignKey: "CategoryId",
  targetKey: "id",
});

Product.hasMany(Order_Item, {
  foreignKey: "ProductId",
  sourceKey: "id",
});

Order_Item.belongsTo(Product, {
  foreignKey: "ProductId",
  targetKey: "id",
});

Product.hasMany(Deal, {
  foreignKey: "ProductId",
  sourceKey: "id",
});

Deal.belongsTo(Product, {
  foreignKey: "ProductId",
  targetKey: "id",
});

Supplier.hasMany(Supplier_Order, {
  foreignKey: "SupplierId",
  sourceKey: "id",
});

Supplier_Order.belongsTo(Supplier, {
  foreignKey: "SupplierId",
  targetKey: "id",
});

Product.hasMany(Supplier_Order, {
  foreignKey: "ProductId",
  sourceKey: "id",
});

Supplier_Order.belongsTo(Product, {
  foreignKey: "ProductId",
  targetKey: "id",
});

module.exports = {
  sequelize,
  Product,
  Supplier,
  Supplier_Order,
  Order,
  Order_Item,
  Deal,
  Category,
  Customer,
};
