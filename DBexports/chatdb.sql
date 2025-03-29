-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 29. 22:56
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `chatdb`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `attachment`
--

CREATE TABLE `attachment` (
  `attachmentId` int(11) NOT NULL,
  `fileType` varchar(10) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `fileSize` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `blocked`
--

CREATE TABLE `blocked` (
  `blockedId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `blockedUserId` int(11) NOT NULL,
  `blockedAt` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `conversations`
--

CREATE TABLE `conversations` (
  `conversationId` int(11) NOT NULL,
  `conversationName` varchar(255) NOT NULL,
  `createdAt` date NOT NULL DEFAULT curdate(),
  `isGroupChat` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `conversations`
--

INSERT INTO `conversations` (`conversationId`, `conversationName`, `createdAt`, `isGroupChat`) VALUES
(1, 'tester and cica', '2025-03-29', 0),
(2, 'tester2 and cica', '2025-03-29', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `conversationusers`
--

CREATE TABLE `conversationusers` (
  `conversationUserId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `joinedAt` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `conversationusers`
--

INSERT INTO `conversationusers` (`conversationUserId`, `userId`, `conversationId`, `isAdmin`, `joinedAt`) VALUES
(1, 43, 1, 0, '2025-03-29'),
(2, 42, 1, 0, '2025-03-29'),
(3, 44, 2, 0, '2025-03-29'),
(4, 42, 2, 0, '2025-03-29');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `friendrequest`
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
-- A tábla adatainak kiíratása `friendrequest`
--

INSERT INTO `friendrequest` (`requestId`, `senderUserId`, `receiverUserId`, `sentAt`, `isTimedOut`, `status`) VALUES
(1, 43, 42, '2025-03-29', 0, 'accepted'),
(2, 44, 42, '2025-03-29', 0, 'accepted');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `friends`
--

CREATE TABLE `friends` (
  `friendsId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `friendUserId` int(11) NOT NULL,
  `friendedAt` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `friends`
--

INSERT INTO `friends` (`friendsId`, `userId`, `friendUserId`, `friendedAt`) VALUES
(1, 42, 43, '2025-03-29'),
(2, 43, 42, '2025-03-29'),
(3, 42, 44, '2025-03-29'),
(4, 44, 42, '2025-03-29');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `logins`
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
-- Tábla szerkezet ehhez a táblához `messages`
--

CREATE TABLE `messages` (
  `messageId` int(11) NOT NULL,
  `conversationId` int(11) DEFAULT NULL,
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
-- A tábla adatainak kiíratása `messages`
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
(47, 1, 42, '2025-03-29 21:56:00', 'sent', 0, 0, 'bruh?', NULL, 39);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `themes`
--

CREATE TABLE `themes` (
  `themeId` int(11) NOT NULL,
  `themeName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `themes`
--

INSERT INTO `themes` (`themeId`, `themeName`) VALUES
(1, 'dark'),
(2, 'light');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
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
  `bio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`userId`, `displayName`, `displayId`, `email`, `telephone`, `password`, `createdAt`, `updatedAt`, `isOnline`, `isLookingForFriends`, `profilePicPath`, `isSiteAdmin`, `currentThemeId`, `bio`) VALUES
(1, 'Trixep11', '6735', 'trixep11@gmail.com', NULL, '$2b$10$lt4LFk70cRyFYAcNe/476exEYJTJp6SIA76i1bJTtkrgpvqBq0rRG', '2025-03-28', '2025-03-28', 1, 0, NULL, 0, 1, NULL),
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
(42, 'cica', '5210', 'vnoel05@gmail.com', NULL, '$2b$10$PT6efsZ3ArHbh7t6R4HyEu7tIsGz4z105ml3PLzY6oxpOmAMqPQru', '2025-03-29', '2025-03-29', 1, 1, 'https://i.ibb.co/rGTCytZb/class-of-09-nicole-3.jpg', 0, 1, 'end me pls '),
(43, 'tester', '4709', 'asd@asd.com', NULL, '$2b$10$8JB/8AGGTX9i/TnxQ/lAweZmrLzPDUlFeZcP6bvq4hAO/nx6KIrmG', '2025-03-29', '2025-03-29', 1, 0, 'https://i.ibb.co/RGbwzcK7/Screenshot-2024-11-05-180618.png', 0, 1, 'eletkedv NULL'),
(44, 'long ahh nameeeeeeee', '9279', 'dsa@dsa.com', NULL, '$2b$10$mT3CMsHn465B8L0n75Uiqu6WzaCbHoVgaaUqIIZ18VcZQ4I/V0uDC', '2025-03-29', '2025-03-29', 0, 0, NULL, 0, 1, NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `attachment`
--
ALTER TABLE `attachment`
  ADD PRIMARY KEY (`attachmentId`);

--
-- A tábla indexei `blocked`
--
ALTER TABLE `blocked`
  ADD PRIMARY KEY (`blockedId`),
  ADD KEY `FK_Blocked_Users_User` (`userId`),
  ADD KEY `FK_Blocked_Users_Blockee` (`blockedUserId`);

--
-- A tábla indexei `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`conversationId`);

--
-- A tábla indexei `conversationusers`
--
ALTER TABLE `conversationusers`
  ADD PRIMARY KEY (`conversationUserId`),
  ADD KEY `FK_ConversationUsers_Users` (`userId`),
  ADD KEY `FK_ConversationUsers_Conversations` (`conversationId`);

--
-- A tábla indexei `friendrequest`
--
ALTER TABLE `friendrequest`
  ADD PRIMARY KEY (`requestId`),
  ADD KEY `FK_FriendRequest_Users_Sender` (`senderUserId`),
  ADD KEY `FK_FriendRequest_Users_Receiver` (`receiverUserId`);

--
-- A tábla indexei `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`friendsId`),
  ADD KEY `FK_Friends_Users` (`userId`),
  ADD KEY `FK_Friends_Friends_Users` (`friendUserId`);

--
-- A tábla indexei `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`loginId`),
  ADD KEY `FK_Logins_Users` (`userId`);

--
-- A tábla indexei `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`messageId`),
  ADD KEY `FK_Messages_Conversations` (`conversationId`),
  ADD KEY `FK_Messages_Users` (`senderUserId`),
  ADD KEY `FK_Messages_Attachment` (`attachmentId`);

--
-- A tábla indexei `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`themeId`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `displayId` (`displayId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telephone` (`telephone`),
  ADD KEY `FK_Users_Themes` (`currentThemeId`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `attachment`
--
ALTER TABLE `attachment`
  MODIFY `attachmentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `blocked`
--
ALTER TABLE `blocked`
  MODIFY `blockedId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `conversations`
--
ALTER TABLE `conversations`
  MODIFY `conversationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `conversationusers`
--
ALTER TABLE `conversationusers`
  MODIFY `conversationUserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `friendrequest`
--
ALTER TABLE `friendrequest`
  MODIFY `requestId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `friends`
--
ALTER TABLE `friends`
  MODIFY `friendsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `logins`
--
ALTER TABLE `logins`
  MODIFY `loginId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `messages`
--
ALTER TABLE `messages`
  MODIFY `messageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT a táblához `themes`
--
ALTER TABLE `themes`
  MODIFY `themeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `blocked`
--
ALTER TABLE `blocked`
  ADD CONSTRAINT `FK_Blocked_Users_Blockee` FOREIGN KEY (`blockedUserId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `FK_Blocked_Users_User` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Megkötések a táblához `conversationusers`
--
ALTER TABLE `conversationusers`
  ADD CONSTRAINT `FK_ConversationUsers_Conversations` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`conversationId`),
  ADD CONSTRAINT `FK_ConversationUsers_Users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Megkötések a táblához `friendrequest`
--
ALTER TABLE `friendrequest`
  ADD CONSTRAINT `FK_FriendRequest_Users_Receiver` FOREIGN KEY (`receiverUserId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `FK_FriendRequest_Users_Sender` FOREIGN KEY (`senderUserId`) REFERENCES `users` (`userId`);

--
-- Megkötések a táblához `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `FK_Friends_Friends_Users` FOREIGN KEY (`friendUserId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `FK_Friends_Users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Megkötések a táblához `logins`
--
ALTER TABLE `logins`
  ADD CONSTRAINT `FK_Logins_Users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Megkötések a táblához `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK_Messages_Attachment` FOREIGN KEY (`attachmentId`) REFERENCES `attachment` (`attachmentId`),
  ADD CONSTRAINT `FK_Messages_Conversations` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`conversationId`),
  ADD CONSTRAINT `FK_Messages_Users` FOREIGN KEY (`senderUserId`) REFERENCES `users` (`userId`);

--
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_Users_Themes` FOREIGN KEY (`currentThemeId`) REFERENCES `themes` (`themeId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
