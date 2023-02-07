const express = require("express");
const http = require("http");
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const users = require("./data").userDB;

//Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. With the help of express, APIs can be build very easily and quickly.

//Bcrypt is a library that helps us to hash passwords.

//Body-parser is required to handle HTTP POST request in Express.js. It extracts the entire body portion of an incoming request stream and exposes it on req.body.

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/register", async (req, res) => {
  try {
    let foundUser = users.find((data) => req.body.email === data.email);
    if (!foundUser) {
      let hashPassword = await bcrypt.hash(req.body.password, 10);

      let newUser = {
        id: Date.now(),
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
      };
      users.push(newUser);
      console.log("User list", users);

      res.send(
        "<div align ='center'><h2>Registration was successful</h2></div><br><div align='center'><a href='./login.html'>Login</a></div><br><div align='center'><a href='./registration.html'>Register Another User</a></div>"
      );
    } else {
      res.send(
        "<div align ='center'><h2>Email Already been Used</h2></div><br><div align='center'><a href='./registration.html'>Register Again</a></div>"
      );
    }
  } catch {
    res.send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    let foundUser = users.find((data) => req.body.email === data.email);
    if (foundUser) {
      let submittedPass = req.body.password;
      let storedPass = foundUser.password;

      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (passwordMatch) {
        let usrname = foundUser.username;
        res.send(
          `<div align ='center'><h2>You have logged in successfully</h2></div><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><div align='center'><a href='./login.html'>Logout</a></div>`
        );
      } else {
        res.send(
          "<div align ='center'><h2>Invalid Email or Password</h2></div><br><div align ='center'><a href='./login.html'>Login Again</a></div>"
        );
      }
    } else {
      let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
      await bcrypt.compare(req.body.password, fakePass);

      res.send(
        "<div align ='center'><h2>Invalid Email or Password</h2></div><br><br><div align='center'><a href='./login.html'>Login Again<a><div>"
      );
    }
  } catch {
    res.send("Internal server error");
  }
});

server.listen(3000, function () {
  console.log("server is listening on port: 3000");
});
