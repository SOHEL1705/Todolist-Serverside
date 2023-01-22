const connectToMongo = require("./DataBase");
const express = require("express");
var cors = require('cors') 
connectToMongo();

const app = express();

app.use(cors())
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(5000);

