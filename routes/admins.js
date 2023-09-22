var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.use('/', function(req, res, next){
  // if not logged in or
  // NOT logged in as admin
  if (!('user' in req.session) || !('admin_id' in req.session.user)){
    //console.log("Not logged in OR not logged in as admin");
    res.sendStatus(403);
  }else{
    next();
  }
});

router.get('/checkLogin', function (req, res, next) {
  if ( 'user' in req.session && 'admin_id' in req.session.user) {
    //console.log("logged in as admin");
    res.sendStatus(200);
    return;
  } else {
    res.sendStatus(401);
    return;
  }
});


// view admin personal's info
router.get('/info', function(req, res, next){

  let adminID = req.session.user.admin_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT first_name, last_name, date_of_birth, email, mobile FROM ADMINS WHERE admin_id = ?";

    connection.query(query, [adminID], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length === 0){
        res.sendStatus(404);
        return;
      }

      res.json(rows);

    }); // connection.query

  }); // req.pool.getConnection
});

// update admin details
router.post('/update-info', function(req, res, next) {
  var newFName = req.body.new_fname;
  var newLName = req.body.new_lname;
  var newPassword = req.body.new_password;
  var newEmail = req.body.new_email;
  var newMobile = req.body.new_mobile;
  var adminID = req.session.user.admin_id;

  if (!req.body.newPassword) {
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      let query = "UPDATE ADMINS SET first_name = ?, last_name = ?, email = ?, mobile = ? WHERE admin_id = ?";

      connection.query(query, [newFName, newLName, newEmail, newMobile, adminID], function(error, rows, fields) {
        if (error) {
          res.sendStatus(401);
          return;
        }

        res.sendStatus(200);
      });
    });

  } else {

    // Hash the password with 10 salt rounds
    bcrypt.hash(newPassword, 10, function(err, hashedPassword) {
      if (err) {
        // console.log("Password hashing error");
        res.sendStatus(500);
        return;
      }

      req.pool.getConnection(function(err, connection) {
        if (err) {
          // console.log("Connection error");
          res.sendStatus(500);
          return;
        }

        let query = "UPDATE ADMINS SET first_name = ?, last_name = ?, admin_password = ?, email = ?, mobile = ? WHERE admin_id = ?";

        connection.query(query, [newFName, newLName, hashedPassword, newEmail, newMobile, adminID], function(error, rows, fields) {
          connection.release();

          if (error) {
            // console.log("Query error");
            res.sendStatus(401);
            return;
          }

          res.sendStatus(200);

        }); // connection.query

      }); // req.pool.getConnection

    }); // bcrypt.hash
  }
});



/* Route to view all users */
router.get('/viewUsers', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT user_id, first_name, last_name, email FROM USERS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to remove users from database */
router.delete('/deleteUsers', function(req, res, next) {
  var userID = req.body.user_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM USERS WHERE user_id = ?";

    connection.query(query, [userID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to view all clubs */
router.get('/viewClubs', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT club_id, club_name, manager_id FROM CLUBS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.delete('/deleteClubs', function(req, res, next) {
  var clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM CLUBS WHERE club_id = ?";

    connection.query(query, [clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to remove specific clubs */
router.delete('/deleteUsers', function(req, res, next) {
  var clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM CLUBS WHERE user_id = ?";

    connection.query(query, [clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to view all other admins */
router.get('/viewAdmins', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT admin_id, first_name, last_name, date_of_birth, email, mobile FROM ADMINS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to sign up other admins */
router.post('/registerAdmins', function(req, res, next) {
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var dob = req.body.dob;
  var adminPassword = req.body.password;
  var adminEmail = req.body.email;
  var adminMobile = req.body.mobile;

  // To check if admin already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM ADMINS WHERE (first_name = ? AND last_name = ?) OR email = ?";

    connection.query(query, [firstName, lastName, adminEmail], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        //console.log("Admin already exists");
        res.sendStatus(403);
        return;
      }

      // Hash the password with 10 salt rounds
      bcrypt.hash(adminPassword, 10, function(err, hashedPassword) {
        if (err) {
          //console.log("Password hashing error");
          res.sendStatus(500);
          return;
        }

        // if no user with the given email and password exists, redirect back to '/signup'
        req.pool.getConnection(function(cerr, connection) {
          if (cerr) {
            res.sendStatus(500);
            return;
          }

          let query2 = "INSERT INTO ADMINS (first_name, last_name, date_of_birth, admin_password, email, mobile) VALUES (?, ?, ?, ?, ?, ?)";

          connection.query(query2, [firstName, lastName, dob, hashedPassword, adminEmail, adminMobile], function(error, rows, fields) {
            connection.release();

            if (error) {
              res.sendStatus(500);
              return;
            }

            res.sendStatus(200);
          }); // connection.query2
        }); // req.pool.getConnection2
      }); // bcrypt.hash
    }); // connection.query1
  }); // req.pool.getConnection1
});


/* Route to view pending club */
router.get("/viewPendingClubs", function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM PENDING_CLUBS";

    connection.query(query, function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});



/* Route to approve pending club */
// // delete club from pending list and add to official club list
router.post('/addClub', function(req, res, next) {
  var clubName = req.body.club_name;
  var clubDescription = req.body.club_description;
  var clubManager = req.body.club_manager_id;
  var clubPhone = req.body.manager_phone;
  var clubEmail = req.body.club_email;

  // To check if club already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM CLUBS WHERE club_name = ?";

    connection.query(query, [clubName], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        //console.log("Club already exists");
        res.sendStatus(403);
        return;
      }

      // If passes above, add to pending_clubs table
      req.pool.getConnection(function(cerr, connection2) {
        if (cerr) {
          //console.log("Connection error 2");
          res.sendStatus(500);
          return;
        }

        let query2 = "INSERT INTO CLUBS (club_name, club_description, manager_id, phone, email) VALUES (?, ?, ?, ?, ?)";

        connection2.query(query2, [clubName, clubDescription, clubManager, clubPhone, clubEmail], function(error, rows, fields) {
          connection2.release();

          if (error) {
            //console.log(error);
            //console.log("Query error 2");
            res.sendStatus(401);
            return;
          }

          req.pool.getConnection(function(cerr2, connection3){

            if (cerr2){
              //console.log("Connection error 3");
              res.sendStatus(500);
              return;
            }

            let query3 = "DELETE FROM PENDING_CLUBS WHERE club_name = ? AND club_email = ?";

            connection3.query(query3, [clubName, clubEmail], function(error2, rows, fields){
              connection3.release();

              if (error2) {
                //console.log(error2);
                //console.log("Query error 3");
                res.sendStatus(404);
                return;
              }

              res.sendStatus(200);
            }); // connection.query3
          }); // req.pool.getConnection3
        }); // connection.query2
      }); // req.pool.getConnection2
    }); // connection.query1
  }); // req.pool.getConnection1
});

router.post('/rejectClub', function(req, res, next){
  let clubName = req.body.club_name;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "UPDATE PENDING_CLUBS SET approve_status = -1 WHERE club_name = ? AND approve_status = 0";

    connection.query(query, [clubName], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

module.exports = router;