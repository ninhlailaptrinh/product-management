const express = require("express");
const routeAdmin = require("./routes/admin/index.route.js");
const routeClient = require("./routes/client/index.route.js");
const database = require("./config/database");
const systemConfig = require("./config/system");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// Cấu hình port và mongodb
require("dotenv").config();

// Cấu hình method
var methodOverride = require("method-override");

// call port
const app = express();
const port = process.env.PORT;

// add pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));

//App local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.use(methodOverride("_method"));

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// express-flash
app.use(cookieParser("NINH-LAI-LAP-TRINH"));
app.use(
  session({
    secret: "NINH-LAI-LAP-TRINH",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
    },
  }),
);
app.use(flash());

// connect
database.connect();
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
