-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: vacation_management
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `user_id` int NOT NULL,
  `vacation_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`vacation_id`),
  KEY `vacation_id` (`vacation_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`vacation_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (2,1),(2,3),(2,7),(2,9);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System','Admin','admin@admin.com','fac6b0a6a69be7083aeec66be213cdda35f2b142e838976537fe5f021ed9f694595b03735e1c3070905c30f80becec66d714c211dfde3f8ae83d3f99cbf2d810',1),(2,'Regular','User','user@user.com','fac6b0a6a69be7083aeec66be213cdda35f2b142e838976537fe5f021ed9f694595b03735e1c3070905c30f80becec66d714c211dfde3f8ae83d3f99cbf2d810',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `vacation_id` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_name` varchar(255) NOT NULL,
  PRIMARY KEY (`vacation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'Paris, France','Experience the magic of the Eiffel Tower, the Louvre, and charming Parisian cafes along the Seine.','2026-06-15','2026-06-22',1200.00,'paris.jpg'),(2,'Tokyo, Japan','Dive into the bustling streets of Shibuya, visit ancient temples, and enjoy authentic sushi.','2026-09-10','2026-09-24',2500.50,'tokyo.jpg'),(3,'Rome, Italy','Step back in time at the Colosseum, throw a coin in the Trevi Fountain, and eat endless pasta.','2026-07-05','2026-07-12',1150.00,'rome.jpg'),(4,'New York City, USA','The city that never sleeps! Broadway shows, Central Park, and the Statue of Liberty await.','2026-08-20','2026-08-27',1800.00,'newyork.jpg'),(5,'Bali, Indonesia','Relax on beautiful beaches, explore lush rice terraces, and find your zen in Ubud.','2026-11-01','2026-11-15',950.00,'bali.jpg'),(6,'London, UK','Visit Buckingham Palace, ride the London Eye, and catch a West End musical.','2026-05-10','2026-05-17',1300.00,'london.jpg'),(7,'Santorini, Greece','Stunning white buildings, blue domes, and the world\'s most famous sunsets over the Aegean Sea.','2026-06-01','2026-06-10',1600.00,'santorini.jpg'),(8,'Dubai, UAE','Luxury shopping, ultramodern architecture, and a lively nightlife scene.','2026-12-10','2026-12-17',2200.00,'dubai.jpg'),(9,'Barcelona, Spain','Admire Gaudi\'s architecture, stroll down La Rambla, and enjoy delicious tapas.','2026-09-01','2026-09-08',1050.00,'barcelona.jpg'),(10,'Phuket, Thailand','Tropical island paradise featuring stunning beaches, vibrant nightlife, and diving spots.','2026-01-15','2026-01-25',850.00,'phuket.jpg'),(11,'Reykjavik, Iceland','Explore geysers, waterfalls, and maybe catch a glimpse of the Northern Lights.','2026-02-10','2026-02-18',1900.00,'reykjavik.jpg'),(12,'Sydney, Australia','Surf at Bondi Beach, visit the iconic Opera House, and climb the Harbour Bridge.','2026-10-15','2026-10-25',2800.00,'sydney.jpg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-20 10:48:16
