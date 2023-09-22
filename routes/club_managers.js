var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

// set up nodemailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'coolfroggyclub@gmail.com',
    pass: 'qucfpwkhsjkegvoy'
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.use('/', function(req, res, next){
  // if not logged in or
  // NOT logged in as club manager
  if (!('user' in req.session) || !('manager_id' in req.session.user)){
    //console.log("Not logged in OR not logged in as club manager");
    res.sendStatus(403);
    return;
  }else{
    next();
  }
});

/* Route to get the manager's club ID */
router.get('/getClubID', function(req, res, next) {
  var managerID = req.session.user.user_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT CLUB_MANAGERS.club_id, CLUBS.club_name, CLUBS.email, CLUBS.club_description, CLUBS.phone FROM ((CLUB_MANAGERS INNER JOIN USERS ON CLUB_MANAGERS.manager_id = USERS.user_id) INNER JOIN CLUBS ON CLUB_MANAGERS.club_id = CLUBS. club_id) WHERE CLUB_MANAGERS.manager_id = ?";

    connection.query(query, [managerID], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("Query error");
        res.sendStatus(500);
        return;
      }

      res.json({
        clubID: rows[0].club_id,
        clubName: rows[0].club_name,
        clubEmail: rows[0].email,
        clubDescription: rows[0].club_description,
        clubPhone: rows[0].phone
      });
    });
  });
});

/* Route to view club members */
router.post('/viewMembers', function(req, res, next) {
  let clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT CLUB_MEMBERS.user_id, USERS.first_name, USERS.last_name, USERS.email, USERS.mobile FROM CLUB_MEMBERS INNER JOIN USERS ON CLUB_MEMBERS.user_id = USERS.user_id WHERE CLUB_MEMBERS.club_id = ?";

    connection.query(query, [clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("Query error");
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

// Route to edit club details
router.post('/editClub', function(req, res, next) {
  let clubName = req.body.club_name;
  let clubDescription = req.body.club_description;
  let clubPhone = req.body.club_phone;
  let clubEmail = req.body.club_email;
  let clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "UPDATE CLUBS SET club_name = ?, club_description = ?, phone = ?, email = ? WHERE club_id = ?";

    connection.query(query, [clubName, clubDescription, clubPhone, clubEmail, clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("Query error");
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

// view events that the club manager is managing
router.post('/viewEvents', function(req, res, next) {
  let clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT E.event_id, E.event_name, E.event_message, E.event_date, E.event_location, E.club_id, COUNT(EG.participant_id) AS participant_count FROM EVENTS E LEFT JOIN EVENTGOERS EG ON E.event_id = EG.event_id WHERE E.club_id = ? GROUP BY E.event_id, E.event_name, E.event_message, E.event_date, E.event_location, E.club_id";

    connection.query(query, [clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("Query error");
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Route to view all club news */
router.post('/viewNews', function(req, res, next) {
  let clubID = req.body.club_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT A.post_id, A.title, A.post_message, A.club_id, A.post_date FROM ANNOUNCEMENTS A WHERE club_id = ?";

    connection.query(query, [clubID], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("Query error");
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Router to remove club members */
router.delete('/deleteMembers', function(req, res, next) {
  var memberID = req.body.user_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "DELETE FROM CLUB_MEMBERS WHERE user_id = ?";

    connection.query(query, [memberID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to post updates to members */
router.post('/newAnnouncement', function(req, res, next) {
  var postTitle = req.body.title;
  var postMessage = req.body.post_message;
  var privateMessage = req.body.private_message;
  var clubID = req.body.club_id;

  // To check if announcement title already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM ANNOUNCEMENTS WHERE title = ?";

    connection.query(query, [postTitle], function(error, rows, fields) {
      //console.log("Announcements was checked");
      connection.release();

      if (error) {
        //console.log("error");
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        //console.log("Announcement title already exists");
        res.sendStatus(403);
        return;
      }

      // If passes above, add to announcements table
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          res.sendStatus(500);
          return;
        }

        let query2 = "INSERT INTO ANNOUNCEMENTS (title, post_message, private_message, club_id) VALUES (?, ?, ?, ?)";

        connection.query(query2, [postTitle, postMessage, privateMessage, clubID], function(error, rows, fields) {
          connection.release();

          if (error) {
            //console.log("insert error");
            res.sendStatus(500);
            return;
          }

          req.app.locals.tempData = {title: postTitle, post_message: postMessage, club_id: clubID};

          res.redirect(307,'/club_managers/newsEmail');

          //res.sendStatus(200);
      });
      });
    });
  });
});

/* Route to send out announcements email notifications */
router.post('/newsEmail', function(req, res, next) {
  let data = req.app.locals.tempData;
  req.app.locals.tempData = '';

  // Check if announcement exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM ANNOUNCEMENTS WHERE title = ?";

    connection.query(query, [data.title], function(error, rows, fields) {
      //console.log("Announcements was checked");
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      if (rows.length < 1) {
        //console.log("Announcement doesn't exist");
        res.sendStatus(403);
        return;
      }

      // If passes above, send email
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          res.sendStatus(500);
          return;
        }

        let query2 = "SELECT USERS.email, EMAIL_NOTIF.club_id, CLUBS.club_name FROM ((EMAIL_NOTIF INNER JOIN USERS ON USERS.user_id = EMAIL_NOTIF.user_id) INNER JOIN CLUBS ON EMAIL_NOTIF.club_id = CLUBS.club_id) WHERE EMAIL_NOTIF.club_id = ? AND EMAIL_NOTIF.news_notif = 1";

        connection.query(query2, [data.club_id], function(error, rows, fields) {
          connection.release();

          if (error) {
            res.sendStatus(500);
            return;
          }

          var emails = '';

          // Iterate over the rows and concatenate email values
          for (let i = 0; i < rows.length; i++) {
            emails += rows[i].email + ', ';
          }

          // Remove the trailing comma and whitespace
          emails = emails.trim().slice(0, -1);

          //console.log(emails);

          const mailOptions = {
            from: 'coolfroggyclub@gmail.com',
            to: emails,
            subject: 'Announcement from ' + rows[0].club_name + ' : ' + data.title,
            text: data.post_message + '\n' + '\n' + 'Warm regards, ' + '\n' + rows[0].club_name
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              //console.log(error);
              //console.log('Error sending email');
              res.sendStatus(500);
            } else {
              //console.log('mail send', info);
              //console.log('Email sent successfully');
            }
          });

          //console.log("Email successfully sent");
          res.sendStatus(200);
      });
      });
    });
  });
});

/* Router to create new club events */
router.post('/addEvent', function(req, res, next) {
  var eventName = req.body.event_name;
  var eventMessage = req.body.event_message;
  var eventDate = req.body.event_date;
  var eventLocation = req.body.event_location;
  var clubID = req.body.club_id;
  var privateEvent = req.body.private_event;

  // To check if event name already exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM EVENTS WHERE event_name = ? AND (event_location = ? OR event_date = ?)";

    connection.query(query, [eventName, eventLocation, eventDate], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("First query error");
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        //console.log("Event name already exists, or event location already booked at this time");
        res.sendStatus(403);
        return;
      }

      // If passes all above, insert into events table
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          //console.log("Second query error");
          res.sendStatus(500);
          return;
        }

        let query2 = "INSERT INTO EVENTS (event_name, event_message, event_date, event_location, club_id, private_event) VALUES (?, ?, ?, ?, ?, ?)";

        connection.query(query2, [eventName, eventMessage, eventDate, eventLocation, clubID, privateEvent], function(error, rows, fields) {
          connection.release();

          if (error) {
            res.sendStatus(500);
            return;
          }

          req.app.locals.tempData = {event_name: eventName, event_message: eventMessage, event_date: eventDate, event_location: eventLocation, club_id: clubID};

          res.redirect(307,'/club_managers/eventsEmail');

          //res.sendStatus(200);
        });
      });
    });
  });
});

/* Route to send out events email notifications */
router.post('/eventsEmail', function(req, res, next) {
  let data = req.app.locals.tempData;
  req.app.locals.tempData = '';

  // To check if event exists
  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM EVENTS WHERE event_name = ?";

    connection.query(query, [data.event_name], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("First query error");
        res.sendStatus(500);
        return;
      }

      if (rows.length < 1) {
        //console.log("Event doesn't exist");
        res.sendStatus(403);
        return;
      }

      // If passes above, send email
      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          res.sendStatus(500);
          return;
        }

        let query2 = "SELECT USERS.email, EMAIL_NOTIF.club_id, CLUBS.club_name FROM ((EMAIL_NOTIF INNER JOIN USERS ON USERS.user_id = EMAIL_NOTIF.user_id) INNER JOIN CLUBS ON EMAIL_NOTIF.club_id = CLUBS.club_id) WHERE EMAIL_NOTIF.club_id = ? AND EMAIL_NOTIF.event_notif = 1";

        connection.query(query2, [data.club_id], function(error, rows, fields) {
          connection.release();

          if (error) {
            res.sendStatus(500);
            return;
          }

          var emails = '';

          // Iterate over the rows and concatenate email values
          for (let i = 0; i < rows.length; i++) {
            emails += rows[i].email + ', ';
          }

          // Remove the trailing comma and whitespace
          emails = emails.trim().slice(0, -1);

          //console.log(emails);

          const mailOptions = {
            from: 'coolfroggyclub@gmail.com',
            to: emails,
            subject: 'New event from ' + rows[0].club_name + ' : ' + data.event_name,
            text: data.event_message + '\n' + '\n' + 'Date: ' + data.event_date + '\n' + 'Location: ' + data.event_location + '\n' + '\n' + 'Warm regards, ' + '\n' + rows[0].club_name
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              //console.log(error);
              //console.log('Error sending email');
              res.sendStatus(500);
              return;
            } else {
              //console.log('mail send', info);
              //console.log('Email sent successfully');
            }
          });

          //console.log("Email successfully sent");
          res.sendStatus(200);
      });
      });
    });
  });
});

/* Route to view specific event */
router.post('/viewEventDetails', function(req, res, next) {
  var eventID = req.body.event_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT event_name, event_message, event_date, event_location, private_event FROM EVENTS WHERE event_id = ?";

    connection.query(query, [eventID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Router to edit club events */
router.post('/updateEvent', function(req, res, next) {
  var eventName = req.body.event_name;
  var eventMessage = req.body.event_message;
  var eventDate = req.body.event_date;
  var eventLocation = req.body.event_location;
  var eventPrivacy = req.body.privacy;
  var eventID = req.body.event_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "UPDATE EVENTS SET event_name = ?, event_message = ?, event_date = ?, event_location = ?, private_event = ? WHERE event_id = ?";

    connection.query(query, [eventName, eventMessage, eventDate, eventLocation, eventPrivacy, eventID], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("Query error");
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Route to view specific news */
router.post('/viewNewsDetails', function(req, res, next) {
  var postID = req.body.post_id;
  //console.log(postID);

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT title, post_message, private_message FROM ANNOUNCEMENTS WHERE post_id = ?";

    connection.query(query, [postID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

/* Router to edit club news */
router.post('/updateNews', function(req, res, next) {
  var newsTitle = req.body.title;
  var newsMessage = req.body.post_message;
  var newsPrivacy = req.body.private_message;
  var postID = req.body.post_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      //console.log("Connection error");
      res.sendStatus(500);
      return;
    }

    let query = "UPDATE ANNOUNCEMENTS SET title = ?, post_message = ?, private_message = ? WHERE post_id = ?";

    connection.query(query, [newsTitle, newsMessage, newsPrivacy, postID], function(error, rows, fields) {
      connection.release();

      if (error) {
        //console.log("Query error");
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

/* Router to see who has RSVP'd for events */
router.post('/viewEventgoers', function(req, res, next) {
  var eventID = req.body.event_id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT EVENTGOERS.participant_id, USERS.first_name, USERS.last_name FROM EVENTGOERS INNER JOIN USERS ON EVENTGOERS.participant_id = USERS.user_id WHERE EVENTGOERS.event_id = ?";

    connection.query(query, [eventID], function(error, rows, fields) {
      connection.release();

      if (error) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});


module.exports = router;