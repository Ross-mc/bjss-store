// server.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const swaggerUi = require("swagger-ui-express");
const {
  sequelize,
  Product,
  Order,
  Order_Item,
  Deal,
  Category,
  Supplier_Order,
  Supplier,
} = require("./database.js");
swaggerDocument = require("./swagger.json");

// PRODUCT ENDPOINTS

app.get("/api/products", async (req, res) => {
  const products = await Product.findAll();
  const productsJSON = products.map((product) => product.toJSON());
  res.json(productsJSON);
});

app.post("/api/products", async (req, res) => {
  const {
    CategoryId,
    shortDescription,
    longDescription,
    price,
    quantity,
    referenceNumber,
  } = req.body;

  const product = Product.build({
    CategoryId,
    shortDescription,
    longDescription,
    price,
    quantity,
    referenceNumber,
  });

  try {
    await product.save();
    res.status(200).json(product.toJSON());
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// SUPPLIER ENDPOINTS

app.get("/api/suppliers", async (req, res) => {
  const suppliers = await Supplier.findAll();
  const suppliersJSON = suppliers.map((supplier) => supplier.toJSON());
  res.json(suppliersJSON);
});

app.get("/api/suppliers/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    res.json(supplier.toJSON());
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
});

app.post("/api/suppliers", async (req, res) => {
  const { CustomerId, name } = req.body;
  const supplier = Supplier.build({
    CustomerId,
    name,
  });

  try {
    await supplier.save();
    res.status(200).json(supplier.toJSON());
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// SUPPLIER ORDER ENDPOINTS

app.get("/api/supplier_orders", async (req, res) => {
  const supplier_orders = await Supplier_Order.findAll();
  const supplier_ordersJSON = supplier_orders.map((supplier_order) =>
    supplier_order.toJSON()
  );
  res.json(supplier_ordersJSON);
});

app.post("/api/supplier_orders", async (req, res) => {
  const { SupplierId, ProductId, date, cost, quantity, paid } = req.body;
  const supplier_order = Supplier_Order.build({
    SupplierId,
    ProductId,
    date,
    cost,
    quantity,
    paid,
  });

  try {
    await supplier_order.save();
    res.status(200).json(order.toJSON());
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// ORDERS

app.get("/api/orders", async (req, res) => {
  const orders = await Order.findAll();
  const ordersJSON = orders.map((order) => order.toJSON());
  res.json(ordersJSON);
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const orderid = req.params.id;
    const order = await Order.findByPk(orderid);
    if (order == null) {
      res
        .status(404)
        .json(`Order ID = ${orderid} does not exist in the database`);
    }
    const returnObject = {
      ...order.toJSON(),
      orderItems: [],
    };
    const orderitems = await Order_Item.findAll({
      where: {
        OrderId: order.id,
      },
    });
    for (orderitem of orderitems) {
      returnObject.orderItems.push(orderitem.toJSON());
    }
    res.status(200).json(returnObject);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

app.post("/api/orders", async (req, res) => {
  const { address, orderItems } = req.body;
  let total = 0;
  for (const orderitem of orderItems) {
    const product = await Product.findOne({
      where: {
        id: orderitem.ProductId,
      },
    });
    if (product == null) {
      res.status(404).json({
        error: `Product ID = ${orderitem.ProductId} does not exist in the database`,
      });
    } else if (product.quantity < orderitem.quantity) {
      res.status(400).json({
        error: `Product ID = ${orderitem.ProductId} does not have enough stock to generate an order`,
      });
    } else {
      total += product.price * orderitem.quantity;
    }
  }

  try {
    const order = await Order.create({
      total,
      address,
    });

    const returnObject = {
      id: order.id,
      total: order.total,
      address: order.address,
      orderItems: [],
    };

    for (const orderitem of orderItems) {
      const product = await Product.findOne({
        where: {
          id: orderitem.ProductId,
        },
      });
      const createdOrderItem = await Order_Item.create({
        OrderId: order.id,
        ProductId: orderitem.ProductId,
        price: product.price,
        quantity: orderitem.quantity,
      });
      returnObject.orderItems.push({
        id: createdOrderItem.id,
        OrderId: order.id,
        ProductId: createdOrderItem.ProductId,
        price: product.price,
        quantity: createdOrderItem.quantity,
      });
    }
    res.status(200).json(returnObject);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// ORDER_ITEM ENDPOINTS

app.get("/api/order_items/:product_id", async (req, res) => {
  try {
    const orderitem_id = parseInt(req.params.product_id);
    const orderitems = await Order_Item.findAll({
      where: {
        ProductId: orderitem_id,
      },
    });
    const orderitemsJSON = orderitems.map((orderitem) => orderitem.toJSON());
    res.json(orderitemsJSON);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error,
    });
  }
});

app.post("/api/order_items", async (req, res) => {
  const { OrderId, ProductId, quantity } = req.body;

  const orderitem = Order_Item.build({
    OrderId,
    ProductId,
    quantity,
  });

  try {
    await orderitem.save();
    res.status(200).json(orderitem.toJSON());
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// DEALS ENDPOINTS

app.get("/api/deals", async (req, res) => {
  // TODO: retreive contacts and send to requester
  const deals = await Deal.findAll();
  const dealsJSON = deals.map((deal) => deal.toJSON());
  res.json(dealsJSON);
});

app.get("/api/deals/:id", async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);
    res.json(deal.toJSON());
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
});

app.post("/api/deals", async (req, res) => {
  const { ProductId, price, startDate, endDate } = req.body;

  const deal = Deal.build({
    ProductId,
    price,
    startDate,
    endDate,
  });

  try {
    await deal.save();
    res.status(200).json(deal.toJSON());
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// CATEGORIES ENDPOINTS

app.get("/api/categories", async (req, res) => {
  const categories = await Category.findAll();
  const categoriesJSON = categories.map((categories) => categories.toJSON());
  res.json(categoriesJSON);
});

app.get("/api/categories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const category = await Category.findOne({ where: { id } });
  const products = await Product.findAll({
    where: { CategoryId: category.id },
  });
  const productsJSON = products.map((products) => products.toJSON());
  res.json(productsJSON);
});

app.post("/api/categories", async (req, res) => {
  const { name } = req.body; //
  const category = Category.build({
    name,
  });

  try {
    await category.save();
    res.status(200).json(category.toJSON());
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// DUMMY DATA GENERATION

const main = async () => {
  await sequelize.sync({ force: true });

  const fruits = await Category.create({ name: "fruits" });
  const vegetables = await Category.create({ name: "vegetables" });

  const apple = await Product.create({
    shortDescription: "apple",
    longDescription: "apple",
    price: 1.0,
    quantity: 0,
    CategoryId: fruits.id,
  });
  const banana = await Product.create({
    shortDescription: "banana",
    longDescription: "banana",
    price: 1.0,
    quantity: 2,
    CategoryId: fruits.id,
  });
  const carrot = await Product.create({
    shortDescription: "carrot",
    longDescription: "carrot",
    price: 1.0,
    quantity: 5,
    CategoryId: vegetables.id,
  });
  const cabbage = await Product.create({
    shortDescription: "cabbage",
    longDescription: "cabbage",
    price: 1.0,
    quantity: 10,
    CategoryId: vegetables.id,
  });
};
main();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", express);
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(4001, () => {
  console.log("Server is up on port 4001");
});
