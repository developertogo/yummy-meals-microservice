# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.18)
# Database: yumi_interview
# Generation Time: 2019-04-01 18:56:09 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table meals
# ------------------------------------------------------------

DROP TABLE IF EXISTS `meals`;

CREATE TABLE `meals` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `meals` WRITE;
/*!40000 ALTER TABLE `meals` DISABLE KEYS */;

INSERT INTO `meals` (`id`, `name`, `description`, `image_url`)
VALUES
	(1,'Apple','Yummy apple','https://email.helloyumi.com/assets/0561.png'),
	(2,'Japanese Sweet Potato','Yummy tummy','https://email.helloyumi.com/assets/0901.png'),
	(3,'What A Peach','Yummy peach','https://email.helloyumi.com/assets/0478.png');

/*!40000 ALTER TABLE `meals` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table order_attributes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `order_attributes`;

CREATE TABLE `order_attributes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `meal_id` int(10) unsigned NOT NULL,
  `order_id` int(10) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_attributes_meal_id_foreign` (`meal_id`),
  KEY `order_attributes_order_id_foreign` (`order_id`),
  CONSTRAINT `order_attributes_meal_id_foreign` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_attributes_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `order_attributes` WRITE;
/*!40000 ALTER TABLE `order_attributes` DISABLE KEYS */;

INSERT INTO `order_attributes` (`id`, `meal_id`, `order_id`, `quantity`)
VALUES
	(1,1,1,2),
	(2,2,1,2),
	(3,3,1,2),
	(4,1,2,2),
	(5,2,2,2),
	(6,3,2,2),
	(7,1,3,2),
	(8,2,3,2),
	(9,3,3,2),
	(10,1,4,2),
	(11,2,4,2),
	(12,3,4,2),
	(13,1,5,2),
	(14,2,5,2),
	(15,3,5,2),
	(16,1,6,2),
	(17,2,6,2),
	(18,3,6,2),
	(19,1,7,2),
	(20,2,7,2),
	(21,3,7,2),
	(22,1,8,2),
	(23,2,8,2),
	(24,3,8,2),
	(25,1,9,2),
	(26,2,9,2),
	(27,3,9,2),
	(28,1,10,2),
	(29,2,10,2),
	(30,3,10,2);

/*!40000 ALTER TABLE `order_attributes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table orders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `delivery_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;

INSERT INTO `orders` (`id`, `user_id`, `delivery_date`)
VALUES
	(1,1,'2018-06-01 00:00:00'),
	(2,2,'2018-06-01 00:00:00'),
	(3,1,'2018-06-08 00:00:00'),
	(4,1,'2018-06-15 00:00:00'),
	(5,2,'2018-06-08 00:00:00'),
	(6,2,'2018-06-15 00:00:00'),
	(7,2,'2018-06-22 00:00:00'),
	(8,2,'2018-06-29 00:00:00'),
	(9,2,'2018-07-06 00:00:00'),
	(10,2,'2018-07-13 00:00:00');

/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `name`, `email`, `phone`)
VALUES
	(1,'Baby One','yummy@helloyumi.com','5555555555'),
	(2,'Baby Two','tummy@helloyumi.com','5555555555');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
