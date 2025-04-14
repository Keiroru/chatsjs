import { useState, useEffect } from "react";
import style from "@/app/styles/logins.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Logins({ userData }) {
  const { t } = useTranslation();
  const [logins, setLogins] = useState([]);
  const [loginId, setLoginId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)loginId=([^;]*)/);
    if (cookieMatch) {
      setLoginId(cookieMatch[1]);
    }

    fetchLogins();
  }, []);

  const fetchLogins = async () => {
    const response = await fetch(
      `/api/profile/getLogins?userId=${userData.userId}`
    );
    if (response.ok) {
      const data = await response.json();
      setLogins(data.result);
    } else {
      console.error("Failed to fetch logins");
    }
  };

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={style.loginsContainer}>
      <h1 className={style.loginsTitle}>{t("loginsSetting")}</h1>

      <div className={style.loginsSection}>
        <h2 className={style.loginSectionTitle}>{t("activeDevices")}</h2>
        <div className={style.loginDevices}>
          {logins.length > 0 && (
            <>
              <div className={style.gridContainer}>
                <div className={style.gridHeader}>Browser</div>
                <div className={style.gridHeader}>Login Date</div>
                <div className={style.gridHeader}>Status</div>
                <div className={style.gridHeader}>More Info</div>
              </div>
              {logins.map((login, index) => (
                <div
                  key={index}
                  className={`${style.reportItem} ${
                    index % 2 === 0 ? style.evenRow : style.oddRow
                  }`}
                >
                  <div className={style.gridCell}>{login.userAgent}</div>
                  <div className={style.gridCell}>
                    {formatDate(login.loginDate)}
                  </div>
                  <div className={style.gridCell}>
                    <span
                      className={
                        login.isLoggedIn === 1
                          ? style.loggedIn
                          : style.loggedOut
                      }
                    >
                      {login.isLoggedIn === 1 ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div className={style.gridCell}>
                    <div
                      className={style.expandButton}
                      onClick={() => handleRowClick(index)}
                    >
                      <FontAwesomeIcon
                        icon={expandedRow === index ? faChevronUp : faChevronDown}
                        className={style.expandIcon}
                      />
                    </div>
                  </div>
                  {expandedRow === index && (
                    <div className={style.expandedDetails}>
                      {login.logoutDate !== null && (
                        <div className={style.detailsRow}>
                          <div className={style.detailsLabel}>Logout Date:</div>
                          <div className={style.detailsValue}>
                            {formatDate(login.logoutDate)}
                          </div>
                        </div>
                      )}
                      {Number(login.loginId) === Number(loginId) && (
                        <div className={style.detailsRow}>
                          <div className={`${style.detailsLabel} ${style.thisSession}`}>
                            Currently Active Device
                          </div>
                        </div>
                      )}

                      <div className={style.detailsRow}>
                        <div className={style.detailsLabel}>Location:</div>
                        <div className={style.detailsValue}>
                          {login.location}
                        </div>
                      </div>
                      <div className={style.detailsRow}>
                        <div className={style.detailsLabel}>IP Address:</div>
                        <div className={style.detailsValue}>
                          {login.ipAddress}
                        </div>
                      </div>
                      <div className={style.detailsRow}>
                        <div className={style.detailsLabel}>Device Type:</div>
                        <div className={style.detailsValue}>
                          {login.deviceType}
                        </div>
                      </div>
                      <div className={style.detailsRow}>
                        <div className={style.detailsLabel}>Device Name:</div>
                        <div className={style.detailsValue}>
                          {login.deviceName}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
