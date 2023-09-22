-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: coolfroggyclub
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `coolfroggyclub`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `coolfroggyclub` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `coolfroggyclub`;

--
-- Table structure for table `ADMINS`
--

DROP TABLE IF EXISTS `ADMINS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADMINS` (
  `admin_id` smallint NOT NULL AUTO_INCREMENT,
  `first_name` char(255) NOT NULL,
  `last_name` char(255) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `admin_password` varchar(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`admin_id`,`email`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADMINS`
--

LOCK TABLES `ADMINS` WRITE;
/*!40000 ALTER TABLE `ADMINS` DISABLE KEYS */;
INSERT INTO `ADMINS` VALUES (1,'admin1','shinyi','2003-01-14','$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO','sygoh2014@gmail.com','0405851384'),(2,'janson','vu','2003-04-23','$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO','thosvu2@gmail.com','9999999999'),(3,'ellie','test1','1999-03-24','$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO','ellie@mail.com','0123456789');
/*!40000 ALTER TABLE `ADMINS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ANNOUNCEMENTS`
--

DROP TABLE IF EXISTS `ANNOUNCEMENTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ANNOUNCEMENTS` (
  `post_id` smallint NOT NULL AUTO_INCREMENT,
  `title` char(255) NOT NULL,
  `post_message` char(255) DEFAULT NULL,
  `private_message` tinyint(1) NOT NULL,
  `club_id` smallint NOT NULL,
  `post_date` date DEFAULT (curdate()),
  PRIMARY KEY (`post_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `ANNOUNCEMENTS_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `CLUBS` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ANNOUNCEMENTS`
--

LOCK TABLES `ANNOUNCEMENTS` WRITE;
/*!40000 ALTER TABLE `ANNOUNCEMENTS` DISABLE KEYS */;
INSERT INTO `ANNOUNCEMENTS` VALUES (1,'Study Session','We are having a study session on 16th June, Friday!',1,1,'2023-06-09'),(2,'Bible Study','We are having a study session on 10th March, Friday!',1,1,'2023-06-09'),(3,'Welcome Night','We are having a games night for newcomers on 4th August, Friday!',0,1,'2023-03-21'),(4,'Public Game Night','We are having a games Fellas!',0,2,'2023-02-19'),(5,'The Voice talent','We are having a singing showdown Fellas!',0,2,'2023-08-12'),(6,'Meeting 1','We are having meeting 1',1,2,'2023-09-12'),(7,'Meeting 2','We are having meeting 2',1,2,'2023-02-12'),(8,'Skip Rope Challenge','We are having a skipping rope challenge, come join us!',0,3,'2023-04-20');
/*!40000 ALTER TABLE `ANNOUNCEMENTS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLUBS`
--

DROP TABLE IF EXISTS `CLUBS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLUBS` (
  `club_id` smallint NOT NULL AUTO_INCREMENT,
  `club_name` char(255) NOT NULL,
  `club_description` varchar(1000) DEFAULT NULL,
  `manager_id` smallint DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`club_id`,`club_name`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `CLUBS_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `CLUB_MANAGERS` (`manager_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLUBS`
--

LOCK TABLES `CLUBS` WRITE;
/*!40000 ALTER TABLE `CLUBS` DISABLE KEYS */;
INSERT INTO `CLUBS` VALUES (1,'OCF','AAAA',1,'123456899','ocf@gmail.com'),(2,'AVA','BBBB',2,'123456899','ava@gmail.com'),(3,'Jump Rope Club','Come along and jump around like fwoggies!!!',3,'123456789','jumpropeclub@gmail.com'),(4,'FAKE CLUB','CCCC',2,'123456899','fakeclub@gmail.com');
/*!40000 ALTER TABLE `CLUBS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLUB_MANAGERS`
--

DROP TABLE IF EXISTS `CLUB_MANAGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLUB_MANAGERS` (
  `manager_id` smallint NOT NULL,
  `club_id` smallint NOT NULL,
  PRIMARY KEY (`manager_id`,`club_id`),
  CONSTRAINT `CLUB_MANAGERS_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `USERS` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLUB_MANAGERS`
--

LOCK TABLES `CLUB_MANAGERS` WRITE;
/*!40000 ALTER TABLE `CLUB_MANAGERS` DISABLE KEYS */;
INSERT INTO `CLUB_MANAGERS` VALUES (1,1),(2,2),(3,3);
/*!40000 ALTER TABLE `CLUB_MANAGERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLUB_MEMBERS`
--

DROP TABLE IF EXISTS `CLUB_MEMBERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLUB_MEMBERS` (
  `club_id` smallint NOT NULL,
  `user_id` smallint NOT NULL,
  PRIMARY KEY (`club_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `CLUB_MEMBERS_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `CLUBS` (`club_id`) ON DELETE CASCADE,
  CONSTRAINT `CLUB_MEMBERS_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLUB_MEMBERS`
--

LOCK TABLES `CLUB_MEMBERS` WRITE;
/*!40000 ALTER TABLE `CLUB_MEMBERS` DISABLE KEYS */;
INSERT INTO `CLUB_MEMBERS` VALUES (1,1),(2,1),(3,1),(1,2),(2,2),(3,2),(1,3),(3,3),(1,4),(2,4),(1,5),(3,5),(1,6),(2,6),(3,6),(4,6),(1,7),(2,7),(3,7),(4,7);
/*!40000 ALTER TABLE `CLUB_MEMBERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EMAIL_NOTIF`
--

DROP TABLE IF EXISTS `EMAIL_NOTIF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EMAIL_NOTIF` (
  `user_id` smallint NOT NULL,
  `club_id` smallint NOT NULL,
  `news_notif` tinyint(1) NOT NULL,
  `event_notif` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`,`club_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `EMAIL_NOTIF_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `EMAIL_NOTIF_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `CLUBS` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EMAIL_NOTIF`
--

LOCK TABLES `EMAIL_NOTIF` WRITE;
/*!40000 ALTER TABLE `EMAIL_NOTIF` DISABLE KEYS */;
INSERT INTO `EMAIL_NOTIF` VALUES (1,1,1,1),(1,2,1,1),(2,1,0,0),(2,2,1,1),(5,3,1,1),(6,1,0,0),(7,1,1,1);
/*!40000 ALTER TABLE `EMAIL_NOTIF` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EVENTGOERS`
--

DROP TABLE IF EXISTS `EVENTGOERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EVENTGOERS` (
  `event_id` smallint NOT NULL,
  `participant_id` smallint NOT NULL,
  PRIMARY KEY (`event_id`,`participant_id`),
  KEY `participant_id` (`participant_id`),
  CONSTRAINT `EVENTGOERS_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `EVENTS` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `EVENTGOERS_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `USERS` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EVENTGOERS`
--

LOCK TABLES `EVENTGOERS` WRITE;
/*!40000 ALTER TABLE `EVENTGOERS` DISABLE KEYS */;
INSERT INTO `EVENTGOERS` VALUES (1,1),(5,1),(1,2),(2,2),(5,2),(6,2),(1,3),(5,3),(6,3),(1,4),(5,4),(6,4),(5,5),(6,5),(1,6),(3,6),(4,6),(7,6),(8,6),(1,7),(2,7),(3,7),(4,7),(7,7),(8,7);
/*!40000 ALTER TABLE `EVENTGOERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EVENTS`
--

DROP TABLE IF EXISTS `EVENTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EVENTS` (
  `event_id` smallint NOT NULL AUTO_INCREMENT,
  `event_name` char(255) NOT NULL,
  `event_message` varchar(1000) DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_location` char(255) NOT NULL,
  `club_id` smallint NOT NULL,
  `private_event` tinyint(1) NOT NULL DEFAULT (1),
  PRIMARY KEY (`event_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `EVENTS_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `CLUBS` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EVENTS`
--

LOCK TABLES `EVENTS` WRITE;
/*!40000 ALTER TABLE `EVENTS` DISABLE KEYS */;
INSERT INTO `EVENTS` VALUES (1,'Fake event','Time to fake it','2023-09-29','Lecture Hall',3,0),(2,'Karaoke','Time to sing!','2023-05-29','Lecture Hall',1,0),(3,'Dinner','Time to eat!','2023-06-08','MLC',1,0),(4,'Rock Paper Scissors tournament','Jan ken pon!','2023-06-22','EM bulding',2,0),(5,'Rock and RickRoll','We will rock you!','2023-03-12','EM bulding',2,0),(6,'Rock and RickRoll','We will rock you!','2023-02-09','EM bulding',2,0),(7,'Skipping Showdown','Time to Skip! Hop! Jump! (off a cliff)','2023-06-15','Depths of your Despair',3,0),(8,'Panic! At The WDC Project','Please give us a HD uwu we worked really hard','2023-06-09','Home Sweet Home',3,0),(9,'Meeting','We will rock you!','2023-02-09','EM bulding',2,1),(10,'Meow Meow','Meow Meow Meow Meow Meow','2023-12-09','Park 10',2,1);
/*!40000 ALTER TABLE `EVENTS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PENDING_CLUBS`
--

DROP TABLE IF EXISTS `PENDING_CLUBS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PENDING_CLUBS` (
  `pending_club_id` smallint NOT NULL AUTO_INCREMENT,
  `approve_status` tinyint(1) NOT NULL DEFAULT (0),
  `club_name` char(255) NOT NULL,
  `club_description` varchar(1000) DEFAULT NULL,
  `club_manager_id` smallint DEFAULT NULL,
  `club_email` varchar(255) NOT NULL,
  `manager_first_name` char(255) NOT NULL,
  `manager_last_name` char(255) NOT NULL,
  `manager_date_of_birth` date DEFAULT NULL,
  `manager_password` varchar(60) DEFAULT NULL,
  `manager_email` varchar(255) NOT NULL,
  `manager_phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`pending_club_id`,`club_name`),
  KEY `club_manager_id` (`club_manager_id`),
  CONSTRAINT `PENDING_CLUBS_ibfk_1` FOREIGN KEY (`club_manager_id`) REFERENCES `USERS` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PENDING_CLUBS`
--

LOCK TABLES `PENDING_CLUBS` WRITE;
/*!40000 ALTER TABLE `PENDING_CLUBS` DISABLE KEYS */;
INSERT INTO `PENDING_CLUBS` VALUES (1,0,'NEW CLUB 1','THIS IS NEW CLUB 1',2,'newclub1@gmail.com','janson','vu',NULL,NULL,'thosvu2@gmail.com',NULL),(2,0,'NEW CLUB 2','THIS IS NEW CLUB 2',1,'newclub2@gmail.com','shinyi','G',NULL,NULL,'sygoh2014@gmail.com',NULL),(3,0,'NEW CLUB 3','THIS IS NEW CLUB 3',2,'newclub3@gmail.com','janson','vu',NULL,NULL,'thosvu2@gmail.com',NULL),(4,0,'Meow Club :3','asdjfhalsdkjfhalskdjfhalksd',6,'nyan@mail.com','ellie5','test',NULL,NULL,'ellie5@mail.com',NULL),(5,0,'Computing Club','askdjfhaslkdjfhalskdjfha',7,'cc@mail.com','ellie9','test',NULL,NULL,'ellie9@mail.com',NULL);
/*!40000 ALTER TABLE `PENDING_CLUBS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USERS`
--

DROP TABLE IF EXISTS `USERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USERS` (
  `user_id` smallint NOT NULL AUTO_INCREMENT,
  `first_name` char(255) NOT NULL,
  `last_name` char(255) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `user_password` varchar(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USERS`
--

LOCK TABLES `USERS` WRITE;
/*!40000 ALTER TABLE `USERS` DISABLE KEYS */;
INSERT INTO `USERS` VALUES (1,'ShinYi','G','2003-01-14','$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO','sygoh2014@gmail.com','0405851384'),(2,'janson','vu','2003-04-23','$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO','thosvu2@gmail.com','9999999999'),(3,'ellie','test2','1999-03-24','$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO','ellie2@mail.com','0123456789'),(4,'test','4','2003-04-23','$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO','xxx@gmail.com','9999999999'),(5,'test','5','2003-04-23','$2b$10$ffk.uLZuSa89qw6ai.6zBe2trzkWTBEGYkhh3M9yADM1HuWKZLSxO','xxxx@gmail.com','9999999999'),(6,'ellie5','test','2000-12-12','$2b$10$DiaTKvxJDW.OyQEp4dAtAuZqlD3a4cQLRmZn9BHXUr5WsG/evG0aO','ellie5@mail.com','0123456789'),(7,'ellie20','test','2002-02-22','$2b$10$gvF4rghP9buDJ9787MWfAeZHZ.qSfgSm96MjvGg8pOgtTpsfuYJPO','ellie9@mail.com','');
/*!40000 ALTER TABLE `USERS` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-09 11:43:31
