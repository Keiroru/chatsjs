-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2025 at 11:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `attachment`
--

CREATE TABLE `attachment` (
  `attachmentId` int(11) NOT NULL,
  `fileType` varchar(10) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `fileSize` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blocked`
--

CREATE TABLE `blocked` (
  `blockedId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `blockedUserId` int(11) NOT NULL,
  `blockedAt` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bugreports`
--

CREATE TABLE `bugreports` (
  `bugReportId` int(11) NOT NULL,
  `senderUserId` int(11) NOT NULL,
  `header` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL,
  `attachmentId` int(11) DEFAULT NULL,
  `sentAt` date NOT NULL DEFAULT curdate(),
  `isClosed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `conversationId` int(11) NOT NULL,
  `conversationName` varchar(255) NOT NULL,
  `createdAt` date NOT NULL DEFAULT curdate(),
  `isGroupChat` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`conversationId`, `conversationName`, `createdAt`, `isGroupChat`) VALUES
(1, 'tester and cica', '2025-03-29', 0),
(2, 'tester2 and cica', '2025-03-29', 0),
(3, 'Trixep11 and Alex', '2025-03-31', 0),
(4, 'fe', '2025-04-01', 1),
(5, 'Trixep11 and John', '2025-04-01', 0),
(6, 'Trixep11 and Alice', '2025-04-01', 0),
(7, 'Trixep11 and Ava', '2025-04-01', 0),
(8, 'Trixep11 and Char', '2025-04-01', 0),
(9, 'Trixep11 and Dean', '2025-04-01', 0),
(10, 'Trixep11 and Emily', '2025-04-01', 0),
(11, 'MMMMMMMMMMMMMMMMMMMM', '2025-04-01', 1),
(12, 'Trixep11 and cica', '2025-04-02', 0),
(13, 'Trixep11 and Eve', '2025-04-02', 0),
(14, 'Trixep11 and Grace', '2025-04-02', 0),
(15, 'Trixep11 and Isa', '2025-04-03', 0),
(16, 'z5e4', '2025-04-03', 1),
(17, 'valami and cica', '2025-04-03', 0),
(18, 'Trixep11 and valami', '2025-04-03', 0),
(19, 'Trixep11 and Max', '2025-04-03', 0);

-- --------------------------------------------------------

--
-- Table structure for table `conversationusers`
--

CREATE TABLE `conversationusers` (
  `conversationUserId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `joinedAt` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversationusers`
--

INSERT INTO `conversationusers` (`conversationUserId`, `userId`, `conversationId`, `isAdmin`, `joinedAt`) VALUES
(1, 43, 1, 0, '2025-03-29'),
(2, 42, 1, 0, '2025-03-29'),
(3, 44, 2, 0, '2025-03-29'),
(4, 42, 2, 0, '2025-03-29'),
(5, 1, 3, 0, '2025-03-31'),
(6, 22, 3, 0, '2025-03-31'),
(7, 22, 4, 1, '2025-04-01'),
(8, 1, 4, 0, '2025-04-01'),
(9, 1, 5, 0, '2025-04-01'),
(10, 2, 5, 0, '2025-04-01'),
(11, 1, 6, 0, '2025-04-01'),
(12, 7, 6, 0, '2025-04-01'),
(13, 1, 7, 0, '2025-04-01'),
(14, 19, 7, 0, '2025-04-01'),
(15, 1, 8, 0, '2025-04-01'),
(16, 17, 8, 0, '2025-04-01'),
(17, 1, 9, 0, '2025-04-01'),
(18, 38, 9, 0, '2025-04-01'),
(19, 1, 10, 0, '2025-04-01'),
(20, 5, 10, 0, '2025-04-01'),
(21, 1, 11, 1, '2025-04-01'),
(22, 22, 11, 0, '2025-04-01'),
(23, 1, 12, 0, '2025-04-02'),
(24, 42, 12, 0, '2025-04-02'),
(25, 1, 13, 0, '2025-04-02'),
(26, 27, 13, 0, '2025-04-02'),
(27, 1, 14, 0, '2025-04-02'),
(28, 15, 14, 0, '2025-04-02'),
(29, 1, 15, 0, '2025-04-03'),
(30, 21, 15, 0, '2025-04-03'),
(31, 45, 16, 1, '2025-04-03'),
(32, 45, 17, 0, '2025-04-03'),
(33, 42, 17, 0, '2025-04-03'),
(34, 1, 18, 0, '2025-04-03'),
(35, 45, 18, 0, '2025-04-03'),
(36, 1, 19, 0, '2025-04-03'),
(37, 40, 19, 0, '2025-04-03');

-- --------------------------------------------------------

--
-- Table structure for table `friendrequest`
--

CREATE TABLE `friendrequest` (
  `requestId` int(11) NOT NULL,
  `senderUserId` int(11) NOT NULL,
  `receiverUserId` int(11) NOT NULL,
  `sentAt` date NOT NULL DEFAULT curdate(),
  `isTimedOut` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friendrequest`
--

INSERT INTO `friendrequest` (`requestId`, `senderUserId`, `receiverUserId`, `sentAt`, `isTimedOut`, `status`) VALUES
(1, 43, 42, '2025-03-29', 0, 'accepted'),
(2, 44, 42, '2025-03-29', 0, 'accepted'),
(3, 22, 1, '2025-03-31', 0, 'accepted'),
(4, 17, 1, '2025-04-02', 0, 'accepted'),
(5, 45, 42, '2025-04-03', 0, 'pending'),
(8, 45, 1, '2025-04-03', 0, 'accepted'),
(10, 1, 5, '2025-04-03', 0, 'pending'),
(11, 19, 1, '2025-04-03', 0, 'pending'),
(12, 46, 1, '2025-04-03', 0, 'pending'),
(14, 1, 21, '2025-04-03', 0, 'pending'),
(15, 47, 1, '2025-04-03', 0, 'pending'),
(18, 1, 22, '2025-04-03', 0, 'pending'),
(24, 1, 45, '2025-04-03', 0, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `friendsId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `friendUserId` int(11) NOT NULL,
  `friendedAt` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`friendsId`, `userId`, `friendUserId`, `friendedAt`) VALUES
(1, 42, 43, '2025-03-29'),
(2, 43, 42, '2025-03-29'),
(3, 42, 44, '2025-03-29'),
(4, 44, 42, '2025-03-29'),
(5, 1, 22, '2025-03-31'),
(6, 22, 1, '2025-03-31'),
(7, 1, 17, '2025-04-02'),
(8, 17, 1, '2025-04-02'),
(9, 1, 45, '2025-04-03'),
(10, 45, 1, '2025-04-03'),
(11, 1, 45, '2025-04-03'),
(12, 45, 1, '2025-04-03');

-- --------------------------------------------------------

--
-- Table structure for table `logins`
--

CREATE TABLE `logins` (
  `loginId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `loginDate` date NOT NULL DEFAULT curdate(),
  `logoutDate` date DEFAULT NULL,
  `isLoggedIn` tinyint(1) DEFAULT 1,
  `location` varchar(100) NOT NULL,
  `ipAddress` varchar(39) NOT NULL,
  `deviceType` varchar(20) NOT NULL,
  `userAgent` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `messageId` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `senderUserId` int(11) NOT NULL,
  `sentAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `state` enum('sent','delivered','seen') NOT NULL DEFAULT 'sent',
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `isEdited` tinyint(1) NOT NULL DEFAULT 0,
  `messageText` text DEFAULT NULL,
  `attachmentId` int(11) DEFAULT NULL,
  `replyTo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`messageId`, `conversationId`, `senderUserId`, `sentAt`, `state`, `isDeleted`, `isEdited`, `messageText`, `attachmentId`, `replyTo`) VALUES
(1, 1, 43, '2025-03-29 16:16:29', 'sent', 0, 0, 'szia', NULL, NULL),
(2, 1, 43, '2025-03-29 16:27:25', 'sent', 0, 0, 'szeretlek', NULL, NULL),
(3, 1, 42, '2025-03-29 17:02:40', 'sent', 0, 0, 'ja en se', NULL, NULL),
(4, 1, 43, '2025-03-29 17:22:44', 'sent', 0, 0, 'asd', NULL, NULL),
(5, 1, 43, '2025-03-29 17:24:53', 'sent', 0, 0, 'asd', NULL, NULL),
(6, 1, 43, '2025-03-29 17:36:54', 'sent', 0, 0, 'wp gg', NULL, NULL),
(7, 1, 43, '2025-03-29 17:38:47', 'sent', 0, 0, 'lula', NULL, NULL),
(8, 1, 43, '2025-03-29 17:39:27', 'sent', 0, 0, 'asd', NULL, NULL),
(9, 1, 42, '2025-03-29 20:34:48', 'sent', 0, 0, 'asdasdasdasdas', NULL, NULL),
(10, 1, 42, '2025-03-29 20:35:00', 'sent', 0, 0, 'de ha mmost jo akkor mi bajod de ha mmost jo akkor mi bajod', NULL, NULL),
(11, 1, 42, '2025-03-29 20:43:29', 'sent', 0, 0, 'asd', NULL, NULL),
(12, 1, 42, '2025-03-29 20:45:07', 'sent', 0, 0, 'asd', NULL, NULL),
(13, 1, 42, '2025-03-29 20:46:28', 'sent', 0, 0, 'dsa', NULL, NULL),
(14, 1, 42, '2025-03-29 20:46:38', 'sent', 0, 0, 'dik', NULL, NULL),
(15, 1, 42, '2025-03-29 20:47:30', 'sent', 0, 0, 'asd', NULL, NULL),
(16, 1, 42, '2025-03-29 20:48:42', 'sent', 0, 0, 'asd', NULL, NULL),
(17, 1, 42, '2025-03-29 20:48:46', 'sent', 0, 0, 'dsa', NULL, NULL),
(18, 1, 42, '2025-03-29 20:57:05', 'sent', 0, 0, 'asd', NULL, NULL),
(19, 1, 42, '2025-03-29 21:00:51', 'sent', 0, 0, 'what', NULL, NULL),
(20, 1, 42, '2025-03-29 21:01:04', 'sent', 0, 0, 'elmegy?', NULL, NULL),
(21, 1, 42, '2025-03-29 21:01:34', 'sent', 0, 0, 'mostmar en is kinda', NULL, NULL),
(22, 1, 42, '2025-03-29 21:08:07', 'sent', 0, 0, 'pedig so close volt', NULL, NULL),
(23, 1, 42, '2025-03-29 21:10:41', 'sent', 0, 0, 'well gg', NULL, NULL),
(24, 1, 42, '2025-03-29 21:11:34', 'sent', 0, 0, 'ceri', NULL, NULL),
(25, 1, 43, '2025-03-29 21:17:55', 'sent', 0, 0, 'cig', NULL, NULL),
(26, 1, 42, '2025-03-29 21:20:22', 'sent', 0, 0, 'test', NULL, 8),
(27, 1, 42, '2025-03-29 21:25:30', 'sent', 0, 0, 'szar', NULL, 6),
(28, 1, 42, '2025-03-29 21:25:55', 'sent', 0, 0, 'asd', NULL, 8),
(29, 1, 42, '2025-03-29 21:26:10', 'sent', 0, 0, 'dsa', NULL, 8),
(30, 1, 42, '2025-03-29 21:26:28', 'sent', 0, 0, 'dsa', NULL, 17),
(31, 1, 42, '2025-03-29 21:27:13', 'sent', 0, 0, 'dsa', NULL, 25),
(32, 1, 42, '2025-03-29 21:27:16', 'sent', 0, 0, 'asd', NULL, 2147483647),
(33, 1, 42, '2025-03-29 21:27:27', 'sent', 0, 0, 'szia', NULL, 1),
(34, 1, 42, '2025-03-29 21:34:59', 'sent', 0, 0, 'no', NULL, 25),
(35, 1, 42, '2025-03-29 21:36:32', 'sent', 0, 0, 'asd', NULL, NULL),
(36, 1, 42, '2025-03-29 21:36:34', 'sent', 0, 0, 'dsa', NULL, 25),
(37, 1, 42, '2025-03-29 21:38:41', 'sent', 0, 0, 'dsa', NULL, 25),
(38, 1, 42, '2025-03-29 21:39:56', 'sent', 0, 0, 'gggg', NULL, 6),
(39, 1, 43, '2025-03-29 21:40:07', 'sent', 0, 0, 'GEGE', NULL, NULL),
(40, 1, 43, '2025-03-29 21:40:15', 'sent', 0, 0, 'well said', NULL, 23),
(41, 1, 43, '2025-03-29 21:40:24', 'sent', 0, 0, 'well said', NULL, 23),
(42, 1, 42, '2025-03-29 21:45:35', 'sent', 0, 0, 'vaok', NULL, 25),
(43, 1, 42, '2025-03-29 21:47:58', 'sent', 0, 0, 'meow', NULL, 2),
(44, 1, 42, '2025-03-29 21:51:33', 'sent', 0, 0, 'huh', NULL, 39),
(45, 1, 42, '2025-03-29 21:52:10', 'sent', 0, 0, 'no?', NULL, 39),
(46, 1, 42, '2025-03-29 21:53:48', 'sent', 0, 0, 'vagy megis?', NULL, NULL),
(47, 1, 42, '2025-03-29 21:56:00', 'sent', 0, 0, 'bruh?', NULL, 39),
(48, 3, 1, '2025-03-31 18:25:44', 'sent', 1, 0, 'hzgregred', NULL, NULL),
(49, 3, 22, '2025-03-31 18:26:05', 'sent', 1, 0, 'ddd', NULL, NULL),
(50, 3, 1, '2025-03-31 18:26:14', 'sent', 0, 0, 'gregr', NULL, NULL),
(51, 3, 22, '2025-03-31 18:26:17', 'sent', 1, 0, 'fgewgew', NULL, NULL),
(52, 3, 1, '2025-03-31 18:26:22', 'sent', 1, 0, 'trtr', NULL, 2147483647),
(53, 3, 22, '2025-03-31 23:39:48', 'sent', 1, 0, 'hgt', NULL, NULL),
(54, 4, 22, '2025-03-31 23:40:29', 'sent', 0, 0, 'vfd', NULL, NULL),
(55, 4, 22, '2025-03-31 23:40:40', 'sent', 0, 0, 'hj', NULL, 2147483647),
(56, 4, 1, '2025-03-31 23:41:00', 'sent', 0, 0, 'joijjoi', NULL, NULL),
(57, 4, 1, '2025-03-31 23:41:08', 'sent', 0, 0, 'jkl', NULL, 55),
(58, 3, 1, '2025-03-31 23:47:16', 'sent', 0, 0, 'tr', NULL, 49),
(59, 6, 1, '2025-03-31 23:48:21', 'sent', 0, 0, 'z5', NULL, NULL),
(60, 3, 1, '2025-03-31 23:52:45', 'sent', 0, 0, '98', NULL, 53),
(61, 7, 1, '2025-04-01 00:02:03', 'sent', 0, 0, 'ngn', NULL, NULL),
(62, 3, 22, '2025-04-01 00:04:07', 'sent', 1, 0, 'gtr', NULL, 48),
(63, 3, 1, '2025-04-01 00:04:27', 'sent', 0, 0, 'k', NULL, NULL),
(64, 3, 1, '2025-04-01 19:01:15', 'sent', 0, 0, 'uz', NULL, NULL),
(65, 6, 1, '2025-04-01 19:01:19', 'sent', 0, 0, 'űőp', NULL, NULL),
(66, 10, 1, '2025-04-01 19:01:22', 'sent', 0, 0, 'ápo', NULL, NULL),
(67, 8, 1, '2025-04-01 19:08:05', 'sent', 0, 0, 'loiuz', NULL, NULL),
(68, 4, 1, '2025-04-02 17:19:15', 'sent', 0, 0, 'hterdjkhejihjeoioijehoijehoijehr', NULL, NULL),
(69, 3, 1, '2025-04-02 17:19:21', 'sent', 0, 0, 'jthrjttjtrrrjtjtjtj', NULL, NULL),
(70, 3, 1, '2025-04-02 17:19:25', 'sent', 0, 0, 'gehriaumhgieurgzersimghieurgmhiehgmiurehgmioerhgisoer', NULL, NULL),
(71, 3, 1, '2025-04-02 17:27:32', 'sent', 0, 0, 'luz', NULL, NULL),
(72, 3, 1, '2025-04-02 17:27:44', 'sent', 0, 0, 'gehriaumhgieurgzersimghieurgmhiehgmiurehgmioerhgisoer', NULL, NULL),
(73, 9, 1, '2025-04-02 18:18:46', 'sent', 0, 0, 'fsdfsd', NULL, NULL),
(74, 6, 1, '2025-04-02 18:58:40', 'sent', 0, 0, 'jztjz', NULL, NULL),
(75, 6, 1, '2025-04-02 18:58:42', 'sent', 0, 0, 'úőpúőp', NULL, NULL),
(76, 6, 1, '2025-04-02 18:58:44', 'sent', 0, 0, 'őpoőopőpo', NULL, NULL),
(77, 6, 1, '2025-04-02 18:58:46', 'sent', 0, 0, 'poúúpőúőp', NULL, NULL),
(78, 6, 1, '2025-04-02 18:58:46', 'sent', 0, 0, 'őp', NULL, NULL),
(79, 6, 1, '2025-04-02 18:58:46', 'sent', 0, 0, 'őp', NULL, NULL),
(80, 6, 1, '2025-04-02 18:58:47', 'sent', 0, 0, 'őp', NULL, NULL),
(81, 6, 1, '2025-04-02 18:58:47', 'sent', 0, 0, 'őp', NULL, NULL),
(82, 15, 1, '2025-04-03 19:52:11', 'sent', 0, 0, 'ujrzt', NULL, NULL),
(83, 15, 1, '2025-04-03 19:52:12', 'sent', 0, 0, 'fgewgew', NULL, NULL),
(84, 15, 1, '2025-04-03 19:52:12', 'sent', 0, 0, 'gwe', NULL, NULL),
(85, 15, 1, '2025-04-03 19:52:13', 'sent', 0, 0, 'gwe', NULL, NULL),
(86, 15, 1, '2025-04-03 19:52:13', 'sent', 0, 0, 'gw', NULL, NULL),
(87, 15, 1, '2025-04-03 19:52:13', 'sent', 0, 0, 'g', NULL, NULL),
(88, 15, 1, '2025-04-03 19:52:13', 'sent', 0, 0, 'weg', NULL, NULL),
(89, 15, 1, '2025-04-03 19:52:15', 'sent', 0, 0, 'we', NULL, NULL),
(90, 17, 45, '2025-04-03 19:53:25', 'sent', 0, 0, 'hii', NULL, NULL),
(91, 16, 45, '2025-04-03 19:53:34', 'sent', 0, 0, 'éui', NULL, NULL),
(92, 18, 1, '2025-04-03 20:02:31', 'sent', 0, 0, 'ktuz', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `themes`
--

CREATE TABLE `themes` (
  `themeId` int(11) NOT NULL,
  `themeName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `themes`
--

INSERT INTO `themes` (`themeId`, `themeName`) VALUES
(1, 'dark'),
(2, 'light');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `displayName` varchar(20) NOT NULL,
  `displayId` char(4) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` date NOT NULL DEFAULT curdate(),
  `updatedAt` date NOT NULL DEFAULT curdate(),
  `isOnline` tinyint(1) DEFAULT 0,
  `isLookingForFriends` tinyint(1) DEFAULT 0,
  `profilePicPath` varchar(255) DEFAULT NULL,
  `isSiteAdmin` tinyint(1) DEFAULT 0,
  `currentThemeId` int(11) DEFAULT 1,
  `bio` varchar(255) DEFAULT NULL,
  `isBanned` tinyint(1) default 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `displayName`, `displayId`, `email`, `telephone`, `password`, `createdAt`, `updatedAt`, `isOnline`, `isLookingForFriends`, `profilePicPath`, `isSiteAdmin`, `currentThemeId`, `bio`) VALUES
(1, 'Trixep11', '6735', 'trixep11@gmail.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, 'https://placehold.co/150x150', 0, 1, 'halihóóu'),
(2, 'John', '1234', 'john@email.com', '555-1234', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(3, 'Jane', '5678', 'jane@email.com', '555-5678', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(4, 'Tom', '9101', 'tom@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(5, 'Emily', '1122', 'emily@email.com', '555-1122', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(6, 'Chris', '3344', 'chris@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(7, 'Alice', '5566', 'alice@email.com', '555-5566', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(8, 'David', '7788', 'david@email.com', '555-7788', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(9, 'Sophia', '9900', 'sophia@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(10, 'Liam', '2233', 'liam@email.com', '555-2233', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(11, 'Meg', '4455', 'meg@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(12, 'Ethan', '6677', 'ethan@email.com', '555-6677', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(13, 'Olivia', '8899', 'olivia@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(14, 'Jack', '1001', 'jack@email.com', '555-1001', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(15, 'Grace', '2002', 'grace@email.com', '555-2002', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(16, 'Matt', '3003', 'matt@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(17, 'Char', '4004', 'char@email.com', '555-4004', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(18, 'Henry', '5005', 'henry@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(19, 'Ava', '6006', 'ava@email.com', '555-6006', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(20, 'Oliver', '7007', 'oliver@email.com', '555-7007', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(21, 'Isa', '8008', 'isa@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(22, 'Alex', '1111', 'alex@email.com', '555-1111', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(23, 'Lily', '2222', 'lily@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(24, 'Mark', '3333', 'mark@email.com', '555-3333', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(25, 'Nina', '4444', 'nina@email.com', '555-4444', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(26, 'Omar', '5555', 'omar@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(27, 'Eve', '6666', 'eve@email.com', '555-6666', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(28, 'Rex', '7777', 'rex@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(29, 'Mia', '8888', 'mia@email.com', '555-8888', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(30, 'Zoe', '9999', 'zoe@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(31, 'Leo', '1010', 'leo@email.com', '555-1010', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(32, 'Jake', '2020', 'jake@email.com', '555-2020', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(33, 'Tess', '3030', 'tess@email.com', '555-3030', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(34, 'Finn', '4040', 'finn@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(35, 'Nash', '5050', 'nash@email.com', '555-5050', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(36, 'Ivy', '6060', 'ivy@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(37, 'Will', '7070', 'will@email.com', '555-7070', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(38, 'Dean', '8080', 'dean@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(39, 'Hope', '9090', 'hope@email.com', '555-9090', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(40, 'Max', '1212', 'max@email.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 1, NULL, 0, 1, NULL),
(41, 'Ray', '1313', 'ray@email.com', '555-1313', '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 0, 1, NULL),
(42, 'cica', '5210', 'vnoel05@gmail.com', NULL, '$2b$10$PT6efsZ3ArHbh7t6R4HyEu7tIsGz4z105ml3PLzY6oxpOmAMqPQru', '2025-03-29', '2025-03-29', 0, 1, 'https://i.ibb.co/rGTCytZb/class-of-09-nicole-3.jpg', 0, 1, 'end me pls '),
(43, 'tester', '4709', 'asd@asd.com', NULL, '$2b$10$8JB/8AGGTX9i/TnxQ/lAweZmrLzPDUlFeZcP6bvq4hAO/nx6KIrmG', '2025-03-29', '2025-03-29', 0, 0, 'https://i.ibb.co/RGbwzcK7/Screenshot-2024-11-05-180618.png', 0, 1, 'eletkedv NULL'),
(44, 'long ahh nameeeeeeee', '9279', 'dsa@dsa.com', NULL, '$2b$10$mT3CMsHn465B8L0n75Uiqu6WzaCbHoVgaaUqIIZ18VcZQ4I/V0uDC', '2025-03-29', '2025-03-29', 0, 0, NULL, 0, 1, NULL),
(45, 'valami', '0728', 'trixep12@gmail.com', NULL, '$2b$10$IA1WbQF/UnkxNngXJZvwFOtYJY6Tz1SuzolLjltDW8VrUWTVjSRFO', '2025-04-03', '2025-04-03', 0, 0, NULL, 0, 1, NULL),
(46, 'tr342', '6647', 'trixep13@gmail.com', NULL, '$2b$10$iJjd/KoSRIrkN9s4zVp/GuQMOGATmspRv8cNhGm0rW2hb1.Bn3b46', '2025-04-03', '2025-04-03', 0, 0, NULL, 0, 1, NULL),
(47, 'trixepTest', '5258', 'Trixep14@gmail.com', NULL, '$2b$10$2ufpGUfKd72kiKDFMZvyG.VbaRu7ULav7XGiM.5o9K0J066A/Zeee', '2025-04-03', '2025-04-03', 0, 0, NULL, 0, 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attachment`
--
ALTER TABLE `attachment`
  ADD PRIMARY KEY (`attachmentId`);

--
-- Indexes for table `blocked`
--
ALTER TABLE `blocked`
  ADD PRIMARY KEY (`blockedId`),
  ADD KEY `FK_Blocked_Users_User` (`userId`),
  ADD KEY `FK_Blocked_Users_Blockee` (`blockedUserId`);

--
-- Indexes for table `bugreports`
--
ALTER TABLE `bugreports`
  ADD PRIMARY KEY (`bugReportId`),
  ADD KEY `senderUserId` (`senderUserId`),
  ADD KEY `attachmentId` (`attachmentId`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`conversationId`);

--
-- Indexes for table `conversationusers`
--
ALTER TABLE `conversationusers`
  ADD PRIMARY KEY (`conversationUserId`),
  ADD KEY `FK_ConversationUsers_Users` (`userId`),
  ADD KEY `FK_ConversationUsers_Conversations` (`conversationId`);

--
-- Indexes for table `friendrequest`
--
ALTER TABLE `friendrequest`
  ADD PRIMARY KEY (`requestId`),
  ADD KEY `FK_FriendRequest_Users_Sender` (`senderUserId`),
  ADD KEY `FK_FriendRequest_Users_Receiver` (`receiverUserId`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`friendsId`),
  ADD KEY `FK_Friends_Users` (`userId`),
  ADD KEY `FK_Friends_Friends_Users` (`friendUserId`);

--
-- Indexes for table `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`loginId`),
  ADD KEY `FK_Logins_Users` (`userId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`messageId`),
  ADD KEY `FK_Messages_Conversations` (`conversationId`),
  ADD KEY `FK_Messages_Users` (`senderUserId`),
  ADD KEY `FK_Messages_Attachment` (`attachmentId`);

--
-- Indexes for table `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`themeId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `displayId` (`displayId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telephone` (`telephone`),
  ADD KEY `FK_Users_Themes` (`currentThemeId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attachment`
--
ALTER TABLE `attachment`
  MODIFY `attachmentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blocked`
--
ALTER TABLE `blocked`
  MODIFY `blockedId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bugreports`
--
ALTER TABLE `bugreports`
  MODIFY `bugReportId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `conversationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `conversationusers`
--
ALTER TABLE `conversationusers`
  MODIFY `conversationUserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `friendrequest`
--
ALTER TABLE `friendrequest`
  MODIFY `requestId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `friendsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `logins`
--
ALTER TABLE `logins`
  MODIFY `loginId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `messageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `themes`
--
ALTER TABLE `themes`
  MODIFY `themeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocked`
--
ALTER TABLE `blocked`
  ADD CONSTRAINT `FK_Blocked_Users_Blockee` FOREIGN KEY (`blockedUserId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `FK_Blocked_Users_User` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `bugreports`
--
ALTER TABLE `bugreports`
  ADD CONSTRAINT `bugreports_ibfk_1` FOREIGN KEY (`senderUserId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `bugreports_ibfk_2` FOREIGN KEY (`attachmentId`) REFERENCES `attachment` (`attachmentId`);

--
-- Constraints for table `conversationusers`
--
ALTER TABLE `conversationusers`
  ADD CONSTRAINT `FK_ConversationUsers_Conversations` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`conversationId`),
  ADD CONSTRAINT `FK_ConversationUsers_Users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `friendrequest`
--
ALTER TABLE `friendrequest`
  ADD CONSTRAINT `FK_FriendRequest_Users_Receiver` FOREIGN KEY (`receiverUserId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `FK_FriendRequest_Users_Sender` FOREIGN KEY (`senderUserId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `FK_Friends_Friends_Users` FOREIGN KEY (`friendUserId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `FK_Friends_Users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `logins`
--
ALTER TABLE `logins`
  ADD CONSTRAINT `FK_Logins_Users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK_Messages_Attachment` FOREIGN KEY (`attachmentId`) REFERENCES `attachment` (`attachmentId`),
  ADD CONSTRAINT `FK_Messages_Conversations` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`conversationId`),
  ADD CONSTRAINT `FK_Messages_Users` FOREIGN KEY (`senderUserId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_Users_Themes` FOREIGN KEY (`currentThemeId`) REFERENCES `themes` (`themeId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
