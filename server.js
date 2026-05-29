require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { seedData } = require("./controllers/spaceController");

const app = express();

connectDB();
seedData();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const spaceRoutes = require("./routes/spaceRoutes");
app.use("/", spaceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
