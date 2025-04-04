import { useEffect, useState } from "react";
import styles from "@/app/styles/chat.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes, faCog } from "@fortawesome/free-solid-svg-icons";

export default function ContactInfo({
  setRightPanelOpen,
  activeChat,
  isGroupChat,
  formattedDate,
}) {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);

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
    console.log(activeChat.conversationId)
    try {
      const response = await fetch(
        `/api/messages/getMessages?conversationId=${activeChat.conversationId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      // const response = await res.json();

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeChat && isGroupChat) {
      getGroupChatMembers();
    }
  }, [activeChat]);

  return (
    <div>
      <header className={styles["sidebar-header"]}>
        <button
          className={`${styles["close-button"]} ${styles["icon-button"]}`}
          onClick={() => setRightPanelOpen(false)}
          aria-label="Close contact info"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Contact Info</h2>
      </header>

      <div className={styles["contact-profile-container"]}>
        <Image
          src={activeChat?.profilePicPath || "https://placehold.co/100x100"}
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
              {activeChat?.isOnline ? "Online" : "Offline"}
            </span>
          </>
        )}
      </div>

      <div className={styles["profile-details"]}>
        <section className={styles["profile-section"]}>
          <h3 className={styles["profile-section-title"]}>Bio</h3>
          <p className={styles["profile-section-content"]}>
            {activeChat?.bio || "No bio available"}
          </p>
        </section>
        <section className={styles["profile-section"]}>
          {!isGroupChat ? (
            <>
              <h3 className={styles["profile-section-title"]}>Member Since</h3>
              <p className={styles["profile-section-content"]}>
                {formattedDate}
              </p>
            </>
          ) : (
            <>
              {" "}
              <h3 className={styles["profile-section-title"]}>Created At</h3>
              <p className={styles["profile-section-content"]}>
                {formattedDate}
              </p>
            </>
          )}
        </section>
      </div>
      gewgew
    </div>
  );
}
