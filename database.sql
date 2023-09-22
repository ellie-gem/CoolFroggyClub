CREATE DATABASE coolfroggyclub;

USE coolfroggyclub;

CREATE TABLE ADMINS (
    admin_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    date_of_birth DATE,
    admin_password VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(20),
    PRIMARY KEY (admin_id, email)
);

CREATE TABLE USERS (
    user_id SMALLINT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    date_of_birth DATE,
    user_password VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    PRIMARY KEY (user_id, email)
);

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE CLUB_MANAGERS (
    manager_id SMALLINT NOT NULL,
    club_id SMALLINT,
    PRIMARY KEY(manager_id, club_id),
    FOREIGN KEY (manager_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE CLUBS (
    club_id SMALLINT NOT NULL AUTO_INCREMENT,
    club_name CHAR(255) NOT NULL,
    club_description VARCHAR(1000),
    manager_id SMALLINT,
    phone VARCHAR(20),
    email VARCHAR(255),
    PRIMARY KEY (club_id, club_name),
    FOREIGN KEY (manager_id) REFERENCES CLUB_MANAGERS(manager_id) ON DELETE SET NULL
);

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE CLUB_MEMBERS (
    club_id SMALLINT NOT NULL,
    user_id SMALLINT NOT NULL,
    PRIMARY KEY (club_id, user_id),
    FOREIGN KEY (club_id) REFERENCES CLUBS(club_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE EVENTS (
    event_id SMALLINT NOT NULL AUTO_INCREMENT,
    event_name CHAR(255) NOT NULL,
    event_message VARCHAR(1000),
    event_date DATE NOT NULL,
    event_location CHAR(255) NOT NULL,
    club_id SMALLINT NOT NULL,
    private_event TINYINT(1) NOT NULL DEFAULT(1),
    PRIMARY KEY (event_id),
    FOREIGN KEY (club_id) REFERENCES CLUBS(club_id) ON DELETE CASCADE
);

CREATE TABLE EVENTGOERS (
    event_id SMALLINT NOT NULL,
    participant_id SMALLINT NOT NULL,
    PRIMARY KEY (event_id, participant_id),
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE ANNOUNCEMENTS (
    post_id SMALLINT NOT NULL AUTO_INCREMENT,
    title CHAR(255) NOT NULL,
    post_message CHAR(255),
    private_message TINYINT(1) NOT NULL,
    club_id SMALLINT NOT NULL,
    post_date DATE DEFAULT(CURDATE()),
    PRIMARY KEY (post_id),
    FOREIGN KEY (club_id) REFERENCES CLUBS(club_id) ON DELETE CASCADE
);

CREATE TABLE PENDING_CLUBS (
    pending_club_id SMALLINT NOT NULL AUTO_INCREMENT,
    approve_status TINYINT(1) NOT NULL DEFAULT(0),
    club_name CHAR(255) NOT NULL,
    club_description VARCHAR(1000),
    club_manager_id SMALLINT,
    club_email VARCHAR(255) NOT NULL,
    manager_first_name CHAR(255) NOT NULL,
    manager_last_name CHAR(255) NOT NULL,
    manager_date_of_birth DATE,
    manager_password VARCHAR(60),
    manager_email VARCHAR(255) NOT NULL,
    manager_phone VARCHAR(20),
    PRIMARY KEY (pending_club_id, club_name),
    FOREIGN KEY (club_manager_id) REFERENCES USERS(user_id) ON DELETE SET NULL
);

CREATE TABLE EMAIL_NOTIF (
    user_id SMALLINT NOT NULL,
    club_id SMALLINT NOT NULL,
    news_notif TINYINT(1) NOT NULL,
    event_notif TINYINT(1) NOT NULL,
    PRIMARY KEY (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES CLUBS(club_id) ON DELETE CASCADE
);

INSERT INTO ADMINS
(first_name, last_name, date_of_birth, admin_password, email, mobile)
VALUES
('admin1', 'shinyi', '2003-01-14', '$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO', 'sygoh2014@gmail.com', '0405851384');

INSERT INTO ADMINS
(first_name, last_name, date_of_birth, admin_password, email, mobile)
VALUES
('janson', 'vu', '2003-04-23', '$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO', 'thosvu2@gmail.com', '9999999999');

INSERT INTO ADMINS
(first_name, last_name, date_of_birth, admin_password, email, mobile)
VALUES
('ellie', 'test1', '1999-03-24', '$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO', 'ellie@mail.com', '0123456789');

INSERT INTO USERS
(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES
('ShinYi', 'G', '2003-01-14', '$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO', 'sygoh2014@gmail.com', '0405851384');

INSERT INTO USERS
(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES
('janson', 'vu', '2003-04-23', '$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO', 'thosvu2@gmail.com', '9999999999');

INSERT INTO USERS
(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES
('ellie', 'test2', '1999-03-24', '$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO', 'ellie2@mail.com', '0123456789');

INSERT INTO USERS
(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES
('test', '4', '2003-04-23', '$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO', 'xxx@gmail.com', '9999999999');

INSERT INTO USERS
(first_name, last_name, date_of_birth, user_password, email, mobile)
VALUES
('test', '5', '2003-04-23', '$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO', 'xxxx@gmail.com', '9999999999');

INSERT INTO CLUB_MANAGERS
(manager_id, club_id)
VALUES
('1', '1');

INSERT INTO CLUB_MANAGERS
(manager_id, club_id)
VALUES
('2', '2');

INSERT INTO CLUB_MANAGERS
(manager_id, club_id)
VALUES
('3', '3');

INSERT INTO CLUBS
(club_name, club_description, manager_id, phone, email)
VALUES
('OCF', 'AAAA', '1', 123456899, 'ocf@gmail.com');

INSERT INTO CLUBS
(club_name, club_description, manager_id, phone, email)
VALUES
('AVA', 'BBBB', '2', 123456899, 'ava@gmail.com');

INSERT INTO CLUBS
(club_name, club_description, manager_id, phone, email)
VALUES
('Jump Rope Club', 'Come along and jump around like fwoggies!!!', '3', 0123456789, 'jumpropeclub@gmail.com');

INSERT INTO CLUBS
(club_name, club_description, manager_id, phone, email)
VALUES
('FAKE CLUB', 'CCCC', '2', 123456899, 'fakeclub@gmail.com');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Fake event', 'Time to fake it', '2023-09-29', 'Lecture Hall', '3', '0');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Karaoke', 'Time to sing!', '2023-05-29', 'Lecture Hall', '1', '0');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Dinner', 'Time to eat!', '2023-06-08', 'MLC', '1', '0');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Rock Paper Scissors tournament', 'Jan ken pon!', '2023-06-22', 'EM bulding', '2', '0');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Rock and RickRoll', 'We will rock you!', '2023-03-12', 'EM bulding', '2', '0');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Rock and RickRoll', 'We will rock you!', '2023-02-09', 'EM bulding', '2', '0');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Skipping Showdown', 'Time to Skip! Hop! Jump! (off a cliff)', '2023-06-15', 'Depths of your Despair', '3', '0');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Panic! At The WDC Project', 'Please give us a HD uwu we worked really hard', '2023-06-09', 'Home Sweet Home', '3', '0');

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Meeting', 'We will rock you!', '2023-02-09', 'EM bulding', '2', 1);

INSERT INTO EVENTS
(event_name, event_message, event_date, event_location, club_id, private_event)
VALUES
('Meow Meow', 'Meow Meow Meow Meow Meow', '2023-12-09', 'Park 10', '2', 1);

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('1', '1');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('1', '2');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('2', '2');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('2', '1');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('3', '1');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('3', '2');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('3', '3');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('1', '3');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('1', '4');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('1', '5');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('3', '5');

INSERT INTO CLUB_MEMBERS
(club_id, user_id)
VALUES
('2', '4');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('1', '1');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('1', '2');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('1', '3');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('1', '4');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('5', '1');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('5', '2');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('5', '3');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('5', '4');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('5', '5');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('6', '2');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('6', '3');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('6', '4');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('6', '5');

INSERT INTO EVENTGOERS
(event_id, participant_id)
VALUES
('2', '2');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id)
VALUES
('Study Session', 'We are having a study session on 16th June, Friday!', '1', '1');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id)
VALUES
('Bible Study', 'We are having a study session on 10th March, Friday!', '1', '1');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id, post_date)
VALUES
('Welcome Night', 'We are having a games night for newcomers on 4th August, Friday!', '0', '1', '2023-03-21');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id, post_date)
VALUES
('Public Game Night', 'We are having a games Fellas!', '0', '2', '2023-02-19');


INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id, post_date)
VALUES
('The Voice talent', 'We are having a singing showdown Fellas!', '0', '2', '2023-08-12');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id, post_date)
VALUES
('Meeting 1', 'We are having meeting 1', '1', '2', '2023-09-12');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id, post_date)
VALUES
('Meeting 2', 'We are having meeting 2', '1', '2', '2023-02-12');

INSERT INTO ANNOUNCEMENTS
(title, post_message, private_message, club_id, post_date)
VALUES
('Skip Rope Challenge', 'We are having a skipping rope challenge, come join us!', '0', '3', '2023-04-20');


INSERT INTO EMAIL_NOTIF
VALUES
('1', '1', '1', '1');

INSERT INTO EMAIL_NOTIF
VALUES
('1', '2', '1', '1');

INSERT INTO EMAIL_NOTIF
VALUES
('2', '2', '1', '1');

INSERT INTO EMAIL_NOTIF
VALUES
('2', '1', 0, 0);

INSERT INTO EMAIL_NOTIF
VALUES
('5', '3', 1, 1);

INSERT INTO
PENDING_CLUBS(club_name, club_description, club_email, club_manager_id, manager_first_name, manager_last_name, manager_email)
VALUES('NEW CLUB 1', 'THIS IS NEW CLUB 1', 'newclub1@gmail.com', 2, 'janson', 'vu', 'thosvu2@gmail.com');

INSERT INTO
PENDING_CLUBS(club_name, club_description, club_email, club_manager_id, manager_first_name, manager_last_name, manager_email)
VALUES('NEW CLUB 2', 'THIS IS NEW CLUB 2', 'newclub2@gmail.com', 1, 'shinyi', 'G', 'sygoh2014@gmail.com');

INSERT INTO
PENDING_CLUBS(club_name, club_description, club_email, club_manager_id, manager_first_name, manager_last_name, manager_email)
VALUES('NEW CLUB 3', 'THIS IS NEW CLUB 3', 'newclub3@gmail.com', 2, 'janson', 'vu', 'thosvu2@gmail.com');