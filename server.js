const express = require("express");
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const PORT = process.env.PORT || 5000;

// create instance
const app = express();

app.use(express.json());
app.use(cors());
app.use(bearerToken());


app.use('/public', express.static('public'))

// routers
const productRouter = require("./routers/productRouter");
const categoryRouter = require("./routers/categoryRouter");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const cartRouter = require("./routers/cartRouter");
const courierRouter = require('./routers/courierRouter');

// main routes
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use('/courier', courierRouter)

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to my api" });
});

app.listen(PORT, () => console.log(`server running: ${PORT}`));
