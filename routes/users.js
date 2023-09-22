var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.use('/', function(req, res, next){
  if (!('user' in req.session)){
    // console.log("Message at the top of users.js: User has not logged in");
    res.sendStatus(401);
    return;
  }else{
    next();
  }
});

// User join clubs
router.post('/join-club', function (req, res, next) {

  let id_of_user = req.session.user.user_id;

  req.pool.getConnection(function (cerr, connection) {
    // handle connection error
    if (cerr) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }
    // query part
    let query1 = "SELECT club_id, user_id FROM CLUB_MEMBERS WHERE club_id = ? AND user_id = ?";
    // check if user already exist in database (based on first name, last name, password, EMAIL)
    connection.query(query1, [req.body.club_id, id_of_user], function (qerr, rows, fileds) {

      // release connection after query
      connection.release();

      // handle query error
      if (qerr) {
        // console.log("Query error");
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        // console.log("Club Member already exists");
        res.sendStatus(403);
        return;
      }

      //////////////////////////////////////////////////////////////

      // if no user with the given email and password exists, redirect back to '/signup'
      req.pool.getConnection(function (cerr2, connection2) {
        // handle connection error
        if (cerr2) {
          // console.log("Connection2 error");
          res.sendStatus(500);
          return;
        }

        // after checking and no errors raised, insert new user into USERS table
        let query2 = "INSERT INTO CLUB_MEMBERS(club_id, user_id) VALUES(?, ?)";
        connection2.query(query2, [req.body.club_id, id_of_user],
          function (qerr2, rows, fileds) {

            connection2.release();

            if (qerr2) {
              // console.log("Query2 error");
              res.sendStatus(401);
              return;
            }

            // if insert sucess
            res.sendStatus(200);

          }); // connection.query2
      }); // req.pool.getConnection

    }); // connection.query1

  }); // req.pool.getConnection
}); // router



// User view joined clubs
router.get('/view-joined-clubs', function(req, res, next){
  let userID = req.session.user.user_id;

  req.pool.getConnection(function (err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT CLUBS.club_name, CLUBS.club_id FROM CLUBS INNER JOIN CLUB_MEMBERS ON CLUBS.club_id = CLUB_MEMBERS.club_id WHERE CLUB_MEMBERS.user_id = ?";

    connection.query(query, [userID], function (error, rows, fields) {
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

/* Route to request to form a new club */
router.post('/add-club-request', function(req, res, next) {
  var clubName = req.body.club_name;
  var clubDescription = req.body.club_description;
  var clubManager = req.session.user.user_id;
  var clubEmail = req.body.club_email;
  var managerFirstName = req.session.user.first_name;
  var managerLastName = req.session.user.last_name;
  var managerEmail = req.session.user.email;

  // console.log(req.session.user);


  // To check if club already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      // console.log("Connection error 1");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM CLUBS WHERE club_name = ?";

    connection.query(query, [clubName], function(error, rows, fields) {
      connection.release();

      if (error) {
        // console.log(error);
        // console.log("Query error 1");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0) {
        // console.log("Club already exists");
        res.sendStatus(403);
        return;
      }

      // If passes above, add to pending_clubs table
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          // console.log("Connection error 2");
          res.sendStatus(500);
          return;
        }

        let query2 = "INSERT INTO PENDING_CLUBS (club_name, club_description, club_email, club_manager_id, manager_first_name, manager_last_name, manager_email) VALUES (?,?,?,?,?,?,?)";

        connection.query(query2, [clubName, clubDescription, clubEmail, clubManager, managerFirstName, managerLastName, managerEmail], function(error, rows, fields) {
          connection.release();

          if (error) {
            // console.log(error);
            // console.log("Query error 2");
            res.sendStatus(401);
            return;
          }

          res.sendStatus(200);
        });
      });
    });
  });
});


// User view updates from clubs
router.get('/view-member-news', function(req, res, next){

  let userID = req.session.user.user_id;

  req.pool.getConnection(function (err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT ANNOUNCEMENTS.title, ANNOUNCEMENTS.post_message, ANNOUNCEMENTS.post_date, CLUBS.club_name AS author FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id INNER JOIN CLUB_MEMBERS ON CLUB_MEMBERS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 1 AND CLUB_MEMBERS.user_id = ?";

    connection.query(query, [userID], function (error, rows, fields) {
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

// count number of member news
router.get('/count-member-news', function(req, res, next){

  let userID = req.session.user.user_id;

  req.pool.getConnection(function (err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT COUNT(ANNOUNCEMENTS.post_id) AS length FROM ANNOUNCEMENTS INNER JOIN CLUBS ON ANNOUNCEMENTS.club_id = CLUBS.club_id INNER JOIN CLUB_MEMBERS ON CLUB_MEMBERS.club_id = CLUBS.club_id WHERE ANNOUNCEMENTS.private_message = 1 AND CLUB_MEMBERS.user_id = ?";

    connection.query(query, [userID], function (error, rows, fields) {
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


// User RSVP for events
router.post('/join-event', function(req, res, next){

  let id_of_user = req.session.user.user_id;

  req.pool.getConnection(function (cerr, connection) {
    // handle connection error
    if (cerr) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }
    // query part
    let query1 = "SELECT event_id, participant_id FROM EVENTGOERS WHERE event_id = ? AND participant_id = ?";
    // check if user already exist in event record based on event_id and participant_id (aka user_id)
    connection.query(query1, [req.body.event_id, id_of_user], function (qerr, rows, fileds) {

      // release connection after query
      connection.release();

      // handle query error
      if (qerr) {
        // console.log("Query error");
        res.sendStatus(401);
        return;
      }

      if (rows.length > 0) {
        // console.log("Event already registered");
        res.sendStatus(403);
        return;
      }

      //////////////////////////////////////////////////////////////

      // if no user with the given email and password exists, redirect back to '/signup'
      req.pool.getConnection(function (cerr2, connection2) {
        // handle connection error
        if (cerr2) {
          // console.log("Connection2 error");
          res.sendStatus(500);
          return;
        }

        // after checking and no errors raised, insert new user into USERS table
        let query2 = "INSERT INTO EVENTGOERS(event_id, participant_id) VALUES(?, ?)";
        connection2.query(query2, [req.body.event_id, id_of_user],
          function (qerr2, rows, fileds) {

            connection2.release();

            if (qerr2) {
              // console.log("Query2 error");
              res.sendStatus(401);
              return;
            }

            // if insert sucess
            res.sendStatus(200);

          }); // connection.query2
      }); // req.pool.getConnection

    }); // connection.query1

  }); // req.pool.getConnection
});

// User view joined events
router.get('/view-events', function(req, res, next){

  // console.log(req.query.type);

  if ( !('type' in req.query) ){
    // console.log("No query for type included");
    res.sendStatus(403);
    return;
  }

  let userID = req.session.user.user_id;

  req.pool.getConnection(function (err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query;
    if (req.query.type === 'joined'){
      query = "SELECT EVENTS.event_name, EVENTS.event_date, EVENTS.event_location, EVENTS.event_message, CLUBS.club_name FROM EVENTS INNER JOIN EVENTGOERS ON EVENTS.event_id = EVENTGOERS.event_id INNER JOIN CLUBS ON EVENTS.club_id = CLUBS.club_id WHERE EVENTGOERS.participant_id = ?";
    } else if (req.query.type === 'upcoming'){
      query = "SELECT EVENTS.event_name, EVENTS.event_date, EVENTS.event_location, EVENTS.event_message, CLUBS.club_name FROM EVENTS INNER JOIN CLUBS ON EVENTS.club_id = CLUBS.club_id WHERE EVENTS.event_date >= CURDATE() AND EVENTS.club_id IN (SELECT club_id FROM CLUB_MEMBERS WHERE user_id = ?)";
    } else{
      // console.log("cannot find events based on query");
      connection.release();
      res.sendStatus(404);
      return;
    }


    connection.query(query, [userID], function (error, rows, fields) {
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



// User view upcoming events from join club


// User get personal details
router.get('/info', function(req, res, next){

  let userID = req.session.user.user_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT first_name, last_name, date_of_birth, email, mobile FROM USERS WHERE user_id = ?";

    connection.query(query, [userID], function(error, rows, fields) {
      connection.release();

      if (error) {
        // console.log("Query error");
        res.sendStatus(401);
        return;
      }

      //console.log(rows);

      if (rows.length === 0){
        res.sendStatus(404);
        return;
      }

      res.json(rows);

    }); // connection.query

  }); // req.pool.getConnection

});


// User edit personal details
router.post('/update-info', function(req, res, next) {
  var newFName = req.body.new_fname;
  var newLName = req.body.new_lname;
  var newPassword = req.body.new_password;
  var newEmail = req.body.new_email;
  var newMobile = req.body.new_mobile;
  var userID = req.session.user.user_id;

  if (!req.body.newPassword) {
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      let query = "UPDATE USERS SET first_name = ?, last_name = ?, email = ?, mobile = ? WHERE user_id = ?";

      connection.query(query, [newFName, newLName, newEmail, newMobile, userID], function(error, rows, fields) {
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

        let query = "UPDATE USERS SET first_name = ?, last_name = ?, user_password = ?, email = ?, mobile = ? WHERE user_id = ?";

        connection.query(query, [newFName, newLName, hashedPassword, newEmail, newMobile, userID], function(error, rows, fields) {
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

// Route to quit a club
router.delete('/quitClub', function(req, res, next) {
  var userID = req.body.user_id;
  var clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM CLUB_MEMBERS WHERE user_id = ? AND club_id = ?";

    connection.query(query, [userID, clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

// User views subscription option to club news and special events
router.post('/view-club-subscribe', function(req, res,next){
  let id_of_user = req.session.user.user_id;
  // console.log(req.body);

  req.pool.getConnection(function(cerr, connection){

    if (cerr){
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT news_notif, event_notif FROM EMAIL_NOTIF where club_id = ? AND user_id = ?";
    connection.query(query, [req.body.club_id, id_of_user], function(qerr, rows, fields){
      connection.release();

      if (qerr){
        // console.log("Query error");
        res.sendStatus(401);
        return;
      }


      if (rows.length === 0){
        // console.log("Cannot subscriptions option of user");
        res.sendStatus(404);
        return;
      }

      res.json(rows);
    }); // connection.query
  }); // req.pool.getConnection
});

// User subscribes/unsubscribes to club news, special events
router.post('/update-club-subscribe', function(req, res, next){
  //console.log(req.body);

  let id_of_user = req.session.user.user_id;

  req.pool.getConnection(function (cerr, connection) {
    // handle connection error
    if (cerr) {
      // console.log("Connection error");
      res.sendStatus(500);
      return;
    }
    // query part
    let query1 = "SELECT * FROM EMAIL_NOTIF where club_id = ? AND user_id = ?";
    // check if user with club_id and user_id already exists in email_notif
    connection.query(query1, [req.body.club_id, id_of_user], function (qerr, rows, fileds) {

      // release connection after query
      connection.release();

      // handle query error
      if (qerr) {
        // console.log("Query error");
        res.sendStatus(500);
        return;
      }

      // if user with club_id and user_id already exists in table,
      // update the user subscription to news ad events
      if (rows.length > 0) {
        // console.log("User is already recorded");

        /////////////////////////////////////////////////////////////
        req.pool.getConnection(function (cerr2, connection2) {
          // handle connection error
          if (cerr2) {
            // console.log("Connection2 error");
            res.sendStatus(500);
            return;
          }

          let query2 = "UPDATE EMAIL_NOTIF SET news_notif = ?, event_notif = ? WHERE club_id = ? AND user_id = ?";
          connection2.query(query2, [req.body.news_notif, req.body.event_notif, req.body.club_id, id_of_user],
            function (qerr2, rows, fileds) {

              connection2.release();

              if (qerr2) {
                // console.log(qerr2);
                // console.log("Query2 error");
                res.sendStatus(401);
                return;
              }

              // if insert sucess
              res.sendStatus(200);
              return;
            }); // connection.query2
        }); // req.pool.getConnection2

        return;
      } // if found user in table

      //////////////////////////////////////////////////////////////

      // if user with club_id and user_id does NOT EXIST in table,
      // insert the user with user_id, club_id and news_notif, event_notif option
      req.pool.getConnection(function (cerr2_1, connection2_1) {
        // handle connection error
        if (cerr2_1) {
          // console.log("Connection2_1 error");
          res.sendStatus(500);
          return;
        }

        let query2_1 = "INSERT INTO EMAIL_NOTIF(user_id, club_id, news_notif, event_notif) VALUES(?,?,?,?)";
        connection2_1.query(query2_1, [id_of_user, req.body.club_id, req.body.news_notif, req.body.event_notif],
          function (qerr2_1, rows, fileds) {

            connection2_1.release();

            if (qerr2_1) {
              // console.log(qerr2_1);
              // console.log("Query2_1 error");
              res.sendStatus(401);
              return;
            }

            // if insert sucess
            res.sendStatus(200);
            return;

          }); // connection.query2_1
      }); // req.pool.getConnection2_1

    }); // connection.query1
  }); // req.pool.getConnection
});

module.exports = router;
