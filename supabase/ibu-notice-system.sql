-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2026 at 07:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ibu-notice-system`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `LogID` int(11) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `Activity` varchar(100) NOT NULL,
  `Details` text DEFAULT NULL,
  `ActivityDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`LogID`, `UserID`, `Activity`, `Details`, `ActivityDate`) VALUES
(1, 'ADM-000001', 'registration', 'New administrator registered: John Drex Cantor', '2026-02-07 17:32:53'),
(2, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 17:33:10'),
(3, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 17:35:41'),
(4, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 17:37:31'),
(5, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:31:31'),
(6, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:31:42'),
(7, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:32:15'),
(8, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:32:26'),
(9, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:32:47'),
(10, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:32:52'),
(11, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:34:19'),
(12, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:35:02'),
(13, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:35:07'),
(14, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:35:13'),
(15, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:35:18'),
(16, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:37:29'),
(17, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:38:49'),
(18, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:38:54'),
(19, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:39:44'),
(20, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:39:49'),
(21, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:39:53'),
(22, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:40:01'),
(23, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:40:07'),
(24, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:40:12'),
(25, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:40:17'),
(26, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 18:52:00'),
(27, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 18:52:06'),
(28, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-07 19:06:30'),
(29, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-07 19:06:56'),
(30, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 13:13:08'),
(31, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 13:30:37'),
(32, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-08 13:45:47'),
(33, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 13:47:28'),
(34, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-08 13:47:32'),
(35, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 13:47:37'),
(36, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-08 13:47:44'),
(37, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 13:47:50'),
(38, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-08 13:47:55'),
(39, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 13:48:03'),
(40, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-08 13:49:24'),
(41, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 13:49:29'),
(42, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 22:46:27'),
(43, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 22:46:58'),
(44, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 22:47:20'),
(45, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 22:47:58'),
(46, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 22:48:41'),
(47, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-08 22:49:42'),
(48, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-09 12:09:56'),
(49, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-09 12:29:31'),
(50, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-09 13:47:29'),
(51, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-09 20:18:27'),
(52, 'ADM-000001', 'add_student', 'Added new student: John Drex F. Cantor (2024-01-07787) to department ID: 1', '2026-02-09 20:59:24'),
(53, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-09 21:01:49'),
(54, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-09 21:03:00'),
(55, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-09 21:03:15'),
(56, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-09 21:04:04'),
(57, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-09 21:06:03'),
(58, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-09 21:08:27'),
(59, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-09 21:09:10'),
(60, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-10 20:26:02'),
(61, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-11 13:37:32'),
(62, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 11:37:15'),
(63, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-12 12:14:58'),
(64, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 12:19:09'),
(65, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 16:55:45'),
(66, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 18:11:54'),
(67, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-12 19:34:13'),
(68, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 19:37:36'),
(69, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 19:51:32'),
(70, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 21:46:10'),
(71, 'ADM-000001', 'add_student', 'Added new student: Maryy Fraxine Nicol (2024-01-91406) to department ID: 2', '2026-02-12 22:35:01'),
(72, '2024-01-91406', 'login', 'Student logged in from ::1', '2026-02-12 23:11:47'),
(73, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 23:12:08'),
(74, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 23:21:17'),
(75, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 23:21:54'),
(76, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-12 23:23:11'),
(77, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 23:23:22'),
(78, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-12 23:23:38'),
(79, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 23:25:42'),
(80, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-12 23:31:01'),
(81, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-12 23:31:10'),
(82, 'ADM-000001', 'logout', 'Administrator logged out', '2026-02-12 23:31:37'),
(83, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-13 18:59:29'),
(84, '2024-01-07787', 'login', 'Student logged in from ::1', '2026-02-13 17:03:10'),
(85, '2024-01-07788', 'login', 'Student logged in from ::1', '2026-02-13 16:03:10'),
(86, 'FAC-000001', 'login', 'Faculty logged in from ::1', '2026-02-13 14:03:10'),
(87, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-12 19:03:10'),
(88, '2024-01-07787', 'view_notice', 'Viewed notice: Web Development Project Submission', '2026-02-13 18:03:10'),
(89, '2024-01-07788', 'view_notice', 'Viewed notice: BSCS-3A Class Suspension', '2026-02-13 17:03:10'),
(90, 'FAC-000001', 'create_notice', 'Created new notice: Web Development Project Submission', '2026-02-06 19:03:10'),
(91, 'ADM-000001', 'add_department', 'Added new department: Engineering Department', '2026-02-03 19:03:10'),
(92, 'ADM-000001', 'add_program', 'Added new program: BS Electronics Engineering', '2026-02-04 19:03:10'),
(93, 'ADM-000001', 'add_faculty', 'Added new faculty: Dr. Maria Santos', '2026-02-05 19:03:10'),
(94, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-16 18:10:40'),
(95, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-16 18:32:03'),
(96, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-16 18:32:53'),
(97, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-16 18:50:06'),
(98, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-02-16 19:09:09'),
(99, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-03-09 00:59:08'),
(100, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-03-09 01:15:14'),
(101, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-03-09 01:15:41'),
(102, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-03-10 15:46:34'),
(103, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-03-10 16:00:20'),
(104, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-03-10 16:08:54'),
(105, 'ADM-000001', 'add_faculty', 'Added new faculty: Rafael baltasar (FAC-000010) to department ID: 1', '2026-03-10 16:10:08'),
(106, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 22:39:34'),
(107, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 22:40:13'),
(108, '2024-01-91406', 'login', 'User logged in from IP', '2026-03-10 22:41:13'),
(109, '2024-01-91406', 'logout', 'User logged out', '2026-03-10 22:41:41'),
(110, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 22:41:57'),
(111, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-03-10 22:42:24'),
(112, '2024-01-91406', 'login', 'Student logged in from ::1', '2026-03-10 22:42:53'),
(113, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 22:43:04'),
(114, '2024-01-91406', 'login', 'User logged in from IP', '2026-03-10 22:43:17'),
(115, 'ADM-000001', 'login', 'Administrator logged in from ::1', '2026-03-10 22:45:35'),
(116, 'ADM-000001', 'add_faculty', 'Added new faculty: Dan Francis Etorma (FAC-000011) to department ID: 1', '2026-03-10 22:46:07'),
(117, 'FAC-000011', 'login', 'Faculty logged in from ::1', '2026-03-10 22:46:25'),
(118, '2024-01-91406', 'logout', 'User logged out', '2026-03-10 22:46:37'),
(119, 'FAC-000011', 'login', 'User logged in from IP', '2026-03-10 22:46:56'),
(120, 'FAC-000011', 'logout', 'User logged out', '2026-03-10 22:50:45'),
(121, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 22:50:55'),
(122, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 22:51:56'),
(123, 'FAC-000011', 'login', 'User logged in from IP', '2026-03-10 22:52:04'),
(124, 'FAC-000011', 'logout', 'User logged out', '2026-03-10 22:52:39'),
(125, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 22:52:48'),
(126, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 22:53:00'),
(127, '2024-01-91406', 'login', 'User logged in from IP', '2026-03-10 22:53:31'),
(128, '2024-01-91406', 'logout', 'User logged out', '2026-03-10 22:56:41'),
(129, 'FAC-000011', 'login', 'User logged in from IP', '2026-03-10 22:56:49'),
(130, 'FAC-000011', 'logout', 'User logged out', '2026-03-10 22:58:00'),
(131, '2024-01-91406', 'login', 'User logged in from IP', '2026-03-10 22:58:12'),
(132, '2024-01-91406', 'logout', 'User logged out', '2026-03-10 22:58:26'),
(133, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 22:58:40'),
(134, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 22:58:52'),
(135, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 22:59:00'),
(136, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 23:00:48'),
(137, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 23:01:06'),
(138, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 23:05:44'),
(139, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 23:05:50'),
(140, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 23:06:16'),
(141, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 23:06:21'),
(142, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 23:07:21'),
(143, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 23:07:52'),
(144, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 23:07:55'),
(145, '2024-01-07787', 'logout', 'User logged out', '2026-03-10 23:09:03'),
(146, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-10 23:09:07'),
(147, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:36:45'),
(148, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:41:38'),
(149, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:42:08'),
(150, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:42:15'),
(151, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:43:21'),
(152, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:43:25'),
(153, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:45:32'),
(154, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:45:36'),
(155, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:46:01'),
(156, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:46:09'),
(157, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:46:33'),
(158, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:46:38'),
(159, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:46:45'),
(160, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:46:52'),
(161, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:51:01'),
(162, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:51:05'),
(163, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:53:28'),
(164, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:53:32'),
(165, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 00:58:34'),
(166, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 00:58:39'),
(167, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:01:16'),
(168, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:01:21'),
(169, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:02:45'),
(170, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:05:07'),
(171, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:06:10'),
(172, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:09:47'),
(173, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:10:01'),
(174, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:10:05'),
(175, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:10:58'),
(176, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:11:02'),
(177, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:11:07'),
(178, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:11:11'),
(179, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:11:35'),
(180, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:11:43'),
(181, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:15:47'),
(182, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:15:51'),
(183, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:16:08'),
(184, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:16:12'),
(185, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:16:47'),
(186, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:16:51'),
(187, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:21:23'),
(188, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:21:27'),
(189, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:21:38'),
(190, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:21:45'),
(191, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:22:40'),
(192, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:22:45'),
(193, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:24:41'),
(194, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:24:45'),
(195, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:26:11'),
(196, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:26:15'),
(197, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:26:56'),
(198, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:27:00'),
(199, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:29:23'),
(200, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:29:27'),
(201, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:30:38'),
(202, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:30:42'),
(203, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:30:50'),
(204, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:30:54'),
(205, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:34:29'),
(206, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:34:35'),
(207, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:37:19'),
(208, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:37:23'),
(209, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:37:36'),
(210, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:37:41'),
(211, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:39:16'),
(212, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:39:20'),
(213, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 01:40:14'),
(214, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 01:41:03'),
(215, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:12:45'),
(216, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:12:56'),
(217, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:13:27'),
(218, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:21:02'),
(219, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:22:06'),
(220, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:28:45'),
(221, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:29:09'),
(222, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:29:16'),
(223, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:29:34'),
(224, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:30:27'),
(225, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:30:32'),
(226, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:32:46'),
(227, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:32:50'),
(228, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:33:20'),
(229, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:33:24'),
(230, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:33:41'),
(231, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:34:38'),
(232, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:34:48'),
(233, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:35:58'),
(234, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:53:21'),
(235, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:53:38'),
(236, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 02:53:44'),
(237, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 02:53:50'),
(238, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 03:03:02'),
(239, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 03:03:23'),
(240, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 03:03:31'),
(241, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 03:03:48'),
(242, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 03:03:53'),
(243, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 03:04:32'),
(244, 'FAC-000011', 'login', 'User logged in from IP', '2026-03-11 03:04:47'),
(245, 'FAC-000011', 'logout', 'User logged out', '2026-03-11 03:05:02'),
(246, 'FAC-000011', 'login', 'User logged in from IP', '2026-03-11 03:05:06'),
(247, 'FAC-000011', 'logout', 'User logged out', '2026-03-11 03:05:33'),
(248, 'FAC-000011', 'login', 'User logged in from IP', '2026-03-11 03:05:38'),
(249, 'FAC-000011', 'logout', 'User logged out', '2026-03-11 03:06:01'),
(250, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 11:40:57'),
(251, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 11:41:11'),
(252, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 11:41:18'),
(253, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 11:41:23'),
(254, 'FAC-000011', 'login', 'User logged in from IP', '2026-03-11 11:41:32'),
(255, 'FAC-000011', 'logout', 'User logged out', '2026-03-11 11:42:09'),
(256, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 11:46:56'),
(257, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 11:47:15'),
(258, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 11:47:42'),
(259, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 11:48:06'),
(260, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 11:48:31'),
(261, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 13:37:04'),
(262, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 13:37:23'),
(263, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-11 13:37:33'),
(264, '2024-01-07787', 'logout', 'User logged out', '2026-03-11 13:37:48'),
(265, 'FAC-000011', 'login', 'User logged in from IP', '2026-03-11 13:37:55'),
(266, 'FAC-000011', 'logout', 'User logged out', '2026-03-11 13:38:34'),
(267, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-13 12:13:35'),
(268, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-13 12:38:51'),
(269, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-13 12:50:35'),
(270, '2024-01-07787', 'logout', 'User logged out', '2026-03-13 13:00:56'),
(271, 'ADM-000001', 'login', 'User logged in from IP', '2026-03-13 13:01:11'),
(272, 'ADM-000001', 'logout', 'User logged out', '2026-03-13 13:11:56'),
(273, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-13 13:12:00'),
(274, '2024-01-07787', 'logout', 'User logged out', '2026-03-13 13:12:05'),
(275, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-13 13:12:09'),
(276, '2024-01-07787', 'logout', 'User logged out', '2026-03-13 13:12:19'),
(277, 'ADM-000001', 'login', 'User logged in from IP', '2026-03-13 13:12:24'),
(278, '2024-01-07787', 'login', 'User logged in from IP', '2026-03-13 13:51:51'),
(279, '2024-01-07787', 'logout', 'User logged out', '2026-03-13 13:52:04'),
(280, 'ADM-000001', 'login', 'User logged in from IP', '2026-03-13 13:52:09');

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `BlockID` int(11) NOT NULL,
  `BlockCode` varchar(30) NOT NULL COMMENT 'e.g., BSCS-3A, BSIT-2B, BSIS-1A, BSN-4A',
  `ProgramID` int(11) NOT NULL,
  `YearLevel` int(1) NOT NULL COMMENT '1,2,3,4 (or 5 for some programs)',
  `Section` char(1) NOT NULL COMMENT 'A, B, C, D, etc.',
  `Status` char(1) NOT NULL DEFAULT 'A' COMMENT 'A=Active, I=Inactive',
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blocks`
--

INSERT INTO `blocks` (`BlockID`, `BlockCode`, `ProgramID`, `YearLevel`, `Section`, `Status`, `CreatedAt`) VALUES
(1, 'BSCS-1A', 1, 1, 'A', 'A', '2026-02-13 19:02:44'),
(2, 'BSCS-2B', 1, 2, 'B', 'A', '2026-02-13 19:02:44'),
(3, 'BSCS-3A', 1, 3, 'A', 'A', '2026-02-13 19:02:44'),
(4, 'BSIT-1A', 2, 1, 'A', 'A', '2026-02-13 19:02:44'),
(5, 'BSIT-2A', 2, 2, 'A', 'A', '2026-02-13 19:02:44'),
(6, 'BSN-2A', 5, 2, 'A', 'A', '2026-02-13 19:02:44'),
(7, 'BSED-3A', 3, 3, 'A', 'A', '2026-02-13 19:02:44'),
(8, 'BEEd-2A', 4, 2, 'A', 'A', '2026-02-13 19:02:44');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `DeptID` int(11) NOT NULL,
  `DeptCode` varchar(10) NOT NULL,
  `DeptName` varchar(100) NOT NULL,
  `Status` char(1) NOT NULL DEFAULT 'A' COMMENT 'A=Active, I=Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`DeptID`, `DeptCode`, `DeptName`, `Status`) VALUES
(1, 'CSD', 'Computer Science Department', 'A'),
(2, 'EDUC', 'Education Department', 'A'),
(3, 'NURSING', 'Nursing Department', 'A'),
(4, 'ENTREP', 'Entrepreneur Department', 'A'),
(5, 'TECH', 'Technology Department', 'A'),
(6, 'CENG', 'Engineering Department', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_handles`
--

CREATE TABLE `faculty_handles` (
  `HandleID` int(11) NOT NULL,
  `FacultyID` varchar(20) NOT NULL COMMENT 'References users(UserID) where Role=Faculty',
  `BlockID` int(11) NOT NULL,
  `SubjectID` int(11) NOT NULL,
  `Schedule` varchar(100) DEFAULT NULL COMMENT 'e.g., MWF 9:00-10:30, TTH 1:00-3:00',
  `Room` varchar(50) DEFAULT NULL COMMENT 'e.g., Lab A, Room 203, Online',
  `Semester` varchar(10) NOT NULL COMMENT '1st, 2nd, Summer',
  `SchoolYear` varchar(20) NOT NULL COMMENT 'e.g., 2025-2026',
  `IsActive` char(1) NOT NULL DEFAULT 'Y' COMMENT 'Y=Yes, N=No',
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty_handles`
--

INSERT INTO `faculty_handles` (`HandleID`, `FacultyID`, `BlockID`, `SubjectID`, `Schedule`, `Room`, `Semester`, `SchoolYear`, `IsActive`, `CreatedAt`) VALUES
(1, 'FAC-000001', 3, 1, 'MWF 9:00-10:30', 'Lab A', '1st', '2025-2026', 'Y', '2026-02-13 19:03:10'),
(2, 'FAC-000001', 3, 2, 'TTH 1:00-3:00', 'Room 203', '1st', '2025-2026', 'Y', '2026-02-13 19:03:10'),
(3, 'FAC-000002', 7, 6, 'MWF 11:00-12:30', 'Room 105', '1st', '2025-2026', 'Y', '2026-02-13 19:03:10'),
(4, 'FAC-000004', 1, 4, 'TTH 9:00-10:30', 'Lab B', '1st', '2025-2026', 'Y', '2026-02-13 19:03:10'),
(5, 'FAC-000003', 6, 7, 'MWF 2:00-4:00', 'Nursing Lab', '2nd', '2025-2026', 'Y', '2026-02-13 19:03:10');

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `NoticeID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `Category` enum('Exam','Events','Class','General') NOT NULL,
  `Priority` enum('Urgent','Normal') NOT NULL DEFAULT 'Normal',
  `AuthorID` varchar(20) NOT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedDate` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `ExpiryDate` datetime DEFAULT NULL,
  `IsPinned` char(1) NOT NULL DEFAULT 'N' COMMENT 'Y=Yes, N=No',
  `Status` char(1) NOT NULL DEFAULT 'A' COMMENT 'A=Active, D=Deleted (Soft Delete)',
  `Attachment` varchar(255) DEFAULT NULL COMMENT 'Optional file attachment path (e.g., PDF, DOC, images)',
  `DeptID` int(11) DEFAULT NULL,
  `BlockID` int(11) DEFAULT NULL,
  `SubjectID` int(11) DEFAULT NULL,
  `TargetType` enum('All','Department','Block','Program') NOT NULL DEFAULT 'All' COMMENT 'Who is this notice for?'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notices`
--

INSERT INTO `notices` (`NoticeID`, `Title`, `Content`, `Category`, `Priority`, `AuthorID`, `CreatedDate`, `UpdatedDate`, `ExpiryDate`, `IsPinned`, `Status`, `Attachment`, `DeptID`, `BlockID`, `SubjectID`, `TargetType`) VALUES
(1, 'Schedule of Midterm Exams', 'Midterm examinations will begin on March 15, 2026. Please check your respective departments for the complete schedule.', 'Exam', 'Urgent', 'ADM-000001', '2027-02-08 19:03:10', '2026-03-13 14:00:30', '2026-03-15 19:03:10', 'Y', 'A', NULL, NULL, NULL, NULL, 'All'),
(2, 'University Foundation Day', 'Join us in celebrating the 55th Foundation Day of Bicol University on March 20, 2026 at the University Oval.', 'Events', 'Normal', 'ADM-000001', '2026-02-10 19:03:10', '2026-03-13 14:00:23', '2027-02-28 19:03:10', 'N', 'A', NULL, NULL, NULL, NULL, 'All'),
(3, 'CSD Department Meeting', 'All CSD faculty members are requested to attend the department meeting on March 10, 2026 at 2:00 PM in the CSD Conference Room.', 'General', 'Normal', 'ADM-000001', '2026-02-11 19:03:10', '2026-03-13 14:00:16', '2027-02-20 19:03:10', 'N', 'A', NULL, 1, NULL, NULL, 'Department'),
(4, 'BSCS-3A Class Suspension', 'Classes for BSCS-3A are suspended on March 8, 2026 due to faculty training.', 'Class', 'Urgent', 'FAC-000001', '2026-02-12 19:03:10', '2026-03-13 14:00:00', '2027-02-18 19:03:10', 'Y', 'A', NULL, NULL, 3, NULL, 'Block'),
(5, 'Web Development Project Submission', 'Reminder: Submit your final project for CS301 on March 12, 2026. Late submissions will not be accepted.', 'Class', 'Urgent', 'FAC-000001', '2026-02-13 19:03:10', '2026-03-13 13:59:50', '2027-02-20 19:03:10', 'Y', 'A', NULL, NULL, 3, 1, 'Block'),
(6, 'Nursing Skills Lab Schedule', 'Updated schedule for Nursing Skills Lab for BSN-2A students. Please check the bulletin board.', 'General', 'Normal', 'FAC-000003', '2026-02-09 19:03:10', '2026-03-13 13:59:39', '2027-03-05 19:03:10', 'N', 'A', NULL, NULL, 6, NULL, 'Block'),
(7, 'Scholarship Application', 'The Department of Science and Technology (DOST) scholarship applications are now open until March 30, 2026.', 'Events', 'Normal', 'ADM-000001', '2026-02-07 19:03:10', '2026-03-13 13:59:29', '2027-07-10 19:03:10', 'Y', 'A', NULL, NULL, NULL, NULL, 'All'),
(8, 'CS302 Database Systems Project', 'Reminder: Your database design project is due on March 8, 2026. Submit through the learning management system.', 'Class', 'Normal', 'FAC-000001', '2026-02-11 19:03:10', '2026-03-13 13:59:06', '2027-02-16 19:03:10', 'N', 'A', NULL, NULL, 3, 2, 'Block'),
(9, 'Education Department Field Trip', 'The field trip for BSED and BEEd students has been rescheduled to March 18, 2026.', 'Events', 'Normal', 'FAC-000002', '2026-02-06 19:03:10', '2026-03-13 13:58:57', '2027-02-23 19:03:10', 'N', 'A', NULL, 2, NULL, NULL, 'Department'),
(10, 'System Maintenance', 'The student portal will be under maintenance on March 9, 2026 from 2:00 AM to 5:00 AM.', 'General', 'Normal', 'ADM-000001', '2026-02-12 19:03:10', '2026-03-13 13:58:48', '2027-02-15 19:03:10', 'N', 'A', NULL, NULL, NULL, NULL, 'All');

-- --------------------------------------------------------

--
-- Table structure for table `notice_read`
--

CREATE TABLE `notice_read` (
  `ReadID` int(11) NOT NULL,
  `NoticeID` int(11) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `ReadDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notice_read`
--

INSERT INTO `notice_read` (`ReadID`, `NoticeID`, `UserID`, `ReadDate`) VALUES
(1, 1, '2024-01-07787', '2026-02-09 19:03:10'),
(2, 1, '2024-01-07788', '2026-02-09 19:03:10'),
(3, 2, '2024-01-07787', '2026-02-11 19:03:10'),
(4, 3, '2024-01-07787', '2026-02-12 19:03:10'),
(5, 4, '2024-01-07787', '2026-02-13 19:03:10'),
(6, 4, '2024-01-07788', '2026-02-13 18:03:10'),
(7, 5, '2024-01-07787', '2026-02-13 19:03:10'),
(8, 7, '2024-01-07787', '2026-02-08 19:03:10'),
(9, 8, '2024-01-07787', '2026-02-12 19:03:10');

-- --------------------------------------------------------

--
-- Table structure for table `notice_target_blocks`
--

CREATE TABLE `notice_target_blocks` (
  `TargetID` int(11) NOT NULL,
  `NoticeID` int(11) NOT NULL,
  `BlockID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notice_target_blocks`
--

INSERT INTO `notice_target_blocks` (`TargetID`, `NoticeID`, `BlockID`) VALUES
(1, 4, 3),
(2, 5, 3),
(3, 6, 6),
(4, 8, 3);

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `ProgramID` int(11) NOT NULL,
  `ProgramCode` varchar(20) NOT NULL COMMENT 'e.g., BSCS, BSIT, BSIS, BSED, BSN, ACT',
  `ProgramName` varchar(100) NOT NULL COMMENT 'e.g., Bachelor of Science in Computer Science',
  `DeptID` int(11) NOT NULL COMMENT 'Which department owns this program',
  `Status` char(1) NOT NULL DEFAULT 'A' COMMENT 'A=Active, I=Inactive',
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`ProgramID`, `ProgramCode`, `ProgramName`, `DeptID`, `Status`, `CreatedAt`) VALUES
(1, 'BSCS', 'Bachelor of Science in Computer Science', 1, 'A', '2026-02-13 19:02:33'),
(2, 'BSIT', 'Bachelor of Science in Information Technology', 1, 'A', '2026-02-13 19:02:33'),
(3, 'BSED', 'Bachelor of Secondary Education', 2, 'A', '2026-02-13 19:02:33'),
(4, 'BEEd', 'Bachelor of Elementary Education', 2, 'A', '2026-02-13 19:02:33'),
(5, 'BSN', 'Bachelor of Science in Nursing', 3, 'A', '2026-02-13 19:02:33'),
(6, 'BSENT', 'Bachelor of Science in Entrepreneurship', 4, 'A', '2026-02-13 19:02:33'),
(7, 'BSECE', 'Bachelor of Science in Electronics Engineering', 6, 'A', '2026-02-13 19:02:33'),
(8, 'ACT', 'Associate in Computer Technology', 5, 'A', '2026-02-13 19:02:33');

-- --------------------------------------------------------

--
-- Table structure for table `student_enrollment`
--

CREATE TABLE `student_enrollment` (
  `EnrollmentID` int(11) NOT NULL,
  `StudentID` varchar(20) NOT NULL COMMENT 'References users(UserID) where Role=Student',
  `BlockID` int(11) NOT NULL COMMENT 'Which block they are enrolled in',
  `Semester` varchar(10) NOT NULL COMMENT '1st, 2nd, Summer',
  `SchoolYear` varchar(20) NOT NULL COMMENT 'e.g., 2025-2026',
  `Status` char(1) NOT NULL DEFAULT 'E' COMMENT 'E=Enrolled, D=Dropped, C=Completed',
  `EnrolledAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_enrollment`
--

INSERT INTO `student_enrollment` (`EnrollmentID`, `StudentID`, `BlockID`, `Semester`, `SchoolYear`, `Status`, `EnrolledAt`) VALUES
(1, '2024-01-07787', 3, '1st', '2025-2026', 'E', '2026-02-13 19:03:10'),
(2, '2024-01-07788', 3, '1st', '2025-2026', 'E', '2026-02-13 19:03:10'),
(3, '2024-01-07789', 1, '1st', '2025-2026', 'E', '2026-02-13 19:03:10'),
(4, '2023-02-12345', 7, '1st', '2025-2026', 'E', '2026-02-13 19:03:10'),
(5, '2023-03-54321', 6, '2nd', '2025-2026', 'E', '2026-02-13 19:03:10'),
(6, '2022-01-98765', 3, '1st', '2025-2026', 'E', '2026-02-13 19:03:10');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `SubjectID` int(11) NOT NULL,
  `SubjectCode` varchar(20) NOT NULL COMMENT 'e.g., CS301, IT202, IS101, EDUC101',
  `SubjectName` varchar(100) NOT NULL COMMENT 'e.g., Web Development, Database Systems',
  `Units` int(2) NOT NULL COMMENT '3, 5, etc.',
  `ProgramID` int(11) NOT NULL COMMENT 'Which program offers this subject',
  `YearLevel` int(1) NOT NULL COMMENT 'Usually offered in this year',
  `Semester` varchar(10) NOT NULL COMMENT '1st, 2nd, Summer',
  `Status` char(1) NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`SubjectID`, `SubjectCode`, `SubjectName`, `Units`, `ProgramID`, `YearLevel`, `Semester`, `Status`) VALUES
(1, 'CS301', 'Web Development', 3, 1, 3, '1st', 'A'),
(2, 'CS302', 'Database Systems', 3, 1, 2, '2nd', 'A'),
(3, 'IT201', 'Networking Fundamentals', 3, 2, 2, '1st', 'A'),
(4, 'IT101', 'Introduction to Computing', 3, 2, 1, '1st', 'A'),
(5, 'EDUC201', 'Facilitating Learning', 3, 3, 2, '1st', 'A'),
(6, 'EDUC301', 'Assessment of Learning', 3, 3, 3, '1st', 'A'),
(7, 'NURS202', 'Community Health Nursing', 5, 5, 2, '2nd', 'A'),
(8, 'ENT201', 'Business Planning', 3, 6, 2, '1st', 'A'),
(9, 'ECE301', 'Microprocessors', 4, 7, 3, '1st', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` varchar(20) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Super Admin','Admin','Faculty','Student') NOT NULL,
  `BatchYear` year(4) DEFAULT NULL COMMENT 'For students only. Future use: batch-targeted notices.',
  `LastLogin` datetime DEFAULT NULL,
  `Status` char(1) NOT NULL DEFAULT 'A' COMMENT 'A=Active, I=Inactive',
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `DeptID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FullName`, `Email`, `Password`, `Role`, `BatchYear`, `LastLogin`, `Status`, `CreatedAt`, `DeptID`) VALUES
('2022-01-98765', 'Patricia Gomez', 'patricia.gomez@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere10', 'Student', '2022', NULL, 'A', '2026-02-13 19:03:10', 1),
('2023-02-12345', 'Anna Marie Cruz', 'annamarie.cruz@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere8', 'Student', '2023', NULL, 'A', '2026-02-13 19:03:10', 2),
('2023-03-54321', 'Michael Tan', 'michael.tan@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere9', 'Student', '2023', NULL, 'A', '2026-02-13 19:03:10', 3),
('2024-01-07787', 'John Drex F. Cantor', 'johndrexfirma.cantor@bicol-u.edu.ph', '$2y$10$Ic40WX2ckQgIDaluE7kKTe6EPQ9yNV5I0f396kfXq1rEvKuUq9j.W', 'Student', '2024', '2026-03-13 13:51:51', 'A', '2026-02-09 20:59:24', 1),
('2024-01-07788', 'Maria Ana Santos', 'mariaana.santos@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere6', 'Student', '2024', NULL, 'A', '2026-02-13 19:03:10', 1),
('2024-01-07789', 'Jose Miguel Reyes', 'josemiguel.reyes@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere7', 'Student', '2024', NULL, 'A', '2026-02-13 19:03:10', 1),
('2024-01-91406', 'Maryy Franxine Nicol', 'maryy.nicol@bicol-u.edu.ph', '$2y$10$neg.hs4LTsNqgzNT0gw4Eu/6nwBM6FuZ8a2PRYPT8gm2Hx4GsKMgq', 'Student', '2024', '2026-03-10 22:58:12', 'A', '2026-02-12 22:35:01', 2),
('ADM-000001', 'Administrator', 'Administrator@bicol-u.edu.ph', '$2y$10$eUeu1/K5kWhAqKQM4hpXm.525ykd7wkfvuLIb/CqYIxXDjcYYpFty', 'Admin', NULL, '2026-03-13 13:52:09', 'A', '2026-02-07 17:32:53', NULL),
('FAC-000001', 'Dr. Maria Santos', 'maria.santos@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere1', 'Faculty', NULL, NULL, 'A', '2026-02-13 19:03:10', 1),
('FAC-000002', 'Prof. Juan Dela Cruz', 'juan.delacruz@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere2', 'Faculty', NULL, NULL, 'A', '2026-02-13 19:03:10', 2),
('FAC-000003', 'Dr. Ana Reyes', 'ana.reyes@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere3', 'Faculty', NULL, NULL, 'A', '2026-02-13 19:03:10', 3),
('FAC-000004', 'Prof. Pedro Mercado', 'pedro.mercado@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere4', 'Faculty', NULL, NULL, 'A', '2026-02-13 19:03:10', 1),
('FAC-000005', 'Asst. Prof. Sofia Lopez', 'sofia.lopez@bicol-u.edu.ph', '$2y$10$YourHashedPasswordHere5', 'Faculty', NULL, NULL, 'A', '2026-02-13 19:03:10', 4),
('FAC-000010', 'Rafael baltasar', 'rafael.baltasar@bicol-u.edu.ph', '$2y$10$tkKbREDNxzYqKH7fgV8kPeJNA7m8Q9/gDXRZ3hEWaa9REmiERswry', 'Faculty', NULL, NULL, 'A', '2026-03-10 16:10:08', 1),
('FAC-000011', 'Dan Francis Etorma', 'dan.etorma@bicol-u.edu.ph', '$2y$10$dF0IOxkOYNmVPCLFEznKV.7hoGu93Wsxan4DU4gJfnOMU3srrFUXO', 'Faculty', NULL, '2026-03-11 13:37:55', 'A', '2026-03-10 22:46:07', 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `fk_activity_user` (`UserID`);

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`BlockID`),
  ADD UNIQUE KEY `unique_block` (`ProgramID`,`YearLevel`,`Section`),
  ADD KEY `fk_block_program` (`ProgramID`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`DeptID`),
  ADD UNIQUE KEY `DeptCode` (`DeptCode`);

--
-- Indexes for table `faculty_handles`
--
ALTER TABLE `faculty_handles`
  ADD PRIMARY KEY (`HandleID`),
  ADD UNIQUE KEY `unique_handling` (`FacultyID`,`BlockID`,`SubjectID`,`Semester`,`SchoolYear`),
  ADD KEY `fk_handles_faculty` (`FacultyID`),
  ADD KEY `fk_handles_block` (`BlockID`),
  ADD KEY `fk_handles_subject` (`SubjectID`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`NoticeID`),
  ADD KEY `fk_notice_author` (`AuthorID`),
  ADD KEY `idx_category` (`Category`),
  ADD KEY `idx_priority` (`Priority`),
  ADD KEY `idx_created` (`CreatedDate`),
  ADD KEY `idx_notice_department` (`DeptID`),
  ADD KEY `fk_notice_block` (`BlockID`),
  ADD KEY `fk_notice_subject` (`SubjectID`);

--
-- Indexes for table `notice_read`
--
ALTER TABLE `notice_read`
  ADD PRIMARY KEY (`ReadID`),
  ADD UNIQUE KEY `uq_notice_user` (`NoticeID`,`UserID`),
  ADD KEY `fk_read_user` (`UserID`);

--
-- Indexes for table `notice_target_blocks`
--
ALTER TABLE `notice_target_blocks`
  ADD PRIMARY KEY (`TargetID`),
  ADD UNIQUE KEY `unique_notice_block` (`NoticeID`,`BlockID`),
  ADD KEY `fk_target_notice` (`NoticeID`),
  ADD KEY `fk_target_block` (`BlockID`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`ProgramID`),
  ADD UNIQUE KEY `ProgramCode` (`ProgramCode`),
  ADD KEY `fk_program_department` (`DeptID`);

--
-- Indexes for table `student_enrollment`
--
ALTER TABLE `student_enrollment`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD UNIQUE KEY `unique_enrollment` (`StudentID`,`BlockID`,`Semester`,`SchoolYear`),
  ADD KEY `fk_enrollment_student` (`StudentID`),
  ADD KEY `fk_enrollment_block` (`BlockID`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`SubjectID`),
  ADD UNIQUE KEY `SubjectCode` (`SubjectCode`),
  ADD KEY `fk_subject_program` (`ProgramID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `idx_role` (`Role`),
  ADD KEY `fk_user_department` (`DeptID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=281;

--
-- AUTO_INCREMENT for table `blocks`
--
ALTER TABLE `blocks`
  MODIFY `BlockID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `DeptID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `faculty_handles`
--
ALTER TABLE `faculty_handles`
  MODIFY `HandleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `NoticeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `notice_read`
--
ALTER TABLE `notice_read`
  MODIFY `ReadID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notice_target_blocks`
--
ALTER TABLE `notice_target_blocks`
  MODIFY `TargetID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `ProgramID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `student_enrollment`
--
ALTER TABLE `student_enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blocks`
--
ALTER TABLE `blocks`
  ADD CONSTRAINT `fk_block_program` FOREIGN KEY (`ProgramID`) REFERENCES `programs` (`ProgramID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `faculty_handles`
--
ALTER TABLE `faculty_handles`
  ADD CONSTRAINT `fk_handles_block` FOREIGN KEY (`BlockID`) REFERENCES `blocks` (`BlockID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_handles_faculty` FOREIGN KEY (`FacultyID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_handles_subject` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notices`
--
ALTER TABLE `notices`
  ADD CONSTRAINT `fk_notice_author` FOREIGN KEY (`AuthorID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notice_block` FOREIGN KEY (`BlockID`) REFERENCES `blocks` (`BlockID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notice_department` FOREIGN KEY (`DeptID`) REFERENCES `departments` (`DeptID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_notice_subject` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notice_read`
--
ALTER TABLE `notice_read`
  ADD CONSTRAINT `fk_read_notice` FOREIGN KEY (`NoticeID`) REFERENCES `notices` (`NoticeID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_read_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notice_target_blocks`
--
ALTER TABLE `notice_target_blocks`
  ADD CONSTRAINT `fk_target_block` FOREIGN KEY (`BlockID`) REFERENCES `blocks` (`BlockID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_target_notice` FOREIGN KEY (`NoticeID`) REFERENCES `notices` (`NoticeID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `programs`
--
ALTER TABLE `programs`
  ADD CONSTRAINT `fk_program_department` FOREIGN KEY (`DeptID`) REFERENCES `departments` (`DeptID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_enrollment`
--
ALTER TABLE `student_enrollment`
  ADD CONSTRAINT `fk_enrollment_block` FOREIGN KEY (`BlockID`) REFERENCES `blocks` (`BlockID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_enrollment_student` FOREIGN KEY (`StudentID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `fk_subject_program` FOREIGN KEY (`ProgramID`) REFERENCES `programs` (`ProgramID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_department` FOREIGN KEY (`DeptID`) REFERENCES `departments` (`DeptID`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
