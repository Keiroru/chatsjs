import { useEffect, useState } from "react";
import styles from "@/app/styles/contactInfo.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ContactInfo({
  setRightPanelOpen,
  activeChat,
  isGroupChat,
  formattedDate,
  userData,
}) {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState(false);
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

  useEffect(() => {
    if (activeChat && isGroupChat) {
      getGroupChatMembers();
    }
  }, [activeChat, isGroupChat]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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
              className={`${styles["status-badge"]} ${activeChat?.isOnline ? styles["online"] : styles["offline"]
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
              <h3 className={styles["profile-section-title"]}>{t("memberSince")}</h3>
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
      {isGroupChat && (
        <>
          <div className={styles.searchContainer}>
            <div className={styles.searchInput}>
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
              <div
                key={member.userId}
                className={`${styles.friendItem}
                }`}
              >
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
                {member.isAdmin === 1 && <p>ADMIN</p>}
                {isUserAdmin === true && member.userId != userData.userId && (
                  <>
                    {member.isAdmin === 1 ? (
                      <button>{t("removeAdmin")}</button>
                    ) : (
                      <button>{t("makeAdmin")}</button>
                    )}

                    <button>{t("kick")}</button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div>
            <button>
              {t("pushButton")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
