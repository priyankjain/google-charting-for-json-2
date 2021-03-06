-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 30, 2014 at 08:18 AM
-- Server version: 5.5.34
-- PHP Version: 5.4.22


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `charts`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(50) NOT NULL,
  `24hour_profit` decimal(15,10) NOT NULL DEFAULT '0.0000000000',
  `immature_balance` decimal(15,10) NOT NULL DEFAULT '0.0000000000',
  `unexchanged_balance` decimal(15,10) NOT NULL DEFAULT '0.0000000000',
  `readyforpayout_balance` decimal(15,10) NOT NULL DEFAULT '0.0000000000',
  `expected_btc` decimal(15,10) NOT NULL DEFAULT '0.0000000000',
  `datecreated` datetime NOT NULL,
  `last_payout` datetime NOT NULL,
  `total_profits` decimal(15,10) NOT NULL DEFAULT '0.0000000000',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `24hour_profit`, `immature_balance`, `unexchanged_balance`, `readyforpayout_balance`, `expected_btc`, `datecreated`, `last_payout`, `total_profits`) VALUES
('Bems6 single GPU', '45.6767676766', '0.0000000000', '0.0000000000', '0.0000000000', '0.0000000000', '2014-03-03 00:00:00', '2014-03-29 18:00:00', '0.0000000000'),
('DHetRUt4kCHHomQZ8qi7L317gpt6dGuwjN', '35.4547676779', '0.0000000000', '0.0000000000', '0.0000000000', '0.0000000000', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0.0000000000'),
('home PC Bems', '34.4545454545', '0.0000000000', '0.0000000000', '0.0000000000', '0.0000000000', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0.0000000000'),
('hoquet.4 on Bems4', '6.3234006600', '0.0000000000', '0.0000000000', '0.0000000000', '0.0000000000', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0.0000000000');

-- --------------------------------------------------------

--
-- Table structure for table `user_transactions`
--

CREATE TABLE IF NOT EXISTS `user_transactions` (
  `tx_id` varchar(100) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `transaction_amount` decimal(15,10) NOT NULL DEFAULT '0.0000000000',
  `payment_address` varchar(100) NOT NULL,
  `datetime` datetime NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  PRIMARY KEY (`tx_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

--
-- Dumping data for table `user_transactions`
--

INSERT INTO `user_transactions` (`tx_id`, `user_id`, `transaction_amount`, `payment_address`, `datetime`, `transaction_type`) VALUES
('1098de339119558a714e86ba18d1db7a89c1cf20db401aa79a0f96ee63bac7aa', 'Bems6 single GPU', '0.5345454000', 'eergerlsgl4', '2014-03-02 05:36:32', 'payment'),
('2190a6b1e44f0301d51059f3a94cc12f8c388f2c3e87ba6af3caf12e5562ba12', 'Bems6 single GPU', '0.5504940900', 'fdgvlglle3', '2014-03-17 09:33:06', 'payment'),
('34e5ceeecefbbea950e9ed453e33569e5676a5ee591051b3d206de809c6db818\r\n', 'Bems6 single GPU', '0.5841637300', 'flgsl5tyllbglfghl', '2014-03-28 07:10:25', 'payment'),
('97737d169eb4b99a9e74528692c11f56440198ed8fed6885ee9463cd8cb1150d', 'Bems6 single GPU', '0.4202620500', 'ldldlfdlflfdl', '2014-03-26 07:25:34', 'payment'),
('afb5b81536131c3972b4d49e97e1bb8a60e016e4dc13984e7702229c9318fc5d', 'Bems6 single GPU', '0.4619974300', 'fdlfdlfdlfld', '2014-03-22 09:25:43', 'payment'),
('c1795d14b745ab193913c02413a46fdb9780ca397c1c0272867598a5fb1c8d9b', 'Bems6 single GPU', '0.4915465450', 'dsfgdrtgregf', '2014-03-18 10:33:33', 'payment'),
('c332bc74e4c773287160ceda58b70a74676ea498fb54dcf29207f43c80cee8e4', 'Bems6 single GPU', '0.5139829900', 'fkfdkhkghkdf', '2014-03-23 17:35:25', 'payment'),
('cd3a447bc4f31d4b04d9d1953ad17608b36431b542c8d2675b652961e15e6931', 'Bems6 single GPU', '0.4912604500', 'wekkdkdk', '2014-03-21 00:00:00', 'payment'),
('f9fda2157370ea2ffc8f43c257d3e23c9a069a149af3952b1a55dd1519489ccb\r\n', 'Bems6 single GPU', '0.6568053200', 'fdsfdskgdkg', '2014-03-25 10:43:18', 'payment');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
