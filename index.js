const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
require("dotenv").config();

const app = express();
const cors = require("cors");
const PORT = 5000;
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Razorpay routes
app.post("/order", async (req, res) => {
    try {
      const razorpay = new Razorpay({
        key_id: "rzp_test_WJBeJ4wZWRWu3i",
        key_secret: "5SxBz3L5IZh2SQRkjFwgWzJ0",
      });
      const options = req.body;
      const order = await razorpay.orders.create(options);
  
      if (!order) {
        return res.status(500).json({ message: "error" });
      }
      res.json(order);
    } catch (err) {
      console.log(err);
      res.status(500).send("error");
    }
  });
  
  app.post("/order/validate", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const hash = crypto.createHmac("sha256", "5SxBz3L5IZh2SQRkjFwgWzJ0");
    hash.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = hash.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: "Transaction is not legit!" });
    }
    res.json({
      message: "success",
      orderId: razorpay_order_id,
      paymentid: razorpay_payment_id,
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  