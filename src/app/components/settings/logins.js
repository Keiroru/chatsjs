import { useState, useEffect } from "react";
import style from "@/app/styles/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Logins({ userData }) {
  const { t } = useTranslation();
  const [logins, setLogins] = useState([]);
  const [loginId, setLoginId] = useState(null);

  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)loginId=([^;]*)/);
    if (cookieMatch) {
      setLoginId(cookieMatch[1]);
    }
    console.log("Login ID from cookie:", cookieMatch[1]);

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

  return (
    <div className={style.accountContainer}>
      <h1 className={style.accountTitle}>{t("bugReport")}</h1>
      <p className={style.accountDescription}>{t("bugReportDescription")}</p>

      <div className={style.accountSection}></div>

      <div className={style.accountSection}>
        <h2 className={style.accountSectionTitle}>{t("reportHistory")}</h2>
        <div className={style.reportHistory}>
          {logins.length > 0 ? (
            <>
              <div className={style.gridContainer}>
                <div className={style.gridHeader}>login date</div>
                <div className={style.gridHeader}>logout date</div>
                <div className={style.gridHeader}>location</div>
                <div className={style.gridHeader}>ip address</div>
                <div className={style.gridHeader}>device type</div>
                <div className={style.gridHeader}>browser</div>
                <div className={style.gridHeader}>device name</div>
                <div className={style.gridHeader}>is logged in</div>
              </div>
              {logins.map((login, index) => (
                <div key={index} className={style.reportItem}>
                  <div className={style.gridContainer}>
                    <div className={style.gridCell}>{login.loginDate}</div>
                    <div className={style.gridCell}>{login.logoutDate}</div>
                    <div className={style.gridCell}>{login.location}</div>
                    <div className={style.gridCell}>{login.ipAddress}</div>
                    <div className={style.gridCell}>{login.deviceType}</div>
                    <div className={style.gridCell}>{login.userAgent}</div>
                    <div className={style.gridCell}>{login.deviceName}</div>
                    <div className={style.gridCell}>
                      <span>
                        {login.isLoggedIn === 1 ? "logged in" : "logged out"}
                      </span>
                    </div>
                    <div className={style.gridCell}>
                      <span>
                        {Number(login.loginId) === Number(loginId) &&
                          "THIS SESSION"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={style.noReports}>{t("noReports")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
