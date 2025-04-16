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
  `fileName` varchar(255) NOT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `conversationusers`
--

CREATE TABLE `conversationusers` (
  `conversationUsersId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `joinedAt` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `userAgent` varchar(20) NOT NULL,
  `deviceName` varchar(255) NOT NULL
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
  `replyTo` int(11) DEFAULT NULL,
  `isReported` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `isBanned` tinyint(1) DEFAULT 0,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `displayName`, `displayId`, `email`, `telephone`, `password`, `createdAt`, `updatedAt`, `isOnline`, `isLookingForFriends`, `profilePicPath`, `isSiteAdmin`, `currentThemeId`, `bio`) VALUES
(1, 'Trixep11', '6735', 'trixep11@gmail.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 0, 0, NULL, 1, 1, 'halihóóu'),
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
  ADD PRIMARY KEY (`conversationUsersId`),
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
  MODIFY `conversationUsersId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
