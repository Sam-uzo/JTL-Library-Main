const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const path = require("path");
const PORT = process.env.PORT || 10000;
const { format } = require("date-fns");
const dateObject = new Date();
const pool = require("./db");
const { Logger, errorLogger } = require("./Logger");
const cors = require("cors");
const whitelist = ["https://www.upwork.com", "http://localhost:10000"];
const frontendFiles = (request) => {
  return path.join(__dirname, "../", "Frontend", request);
};
const currentDate_time = format(dateObject, "yyyy/MM/dd hh:mm:ss");
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.static(frontendFiles("public")));

app.use(express.json());

app.post("/api/registration", async (req, res) => {
  try {
    const clientPathRequest = req.url;
    const clientDomain = req.headers.origin;
    const clientMethod = req.method;
    const clientHeaders = req.headers;
    const clientMessage = await req.body;
    const { fullname, email, password } = clientMessage;
    const fullnameExists =
      (
        await pool.query("SELECT * FROM user_profile WHERE fullname = $1", [
          fullname,
        ])
      ).rows[0]?.fullname.toLowerCase() == fullname.toLowerCase();
    const emailExists =
      (await pool.query("SELECT * FROM user_profile WHERE email = $1", [email]))
        .rows[0]?.email == email;
    const passwordExists =
      (await (
        await pool.query("SELECT * FROM user_profile WHERE password = $1", [
          password,
        ])
      ).rows[0]?.password) == password;
    if (fullnameExists == true) {
      res.status(200).json({
        message: `User ${fullname} already exists`,
      });
    } else if (emailExists == true) {
      res.status(200).json({
        message: `Email has already been used`,
      });
    } else if (passwordExists == true) {
      res.status(200).json({
        message: `Password has already been used`,
      });
    } else {
      const postgresQuery = await pool.query(
        "INSERT INTO user_profile(fullname,email,password) VALUES($1,$2,$3) RETURNING *",
        [fullname, email, password],
      );
      const newCreated = postgresQuery.rows[0].fullname;
      res.status(200).json({
        message: `User ${newCreated} has been registered successfully`,
      });
    }

    Logger(
      `${currentDate_time}\t${clientDomain}\t${clientPathRequest}\t${clientMethod}\t${clientHeaders}`,
    );
  } catch (error) {
    const clientPathRequest = req.url;
    const clientDomain = req.headers.origin;
    const clientMethod = req.method;
    const clientHeaders = req.headers;
    errorLogger(
      `${currentDate_time}\t${clientDomain}\t${clientPathRequest}\t${clientMethod}\t${error?.message || String(error)}`,
    );
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const clientLoginPathRequest = req.url;
    const clientLoginDomain = req.headers.origin;
    const clientLoginMethod = req.method;
    const clientLoginHeaders = req.headers;
    const { email, password } = await req.body;

    const userRegistered = (
      await pool.query("SELECT * FROM user_profile WHERE email = $1", [email])
    ).rows[0];
    const loginEmailExists = userRegistered?.email == email;
    const loginPasswordExists = userRegistered?.password == password;

    if (!loginEmailExists) {
      res.status(201).json({
        message: `Wrong email used!`,
      });
    } else if (!loginPasswordExists) {
      res.status(201).json({
        message: `Wrong password used!`,
      });
    } else if (loginEmailExists && loginPasswordExists) {
      res.status(200).json({
        message: `User login successfull`,
      });
    } else {
      res.status(201).json({ message: `Invalid login credentials` });
    }

    Logger(
      `${currentDate_time}\t${clientLoginDomain}\t${clientLoginPathRequest}\t${clientLoginHeaders}`,
    );
  } catch (error) {
    const clientPathRequest = req.url;
    const clientDomain = req.headers.origin;
    const clientMethod = req.method;
    const clientHeaders = req.headers;
    errorLogger(
      `${currentDate_time}\t${clientDomain}\t${clientPathRequest}\t${clientMethod}\t${error?.message || String(error)}`,
    );
  }
});

app.listen(PORT, () => {
  console.log("Listening on port ", PORT);
});
