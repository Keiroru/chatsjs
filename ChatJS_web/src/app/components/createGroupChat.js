import styles from "@/app/styles/groupChat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSocket } from "@/lib/socket";
import { useTranslation } from "@/contexts/TranslationContext";

export default function CreateGroupChat({
  userData,
  groupChatName,
  setGroupChatName,
}) {
  const { t } = useTranslation();
  const [newTabOpen, setNewTabOpen] = useState(false);
  const [continueTabOpen, setContinueTabOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const socket = useSocket();
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
          friend.displayId?.includes(searchQuery) ||
          selectedFriends.some((f) => f.userId === friend.userId)
      );
      setFilteredPeople(filtered);
    }
  }, [searchQuery, friends, selectedFriends]);

  const createGroupChat = async () => {
    var allUsers = [];

    allUsers.push(userData.userId);
    selectedFriends.forEach((friend) => {
      allUsers.push(friend.userId);
    });

    handleContinueTab();
    handleNewTab();

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

      const response = await res.json();

      socket.emit("create_group_chat", { conversationId: response.conversationId, userIds: allUsers });
      socket.emit("show_group_chat", {
        userIds: allUsers,
        conversationName: groupChatName,
        conversationId: response.conversationId,
        createdAt: response.createdAt,
      });

      if (!res.ok) {
        throw new Error("Failed to create group chat");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewTab = () => {
    setNewTabOpen((prev) => !prev);
    setGroupChatName("");
    setSelectedFriends([]);
    setSearchQuery("");
  };

  const handleContinueTab = () => {
    setContinueTabOpen((prev) => !prev);
    setSelectedFriends([]);
    setSearchQuery("");
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
          {t("createGroupChat")}
        </button>
      ) : (
        <>
          <button
            onClick={handleNewTab}
            className={`${styles.backButton} ${styles.closeButton}`}
          >
            {t("back")}
          </button>
          <div>
            <div className={styles.createField}>
              <input
                type="text"
                maxLength="20"
                placeholder={t("groupName")}
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
             {t("continue")}
            </button>
          </div>
        </>
      )}
      {continueTabOpen && (
        <div className={styles.createContainer} onClick={handleContinueTab}>
          <div
            className={styles.createContainerMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.wrapper}>
              <p>
              {t("createGroupAs")}{" "}
                <span className={styles.groupChatName}>{groupChatName}</span>
              </p>
              <div className={styles.searchContainer}>
                <div className={styles.searchInput}>
                  <input
                    type="text"
                    placeholder={t("search")}
                    value={searchQuery}
                    onChange={handleSearch}
                    aria-label={t("search")}
                    className={styles.searchField}
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={styles.searchIcon}
                  />
                </div>
              </div>
              <span className={styles.infotext}>
              {t("selectSomeone")}
              </span>
              <div className={styles.friendsList}>
                {filteredPeople.map((friend) => (
                  <button
                    key={friend.userId}
                    className={`${styles.friendItem} ${selectedFriends.some((f) => f.userId === friend.userId)
                      ? styles.active
                      : ""
                      }`}
                    onClick={() => toggleFriendSelection(friend)}
                  >
                    <Image
                      src={
                        friend?.profilePicPath ||
                        "/images/user-icon-placeholder.png"
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
                  {t("back")}
                </button>
                <button onClick={createGroupChat} className={styles.goButton}>
                {t("create")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
