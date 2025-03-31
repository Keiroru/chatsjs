import styles from "@/app/styles/groupChat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CreateGroupChat({
  userData,
  groupChatName,
  setGroupChatName,
}) {
  const [newTabOpen, setNewTabOpen] = useState(false);
  const [continueTabOpen, setContinueTabOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `/api/friends/list?userId=${userData.userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriends();
  }, [userData.userId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPeople(friends);
    } else {
      const filtered = friends.filter(
        (friend) =>
          friend.displayName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          friend.displayId?.includes(searchQuery)
      );
      setFilteredPeople(filtered);
    }
  }, [searchQuery, friends]);

  const createGroupChat = async () => {
    var allUsers = [];

    allUsers.push(userData.userId);
    selectedFriends.forEach((friend) => {
      allUsers.push(friend.userId);
    });

    try {
      const res = await fetch(`/api/messages/conversationCreate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId1: null,
          userId2: null,
          groupChatName,
          otherUsers: allUsers,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create group chat");
      }
      // const response = await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewTab = () => {
    setNewTabOpen((prev) => !prev);
  };

  const handleContinueTab = () => {
    setContinueTabOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleFriendSelection = (friend) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.some((f) => f.userId === friend.userId)) {
        return prevSelected.filter((f) => f.userId !== friend.userId);
      } else {
        return [...prevSelected, friend];
      }
    });
  };

  return (
    <div className={styles.container}>
      {!newTabOpen ? (
        <button onClick={handleNewTab} className={styles.goButton}>
          Create a new group
        </button>
      ) : (
        <>
          <button onClick={handleNewTab} className={styles.backButton}>
            Close
          </button>
          <div>
            <div className={styles.createField}>
              <input
                type="text"
                maxLength="20"
                placeholder="Group chat name"
                aria-label="groupChat"
                onChange={(e) => setGroupChatName(e.target.value)}
                className={styles.inputName}
              />
            </div>
            <button
              onClick={handleContinueTab}
              className={styles.goButton}
              disabled={!groupChatName || !groupChatName.trim()}
            >
              Continue
            </button>
          </div>
        </>
      )}
      {continueTabOpen && (
        <div className={styles.createContainer}>
          <div className={styles.createContainerMenu}>
            <div className={styles.wrapper}>
              <p>Create new group chat as {groupChatName}</p>
              <div className={styles.searchContainer}>
                <div className={styles.searchInput}>
                  <input
                    type="text"
                    placeholder="Search someone"
                    value={searchQuery}
                    onChange={handleSearch}
                    aria-label="Search someone"
                    className={styles.searchField}
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={styles.searchIcon}
                  />
                </div>
              </div>
              <div className={styles.friendsList}>
                {filteredPeople.map((friend) => (
                  <button
                    key={friend.userId}
                    className={`${styles.friendItem} ${
                      selectedFriends.some((f) => f.userId === friend.userId)
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => toggleFriendSelection(friend)}
                  >
                    <Image
                      src={
                        friend?.profilePicPath || "https://placehold.co/50x50"
                      }
                      alt="Friend avatar"
                      width={40}
                      height={40}
                      className={styles.avatar}
                    />
                    <div className={styles.friendInfo}>
                      <h3 className={styles.friendName}>
                        {friend.displayName}
                      </h3>
                      <p className={styles.displayId}>#{friend.displayId}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className={styles.buttonsHolder}>
                <button
                  onClick={handleContinueTab}
                  className={styles.backButton}
                >
                  Back
                </button>
                <button onClick={createGroupChat} className={styles.goButton}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
