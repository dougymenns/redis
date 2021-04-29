const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const connect = require("./connection");

const app = express();

//body-parser middleware
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// redis client
// const client = redis.createClient()

// client.on('connect',function(){
//     console.log('Connected to Redis')
// })

const Port = 3000;

app.get("/movies", (req, res) => {
  connect.createConnection().then((client) => {
    client.hgetall("movies", (err, results) => {
      if (results) {
        console.log(results);
        res.json({ res: JSON.parse(results.list) });
      } else {
        res.send(err);
      }
    });
    client.quit((err, reply) => {
      if (!err) {
        console.log(reply);
      } else {
        console.log(err);
      }
    });
  });
});

//admin add movie
app.post("/movie/add-comment", (req, res) => {
  connect.createConnection().then((client) => {
    //Use variables for readability
    const movies = JSON.stringify(req.body.list);
    console.log(movies);
    client.hset("movies", "list", movies, redis.print);
    client.hgetall("movies", (err, results) => {
      if (results) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
    client.quit((err, reply) => {
      if (!err) {
        console.log(reply);
      } else {
        console.log(err);
      }
    });
  });
});

// app.post("/movie/add-comment", (req, res) => {
//   connect.createConnection().then((client) => {
//     //Use variables for readability
//     const comments = JSON.stringify(req.body.comments);
//     const name = req.body.name;
//     const movie = req.body.movie;
//     const movie_name = "movie:";
//     const movie_id = movie_name.concat(movie);
//     console.log("movie name", movie_name.concat(movie));
//     client.hmset(movie_id, "movie", movie, "comments", comments);
//     client.hgetall(movie_name.concat(movie), (err, results) => {
//       if (results) {
//         res.send(results);
//       } else {
//         res.send(err);
//       }
//     });
//     client.quit((err, reply) => {
//       if (!err) {
//         console.log(reply);
//       } else {
//         console.log(err);
//       }
//     });
//   });
// });

//admin add movie
app.post("/movie/add-movie", (req, res) => {
  connect.createConnection().then((client) => {
    //Use variables for readability
    const comments = JSON.stringify(req.body.comments);
    const name = req.body.name;
    const movie = req.body.movie;
    const movie_name = "movie:";
    const movie_id = movie_name.concat(movie);
    console.log("movie name", movie_name.concat(movie));
    client.hset(movie_id, "name", name, "comments", comments, redis.print);
    client.hgetall(movie_name.concat(movie), (err, results) => {
      if (results) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
    client.quit((err, reply) => {
      if (!err) {
        console.log(reply);
      } else {
        console.log(err);
      }
    });
  });
});

//admin add movie
app.post("/movie/add-movies", (req, res) => {
  connect.createConnection().then((client) => {
    //Use variables for readability
    const movies = JSON.stringify(req.body.list);
    client.hset("movies", "list", movies, redis.print);
    client.hgetall("movies", (err, results) => {
      if (results) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
    client.quit((err, reply) => {
      if (!err) {
        console.log(reply);
      } else {
        console.log(err);
      }
    });
  });
});

//admin add users and user register
app.post("/add-users", (req, res) => {
  connect.createConnection().then((client) => {
    //Use variables for readability
    const name = req.body.name;
    const password = req.body.password;
    const user_name = "user:";
    const user_id = user_name.concat(name);
    console.log("user name", user_name.concat(name));
    client.hset(user_id, "name", name, "password", password, redis.print);
    client.hgetall(user_name.concat(name), (err, results) => {
      if (results) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
    client.quit((err, reply) => {
      if (!err) {
        console.log(reply);
      } else {
        console.log(err);
      }
    });
  });
});

//both searching user and login
app.post("/get-users", (req, res) => {
  connect.createConnection().then((client) => {
    const name = req.body.name;
    const password = req.body.password;
    const user_name = "user:";
    const user_id = user_name.concat(name);
    console.log(name)
    client.hgetall(user_name.concat(name), (err, results) => {
      if (results) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
    client.quit((err, reply) => {
      if (!err) {
        console.log(reply);
      } else {
        console.log(err);
      }
    });
  });
});

//delete user from users table
app.post("/delete-user", (req, res) => {
  connect.createConnection().then((client) => {
    const name = req.body.name;
    const password = req.body.password;
    const user_name = "user:";
    const user_id = user_name.concat(name);
    client.hdel(user_id, "name", "password", redis.print);
    client.hgetall(user_name.concat(name), (err, results) => {
      if (typeof results == "object") {
        console.log("res", typeof results);
        res.json({ res: results });
      } else {
        res.send(err);
      }
    });
    client.quit((err, reply) => {
      if (!err) {
        console.log(reply);
      } else {
        console.log(err);
      }
    });
  });
});

app.listen(Port, function () {
  console.log("Server started on port " + Port);
});
