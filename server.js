const express = require("express");
const cors = require("cors");
const route = require("./routes/routes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", route);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
