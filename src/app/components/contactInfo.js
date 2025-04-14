import { act, useEffect, useState } from "react";
import styles from "@/app/styles/contactInfo.module.css";
import styles2 from "@/app/styles/groupChat.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSearch,
  faEllipsisVertical,
  faDownload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";
import { useSocket } from "@/lib/socket";

export default function ContactInfo({
  setRightPanelOpen,
  activeChat,
  isGroupChat,
  formattedDate,
  userData,
  conversationId,
  fetchConversationId,
  setAttachments,
  attachments,
}) {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [filteredPeople2, setFilteredPeople2] = useState([]);
  const [addFriendsTab, setAddFriendsTab] = useState(false);
  const [moreAction, setMoreAction] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageView, setImageView] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const socket = useSocket();

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (bytes / 1024).toFixed(1) + " KB";
    }
  };

  const downloadImage = async (image) => {
    try {
      const response = await fetch(image.filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = image.fileName || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (newMessage) => {
      console.log(newMessage);
      if (newMessage.attachmentId === null) return;

      const attachment = {
        attachmentId: newMessage.attachmentId,
        fileName: newMessage.fileName,
        filePath: newMessage.filePath,
        fileSize: newMessage.fileSize,
      };
      setAttachments((prevAttachments) => [...prevAttachments, attachment]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

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
    if (searchQuery2.trim() === "") {
      const filtered = friends.filter(
        (friend) => !members.some((member) => member.userId === friend.userId)
      );
      setFilteredPeople2(filtered);
    } else {
      const filtered = friends.filter(
        (friend) =>
          !members.some((member) => member.userId === friend.userId) &&
          (friend.displayName
            ?.toLowerCase()
            .includes(searchQuery2.toLowerCase()) ||
            friend.displayId?.includes(searchQuery2) ||
            selectedFriends.some((f) => f.userId === friend.userId))
      );
      setFilteredPeople2(filtered);
    }
  }, [searchQuery2, friends, selectedFriends, members]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPeople(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.displayName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          member.displayId?.includes(searchQuery)
      );
      setFilteredPeople(filtered);
    }
  }, [searchQuery, members]);

  const getGroupChatMembers = async () => {
    try {
      const response = await fetch(
        `/api/friends/getGroupChatMembers?conversationId=${activeChat.conversationId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      } else {
        let memberData = await response.json();
        setMembers(memberData);

        const currentUser = memberData.find(
          (member) => member.userId === userData.userId
        );
        if (currentUser && currentUser.isAdmin === 1) {
          setIsUserAdmin(true);
        } else {
          setIsUserAdmin(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const kickMember = async (memberId, conversationId) => {
    try {
      const response = await fetch("/api/friends/handleGroupChatMembers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: memberId,
          conversationId: conversationId,
          type: "kick",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to kick member");
      } else {
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.userId !== memberId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const switchMemberAdmin = async (memberId, conversationId) => {
    try {
      const response = await fetch("/api/friends/handleGroupChatMembers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: memberId,
          conversationId: conversationId,
          type: "switch",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      } else {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.userId === memberId
              ? { ...member, isAdmin: member.isAdmin === 1 ? 0 : 1 }
              : member
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const leaveGroupChat = async () => {
    try {
      const res = await fetch(`/api/friends/leaveGroupChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.userId,
          conversationId: activeChat.conversationId,
          otherMembers: members
            .filter((member) => member.userId !== userData.userId)
            .map((member) => member.userId),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to leave group chat");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const addFriendsPost = async () => {
    if (selectedFriends.length <= 0) {
      return;
    }

    try {
      const res = await fetch(`/api/friends/groupChatAddMembers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedFriends: selectedFriends,
          conversationId: activeChat.conversationId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add members to group chat");
      }

      await getGroupChatMembers();
      handleAddFriends();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeChat && isGroupChat) {
      getGroupChatMembers();
    }
  }, [activeChat, isGroupChat]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch2 = (e) => {
    setSearchQuery2(e.target.value);
  };

  const handleAddFriends = () => {
    setAddFriendsTab((prev) => !prev);
    setSelectedFriends([]);
    setSearchQuery2("");
  };

  const handleSetMoreAction = () => {
    setMoreAction((prev) => !prev);
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

  const getAttachments = async () => {
    try {
      const response = await fetch(
        `/api/messages/attachmentGet?conversationId=${conversationId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch attachments: ${response.status}`);
      }
      const data = await response.json();
      setAttachments(data);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      setAttachments([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (activeChat) {
        await fetchConversationId();
      }
    };
    fetchData();
  }, [activeChat, fetchConversationId]);

  useEffect(() => {
    if (conversationId) {
      getAttachments();
    } else {
      setAttachments([]);
    }
  }, [conversationId]);

  return (
    <div className={styles.mainView}>
      <header className={styles["sidebar-header"]}>
        <button
          className={`${styles["close-button"]} ${styles["icon-button"]}`}
          onClick={() => setRightPanelOpen(false)}
          aria-label="Close contact info"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {!isGroupChat ? <h2>Chat Info</h2> : <h2>Group Chat Info</h2>}
      </header>

      <div className={styles["contact-profile-container"]}>
        <Image
          src={
            activeChat?.profilePicPath || "/images/user-icon-placeholder.png"
          }
          alt="Contact profile"
          width={150}
          height={150}
          className={styles["contact-profile"]}
        />
        <hr className={styles.line} />
        <h2 className={styles["profile-name"]}>
          {activeChat?.displayName ||
            activeChat?.conversationName ||
            "Select a contact"}
        </h2>
        {!isGroupChat && (
          <>
            <span className={styles.profileId}>#{activeChat?.displayId}</span>
            <span
              className={`${styles["status-badge"]} ${
                activeChat?.isOnline ? styles["online"] : styles["offline"]
              }`}
            >
              {activeChat?.isOnline ? t("online") : t("offline")}
            </span>
          </>
        )}
      </div>

      <div className={styles["profile-details"]}>
        <section className={styles["profile-section"]}>
          <h3 className={styles["profile-section-title"]}>{t("bio")}</h3>
          <p className={styles["profile-section-content"]}>
            {activeChat?.bio || t("noBioAvailable")}
          </p>
        </section>
        <section className={styles["profile-section"]}>
          {!isGroupChat ? (
            <>
              <h3 className={styles["profile-section-title"]}>
                {t("memberSince")}
              </h3>
              <p className={styles["profile-section-content"]}>
                {formattedDate}
              </p>
            </>
          ) : (
            <>
              <p className={styles["profile-section-content"]}>
                {formattedDate}
              </p>
            </>
          )}
        </section>
      </div>

      {!isGroupChat && (
        <>
          <h1 className={styles.attachmentsTitle}>{t("attachments")}</h1>
          {attachments.length > 0 ? (
            <div className={styles.picturesGrid}>
              {attachments.map((attachment) => (
                <div
                  key={attachment.attachmentId}
                  className={styles.pictureItem}
                >
                  <Image
                    src={attachment.filePath}
                    alt={`Attachment ${attachment.fileName}`}
                    width={100}
                    height={100}
                    className={styles.picture}
                    onClick={() => {
                      setImageOpen(true);
                      setImageView(attachment);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noAttachments}>{t("noAttachments")}</p>
          )}
        </>
      )}

      {imageOpen && (
        <div
          className={styles.imageViewerOverlay}
          onClick={() => setImageOpen(false)}
        >
          <div
            className={styles.imageViewerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.imageViewerHeader}>
              <button
                className={styles.downloadButton}
                onClick={async () => {
                  downloadImage(imageView);
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <button
                className={styles.closeButton}
                onClick={() => setImageOpen(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <Image
              src={imageView.filePath}
              alt={imageView.fileName}
              width={500}
              height={500}
              className={styles.imageViewerImage}
            />

            <div className={styles.imageViewerDetails}>
              <p className={styles.imageName}>{imageView.fileName}</p>
              <p className={styles.imageSize}>
                {formatFileSize(imageView.fileSize)}
              </p>
            </div>
          </div>
        </div>
      )}

      {isGroupChat && (
        <>
          <div className={styles.searchContainer}>
            <div className={styles.searchInput2}>
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search someone"
                className={styles.searchField}
              />
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            </div>
          </div>

          <div className={styles.friendsList}>
            {filteredPeople.map((member) => (
              <div key={member.userId} className={styles.friendItem}>
                <Image
                  src={
                    member?.profilePicPath ||
                    "/images/user-icon-placeholder.png"
                  }
                  alt="Friend avatar"
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>{member.displayName}</h3>
                  <p className={styles.displayId}>#{member.displayId}</p>
                </div>
                {member.isAdmin === 1 && (
                  <p className={styles.adminText}>ADMIN</p>
                )}
                {moreAction === true &&
                  isUserAdmin === true &&
                  member.userId !== userData.userId && (
                    <div className={styles.buttonsHolder}>
                      {member.isAdmin === 1 ? (
                        <button
                          className={styles.goButton}
                          onClick={() =>
                            switchMemberAdmin(
                              member.userId,
                              activeChat.conversationId
                            )
                          }
                        >
                          {t("removeAdmin")}
                        </button>
                      ) : (
                        <button
                          className={styles.goButton}
                          onClick={() =>
                            switchMemberAdmin(
                              member.userId,
                              activeChat.conversationId
                            )
                          }
                        >
                          {t("makeAdmin")}
                        </button>
                      )}
                      <button
                        className={styles.backButton}
                        onClick={() =>
                          kickMember(member.userId, activeChat.conversationId)
                        }
                      >
                        {t("kick")}
                      </button>
                    </div>
                  )}
                <button
                  className={styles.moreButton}
                  onClick={() => handleSetMoreAction()}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.addButtonHolder}>
            <button className={styles.goButton} onClick={handleAddFriends}>
              {t("pushButton")}
            </button>
            <button className={styles.backButton} onClick={leaveGroupChat}>
              Leave Group Chat
            </button>
          </div>
          {addFriendsTab && (
            <div className={styles2.createContainer} onClick={handleAddFriends}>
              <div
                className={styles2.createContainerMenu}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles2.wrapper}>
                  <p>
                    Add friends to{" "}
                    <span className={styles2.groupChatName}>
                      {activeChat.groupChatName}
                    </span>
                  </p>
                  <div className={styles2.searchContainer}>
                    <div className={styles2.searchInput}>
                      <input
                        type="text"
                        placeholder="Search someone"
                        value={searchQuery2}
                        onChange={handleSearch2}
                        aria-label="Search someone"
                        className={styles2.searchField}
                      />
                      <FontAwesomeIcon
                        icon={faSearch}
                        className={styles2.searchIcon}
                      />
                    </div>
                  </div>
                  <span className={styles2.infotext}>
                    Select friends to join your group chat
                  </span>
                  <div className={styles2.friendsList}>
                    {filteredPeople2.map((friend) => (
                      <button
                        key={friend.userId}
                        className={`${styles2.friendItem} ${
                          selectedFriends.some(
                            (f) => f.userId === friend.userId
                          )
                            ? styles2.active
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
                          className={styles2.avatar}
                        />
                        <div className={styles2.friendInfo}>
                          <h3 className={styles2.friendName}>
                            {friend.displayName}
                          </h3>
                          <p className={styles2.displayId}>
                            #{friend.displayId}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className={styles2.buttonsHolder}>
                    <button
                      onClick={handleAddFriends}
                      className={styles2.backButton}
                    >
                      Back
                    </button>
                    <button
                      onClick={addFriendsPost}
                      className={styles2.goButton}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
