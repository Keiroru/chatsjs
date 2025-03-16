-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 16. 20:32
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
-- Tábla szerkezet ehhez a táblához `friendrequests`
--

CREATE TABLE `friendrequests` (
  `requestId` int(11) NOT NULL,
  `senderUserId` int(11) NOT NULL,
  `receiverUserId` int(11) NOT NULL,
  `sentAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted','declined') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `friendrequests`
--

INSERT INTO `friendrequests` (`requestId`, `senderUserId`, `receiverUserId`, `sentAt`, `status`) VALUES
(17, 2, 1, '2025-03-16 19:28:14', 'accepted'),
(18, 3, 1, '2025-03-16 19:28:14', 'accepted');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `friends`
--

CREATE TABLE `friends` (
  `userId` int(11) NOT NULL,
  `friendUserId` int(11) NOT NULL,
  `friendedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `friends`
--

INSERT INTO `friends` (`userId`, `friendUserId`, `friendedAt`) VALUES
(1, 2, '2025-03-16 19:28:18'),
(1, 3, '2025-03-16 19:28:19'),
(2, 1, '2025-03-16 19:28:18'),
(3, 1, '2025-03-16 19:28:19');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `userId` int(5) NOT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL COMMENT 'store hash',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('online','offline','away','') DEFAULT NULL COMMENT 'online true || offline false',
  `profilePicPath` varchar(255) DEFAULT NULL,
  `bio` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`userId`, `displayName`, `email`, `telephone`, `password`, `createdAt`, `updatedAt`, `status`, `profilePicPath`, `bio`) VALUES
(1, 'cirmi cicus', 'vnoel05@gmail.com', NULL, 'asd', '2025-03-07 16:54:09', '2025-03-16 18:52:08', '', 'https://i.ibb.co/BKv4Yrq8/class-of-09-nicole-3.jpg', 'legszebb cica\r\n'),
(2, 'valaki meno', 'izomhegy55@gmail.com', NULL, 'asdasdasdA1', '2025-03-07 17:01:36', '2025-03-16 19:31:43', 'online', 'https://i.ibb.co/nq79qzNx/Jecka-3.jpg', 'szep cica vagyok'),
(3, 'lula', 'bammeg@asd.com', NULL, 'asdasdasdA1', '2025-03-10 16:19:43', '2025-03-16 17:54:23', '', 'https://i.ibb.co/dsstLbKK/Synthwave-Goth-Girl.jpg', 'teccel baby gurl'),
(4, 'Alice Johnson', 'alice.johnson@example.com', '1234567890', 'password123', '2025-03-11 11:00:00', '2025-03-16 13:28:59', 'online', NULL, 'Thank you for downloading this script. Yes, this is the entire Bee Movie script written on Notability. I don\'t know why\r\nyou would want this, but I guess it\'s funny. You may make any changes you want,'),
(5, 'Bob Smith', 'bob.smith@example.com', '1234567891', 'password123', '2025-03-11 11:10:00', '2025-03-16 13:29:54', 'online', NULL, ''),
(6, 'Charlie Brown', 'charlie.brown@example.com', '1234567892', 'password123', '2025-03-11 11:20:00', '2025-03-16 13:29:54', '', NULL, ''),
(7, 'Diana Prince', 'diana.prince@example.com', '1234567893', 'password123', '2025-03-11 11:30:00', '2025-03-16 13:29:54', 'online', NULL, ''),
(8, 'Ethan Hunt', 'ethan.hunt@example.com', '1234567894', 'password123', '2025-03-11 11:40:00', '2025-03-16 13:29:54', '', NULL, ''),
(9, 'Fiona Gallagher', 'fiona.gallagher@example.com', '1234567895', 'password123', '2025-03-11 11:50:00', '2025-03-16 13:29:54', 'online', NULL, ''),
(10, 'George Clooney', 'george.clooney@example.com', '1234567896', 'password123', '2025-03-11 12:00:00', '2025-03-16 13:29:54', '', NULL, ''),
(11, 'Hannah Montana', 'hannah.montana@example.com', '1234567897', 'password123', '2025-03-11 12:10:00', '2025-03-16 13:29:54', 'online', NULL, ''),
(12, 'Ian McKellen', 'ian.mckellen@example.com', '1234567898', 'password123', '2025-03-11 12:20:00', '2025-03-16 13:29:54', '', NULL, ''),
(13, 'Jessica Alba', 'jessica.alba@example.com', '1234567899', 'password123', '2025-03-11 12:30:00', '2025-03-16 13:29:13', 'online', NULL, '');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `friendrequests`
--
ALTER TABLE `friendrequests`
  ADD PRIMARY KEY (`requestId`),
  ADD UNIQUE KEY `senderUserId` (`senderUserId`,`receiverUserId`),
  ADD KEY `receiverUserId` (`receiverUserId`);

--
-- A tábla indexei `friends`
--
ALTER TABLE `friends`
  ADD UNIQUE KEY `userId` (`userId`,`friendUserId`),
  ADD KEY `friendUserId` (`friendUserId`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telephone` (`telephone`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `friendrequests`
--
ALTER TABLE `friendrequests`
  MODIFY `requestId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `friendrequests`
--
ALTER TABLE `friendrequests`
  ADD CONSTRAINT `friendrequests_ibfk_1` FOREIGN KEY (`senderUserId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `friendrequests_ibfk_2` FOREIGN KEY (`receiverUserId`) REFERENCES `users` (`userId`);

--
-- Megkötések a táblához `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friendUserId`) REFERENCES `users` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
