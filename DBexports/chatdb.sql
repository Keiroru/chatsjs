-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 20. 11:23
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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `conversationusers`
--

CREATE TABLE `conversationusers` (
  `conversationUserId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `joinedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `friendrequest`
--

CREATE TABLE `friendrequest` (
  `requestId` int(11) NOT NULL,
  `senderUserId` int(11) NOT NULL,
  `requestFriendUserId` int(11) NOT NULL,
  `sentAt` date NOT NULL DEFAULT curdate(),
  `isTimedOut` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `conversationId` int(11) NOT NULL,
  `senderUserId` int(11) NOT NULL,
  `sentAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `state` enum('sent','delivered','seen') NOT NULL DEFAULT 'sent',
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `isEdited` tinyint(1) NOT NULL DEFAULT 0,
  `messageText` text DEFAULT NULL,
  `attachmentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `displayId` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` date NOT NULL DEFAULT curdate(),
  `updatedAt` date NOT NULL DEFAULT curdate(),
  `isOnline` tinyint(1) DEFAULT 0,
  `profilePicPath` varchar(255) DEFAULT NULL,
  `isSiteAdmin` tinyint(1) DEFAULT 0,
  `currentThemeId` int(11) DEFAULT 0,
  `bio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`userId`, `displayName`, `displayId`, `email`, `telephone`, `password`, `createdAt`, `updatedAt`, `isOnline`, `profilePicPath`, `isSiteAdmin`, `currentThemeId`, `bio`) VALUES
(1, 'John Doe', 34928, 'johndoe@example.com', '123-456-7890', 'hashedpassword1', '2025-03-20', '2025-03-20', 0, 'https://i.ibb.co/BKv4Yrq8/class-of-09-nicole-3.jpg', 0, 1, 'Just a regular guy who loves coding.'),
(2, 'Jane Smith', 84759, 'janesmith@example.com', '987-654-3210', 'hashedpassword2', '2025-03-20', '2025-03-20', 0, 'https://i.ibb.co/nq79qzNx/Jecka-3.jpg', 0, 1, 'Tech enthusiast and nature lover.'),
(3, 'Samuel Lee', 12347, 'samuellee@example.com', '555-123-4567', 'hashedpassword3', '2025-03-20', '2025-03-20', 0, 'https://i.ibb.co/dsstLbKK/Synthwave-Goth-Girl.jpg', 0, 1, 'Software developer. Passionate about AI and robotics.'),
(4, 'Emily Taylor', 65231, 'emilytaylor@example.com', '333-444-5555', 'hashedpassword4', '2025-03-20', '2025-03-20', 0, NULL, 0, 1, 'Designer with a love for art and technology.'),
(5, 'Michael Brown', 97012, 'mikebrown@example.com', '666-777-8888', 'hashedpassword5', '2025-03-20', '2025-03-20', 0, NULL, 0, 1, 'Photographer and adventurer.'),
(6, 'Olivia White', 22156, 'oliviawhite@example.com', '222-333-4444', 'hashedpassword6', '2025-03-20', '2025-03-20', 0, NULL, 0, 1, 'Marketing strategist and foodie.'),
(7, 'David Clark', 78691, 'davidclark@example.com', '444-555-6666', 'hashedpassword7', '2025-03-20', '2025-03-20', 0, NULL, 0, 1, 'Travel enthusiast and sports fan.'),
(8, 'Sophia Harris', 23980, 'sophiaharris@example.com', '111-222-3333', 'hashedpassword8', '2025-03-20', '2025-03-20', 0, NULL, 0, 1, 'Writer, dreamer, and coffee lover.'),
(9, 'James King', 51372, 'jamesking@example.com', '777-888-9999', 'hashedpassword9', '2025-03-20', '2025-03-20', 0, NULL, 0, 1, 'Lifelong learner and technology advocate.'),
(10, 'Isabella Scott', 94321, 'isabellascott@example.com', '555-666-7777', 'hashedpassword10', '2025-03-20', '2025-03-20', 0, NULL, 0, 1, 'Marketing guru and bookworm.');

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
  ADD KEY `FK_FriendRequest_Users_Receiver` (`requestFriendUserId`);

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
  MODIFY `conversationId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `conversationusers`
--
ALTER TABLE `conversationusers`
  MODIFY `conversationUserId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `friendrequest`
--
ALTER TABLE `friendrequest`
  MODIFY `requestId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `friends`
--
ALTER TABLE `friends`
  MODIFY `friendsId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `logins`
--
ALTER TABLE `logins`
  MODIFY `loginId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `messages`
--
ALTER TABLE `messages`
  MODIFY `messageId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `themes`
--
ALTER TABLE `themes`
  MODIFY `themeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  ADD CONSTRAINT `FK_FriendRequest_Users_Receiver` FOREIGN KEY (`requestFriendUserId`) REFERENCES `users` (`userId`),
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
