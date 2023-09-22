const bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
const { redirect } = require('express/lib/response');

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '732733926826-h9vfvft404fo0i5eel2713ojb4iflhaq.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// let check_signup = false;
// let signup_copy;
router.post('/signup', function(req, res, next){

  // if already logged in -> meaning already signed up-> stop
  if ('user' in req.session) {
    // console.log("user already logged in");
    res.sendStatus(403);
    return;
  }

  let data = req.body;
  // console.log(data);

  // if req.body lacks these info
  if (!('first_name' in data) && !('last_name' in data) && !('dob' in data) && !('password' in data) && !('phone' in data) && !('email' in data)) {
    // console.log("lack info");
    res.sendStatus(401);
    return;
  }

  // if the provided info is empty
  if (data.first_name === '' && data.last_name === '' && data.password === '' && data.email === '') {
    // console.log("info empty");
    res.sendStatus(401);
    return;
  }

  req.pool.getConnection(function(cerr, connection){
    // handle connection error
    if (cerr){
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }
    // query part
    let query1 = "SELECT first_name, last_name, email FROM USERS WHERE email = ?";
    // check if user already exist in database (based on EMAIL)
    connection.query(query1, [data.email], function(qerr, rows, fileds){

      // release connection after query
      connection.release();

      // handle query error
      if (qerr){
        // console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0){
        // console.log("User with email already exists");
        res.sendStatus(403);
        return;
      }

       //////////////////////////////////////////////////////////////

      // Hash the password with 10 salt rounds
      bcrypt.hash(data.password, 10, function(err, hashedPassword) {
        if (err) {
          // console.log("Password hashing error");
          res.sendStatus(500);
          return;
        }

        // if no user with the given email and password exists, redirect back to '/signup'
        req.pool.getConnection(function(cerr2, connection2){
          // handle connection error
          if (cerr2){
            // console.log("Connection2 error");
            res.sendStatus(500);
            return;
          }

          // after checking and no errors raised, insert new user into USERS table
          let query2 = "INSERT INTO USERS(first_name, last_name, date_of_birth, user_password, email, mobile) VALUES(?, ?, ?, ?, ?, ?)";
          connection2.query(query2,
            [data.first_name, data.last_name, data.dob, hashedPassword, data.email, data.mobile],
            function(qerr2, rows, fileds){

              connection2.release();

              if (qerr2){
                // console.log("Query2 error");
                res.sendStatus(401);
                return;
              }

              // if insert sucess
              res.sendStatus(200);

          }); // connection.query2
        }); // req.pool.getConnection
      });

    }); // connection.query1

  }); // req.pool.getConnection



}); // router

// NORMAL LOGIN
router.post('/login', function (req, res, next) {

  // if already logged in, stop logging in again
  if ('user' in req.session) {
    // console.log("user already logged in");
    res.sendStatus(403);
    return;
  }

  let login_data = req.body;

  // if req.body lacks these info
  if (!('email' in login_data) && !('password' in login_data) && !('type' in login_data)) {
    res.sendStatus(401);
    return;
  }

  // if the provided info is empty
  if (login_data.email === '' && login_data.password === '' && login_data.type === '') {
    res.sendStatus(401);
    return;
  }


  // Connect to the database
  req.pool.getConnection(function (cerr, connection) {

    // handle connection error
    if (cerr) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    // query part
    let query;
    if (login_data.type === 'Club Member') {
      query = "SELECT user_id, first_name, last_name, email, user_password FROM USERS WHERE email = ?";
    } else if (login_data.type === 'Club Manager') {
      query = "SELECT user_id, first_name, last_name, email, manager_id, user_password FROM CLUB_MANAGERS INNER JOIN USERS ON CLUB_MANAGERS.manager_id = USERS.user_id WHERE USERS.email = ?";
    } else if (login_data.type === 'Admin') {
      query = "SELECT admin_id, first_name, last_name, email, admin_password FROM ADMINS WHERE email = ?";
    }else{
      res.sendStatus(403);
      return;
    }

    connection.query(query, [login_data.email], function (qerr, rows, fields) {

      // release connection after query (sucessful or not)
      connection.release();

      // handle query error
      if (qerr) {
        //console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0) {
        // There is a user

        // Compare the hashed password with login password
        let hashedPassword;
        if ( 'user_password' in rows[0]){
          hashedPassword = rows[0].user_password;
        }else if ( 'admin_password' in rows[0]){
          hashedPassword = rows[0].admin_password;
        }

        bcrypt.compare(login_data.password, hashedPassword, function(err, result) {
          if (err) {
            // console.log("Password comparison error");
            res.sendStatus(500);
            return;
          }

          // If passwords match
          if (result) {

            // store the necessary user info (name, email, user_type)
            [req.session.user] = rows;
            req.session.user_type = login_data.type;
            // console.log(JSON.stringify(req.session.user));
            res.json(req.session.user);
            return;

          } else {
            //Passwords don't match
            // console.log("Invalid password");
            res.sendStatus(403);
            return;
          }
        }); // bcrypt.compare

      } else {
        // No user
        res.sendStatus(401);
        return;
      }
    }); // connection.query
  });   // req.pool.getConnection
});

router.get('/checkLogin', function (req, res, next) {
  if ('user' in req.session) {
    let type = req.session.user_type;
    res.send(type);
    return;
  } else {
    res.sendStatus(401);
    return;
  }
});

// LOG OUT FOR NORMAL LOGIN
router.post('/logout', function (req, res, next) {

  if ('user' in req.session) {
    delete req.session.user;
    delete req.session.user_type;
    res.end();
  } else {
    res.sendStatus(403);
    return;
  }

});

// GOOGLE LOGIN
router.post('/google-login', async function (req, res, next) {

  // if already logged in, stop logging in again
  if ('user' in req.session) {
    // console.log("user already logged in");
    res.sendStatus(403);
    return;
  }

  // get the type of user that is loggin in
  let type = req.body.type;

  const ticket = await client.verifyIdToken({
    idToken: req.body.google_login_info.credential,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  let email = payload['email'];
  //console.log(payload['email']);

  if ('type' in req.body === false || req.body.type === '') {
    res.sendStatus(401);
    return;
  }

  // check against in the database if the user with the email exist
  // Connect to the database
  req.pool.getConnection(function (cerr, connection) {

    // handle connection error
    if (cerr) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    // query part
    let query;

    if (type === 'Club Member') {
      query = "SELECT user_id, first_name, last_name, email FROM USERS WHERE email = ?";
    } else if (type === 'Club Manager') {
      query = "SELECT user_id, first_name, last_name, email, manager_id FROM CLUB_MANAGERS INNER JOIN USERS ON CLUB_MANAGERS.manager_id = USERS.user_id WHERE USERS.email = ?";
    } else if (type === 'Admin') {
      query = "SELECT admin_id, first_name, last_name, email FROM ADMINS WHERE email = ?";
    }else{
      res.sendStatus(403);
      return;
    }

    connection.query(query, [email], function (qerr, rows, fields) {

      // release connection after query (sucessful or not)
      connection.release();

      // handle query error
      if (qerr) {
        // console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0) {
        // There is a user

        // store the necessary user info (name, email, user_type)
        [req.session.user] = rows;
        req.session.user_type = req.body.type;

        // console.log(JSON.stringify(req.session.user));
        res.json(req.session.user);

      } else {
        // No user
        res.sendStatus(401);
        return;
      }
    }); // connection.query
  });   // req.pool.getConnection
});

/* Route to get events table */
router.get('/view-events', function (req, res, next) {

  // if no target field in req.body OR target is empty
  if ( !('type' in req.query) || req.query.type === ''){
    // console.log("type invalid");
    res.sendStatus(403);
    return;
  }

  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query;
    // check for which type of new we want to see (all, past or upcoming news)
    if (req.query.type === 'all'){
      query = "SELECT EVENTS.*, CLUBS.club_name FROM EVENTS INNER JOIN CLUBS ON EVENTS.club_id = CLUBS.club_id WHERE EVENTS.private_event = 0";
    }else if (req.query.type === 'past'){
      query = "SELECT EVENTS.*, CLUBS.club_name FROM EVENTS INNER JOIN CLUBS ON EVENTS.club_id = CLUBS.club_id WHERE EVENTS.private_event = 0 AND event_date < CURDATE()";
    }else if (req.query.type === 'upcoming'){
      query = "SELECT EVENTS.*, CLUBS.club_name FROM EVENTS INNER JOIN CLUBS ON EVENTS.club_id = CLUBS.club_id WHERE EVENTS.private_event = 0 AND event_date >= CURDATE()";
    }else{
      connection.release();
      res.sendStatus(403);
      return;
    }

    connection.query(query, function (error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      if (rows.length === 0){
        res.sendStatus(404);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to get announcements table */
router.post('/view-news', function(req, res, next) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query;
    // check for which type of new we want to see (all, past or upcoming news)
    if ('type' in req.body && req.body.type === 'all'){
      query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0";
    }else if ('type' in req.body && req.body.type === 'past'){
      query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0 AND ANNOUNCEMENTS.post_date < CURDATE()";
    }else if ('type' in req.body && req.body.type === 'upcoming'){
      query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0 AND ANNOUNCEMENTS.post_date >= CURDATE()";
    }else{
      connection.release();
      res.sendStatus(403);
      return;
    }

    connection.query(query, function (error, rows, fields) {
      connection.release();

      if (error) {
        // console.log("Query error");
        res.sendStatus(500);
        return;
      }

      // if there is no rows that match query
      if (rows.length === 0){
        res.sendStatus(404);
        return;
      }

      res.json(rows);
    });
  });
});

router.post('/count-news', function(req, res, next){

  req.pool.getConnection(function (err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query;
    // check for which type of new we want to see (all, past or upcoming news)
    if ('type' in req.body && req.body.type === 'all'){
      query = "SELECT COUNT(post_id) AS length FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0";
    }else if ('type' in req.body && req.body.type === 'past'){
      query = "SELECT COUNT(post_id) AS length FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0 AND ANNOUNCEMENTS.post_date < CURDATE()";
    }else if ('type' in req.body && req.body.type === 'upcoming'){
      query = "SELECT COUNT(post_id) AS length FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0 AND ANNOUNCEMENTS.post_date >= CURDATE()";
    }else{
      connection.release();
      res.sendStatus(403);
      return;
    }

    connection.query(query, function (error, rows, fields) {
      connection.release();

      if (error) {
        // console.log("Query error");
        res.sendStatus(500);
        return;
      }
      if (rows.length === 0){
        res.sendStatus(404);
        return;
      }

      res.json(rows);
    });
  });
});

router.get('/search-news', function(req, res, next){

  // if no target field in req.body OR target is empty
  if ( !('target' in req.query) || req.query.target === ''){
    res.sendStatus(403);
    return;
  }

  req.pool.getConnection(function (err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0 AND ANNOUNCEMENTS.title LIKE ?";
    let pattern = '%' + req.query.target + '%';
    connection.query(query, [pattern], function (error, rows, fields) {
      connection.release();

      if (error) {
        // console.log("Query error");
        res.sendStatus(500);
        return;
      }

      // if there is no rows that match query
      if (rows.length === 0){
        res.sendStatus(404);
        return;
      }
      //console.log(rows);
      res.json(rows);
    });
  });

});


router.get('/count-search-news', function(req, res, next){

  // if no target field in req.body OR target is empty
  if ( !('target' in req.query) || req.query.target === ''){
    res.sendStatus(403);
    return;
  }

  req.pool.getConnection(function (err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT COUNT(ANNOUNCEMENTS.title) AS length FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 0 AND ANNOUNCEMENTS.title LIKE ?";
    let pattern = '%' + req.query.target + '%';
    connection.query(query, [pattern], function (error, rows, fields) {
      connection.release();

      if (error) {
        // console.log("Query error");
        res.sendStatus(500);
        return;
      }

      // if there is no rows that match query
      if (rows.length === 0){
        res.sendStatus(404);
        return;
      }
      //console.log(rows);
      res.json(rows);
    });
  });
});

router.get('/view-clubs', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM CLUBS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }
      //console.log(rows);
      res.json(rows);
    });
  });
});


module.exports = router;
