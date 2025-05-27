require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/mongoose");
const listEndpoints = require("express-list-endpoints");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  if (process.env.NODE_ENV !== "production") {
    console.log("\n--- Registered Endpoints ---");
    console.log(listEndpoints(app));
    console.log("----------------------------\n");
  }
});
