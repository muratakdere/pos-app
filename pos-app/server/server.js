const express = require("express");
const cors = require("cors");
const salesRoutes = require("./routes/sales");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const reportsRoutes = require("./routes/reports");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/reports", reportsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
