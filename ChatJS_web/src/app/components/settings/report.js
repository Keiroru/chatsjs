"use client";

import { useState, useEffect, useRef } from "react";
import style from "@/app/styles/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faCamera,
  faXmark,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Report({ userData }) {
  const { t } = useTranslation();
  const [reportForm, setReportForm] = useState({
    title: "",
    desc: "",
  });
  const [reports, setReports] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
  };

  const handleCancelAttachment = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReportForm({
      ...reportForm,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (reportForm.title.trim().length < 4) {
      alert(t("titleAlert"));
      return;
    }
    if (reportForm.desc.trim().length < 10) {
      alert(t("descriptionAlert"));
      return;
    }

    setReports((prevReports) => [
      ...prevReports,
      {
        header: reportForm.title,
        description: reportForm.desc.trim(),
        isClosed: 0,
      },
    ]);

    let imageUrl = null;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=f739728c1d1aad2703d94f56d8af260b`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        imageUrl = data.data.display_url || data.data.url;
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    }

    try {
      const response = await fetch("/api/profile/bugReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: reportForm.title,
          desc: reportForm.desc.trim(),
          senderId: userData.userId,
          attachmentType: selectedFile?.type,
          attachmentName: selectedFile?.name,
          attachmentPath: imageUrl,
          attachmentSize: selectedFile?.size,
        }),
      });
      if (response.ok) {
        alert(t("reportSentAlert"));

        setReportForm({
          title: "",
          desc: "",
        });

        setSelectedFile(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReports = async () => {
    const response = await fetch(
      `/api/profile/getReports?userId=${userData.userId}`
    );
    if (response.ok) {
      const data = await response.json();
      setReports(data.result);
    } else {
      console.error("Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className={style.accountContainer}>
      <h1 className={style.accountTitle}>{t("bugReport")}</h1>
      <p className={style.accountDescription}>{t("bugReportDescription")}</p>

      <div className={style.accountSection}>
        <h2 className={style.accountSectionTitle}>{t("reportDetails")}</h2>
        <form onSubmit={handleSubmit}>
          <div className={style.formField}>
            <label htmlFor="title" className={style.fieldLabel}>
              {t("title")}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={reportForm.title}
              onChange={handleInputChange}
              required
              maxLength={30}
              className={style.textInput}
              placeholder={t("bugTitle")}
            />
            <div className={style.charCount}>{reportForm.title.length}/30</div>
          </div>

          <div className={style.formField}>
            <label htmlFor="desc" className={style.fieldLabel}>
              {t("description")}
            </label>
            <textarea
              id="desc"
              name="desc"
              value={reportForm.desc}
              onChange={handleInputChange}
              required
              rows={10}
              maxLength={1024}
              className={style.textInput}
              placeholder={t("bugDescription")}
            />
            <div className={style.charCount}>{reportForm.desc.length}/1024</div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <label htmlFor="desc" className={style.fieldLabel}>
            {t("attachmentDescription")}
          </label>
          <button
            type="button"
            className={style.defaultButton}
            onClick={handleUploadButtonClick}
            style={{ backgroundColor: "rgb(99, 0, 129)" }}
          >
            <FontAwesomeIcon icon={faCamera} />
          </button>

          {selectedFile && (
            <div className={style.selectedFileContainer}>
              <div className={style.selectedFileInfo}>
                {t("selected")}: {selectedFile.name}
              </div>
              <button
                type="button"
                className={style.closeButton}
                onClick={() => {
                  setSelectedFile(null);
                  handleCancelAttachment();
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}
          <div className={style.charCount}>{selectedFile ? 1 : 0}/1</div>

          <div className={style.formActions}>
            <button type="submit" className={style.defaultButton}>
              <FontAwesomeIcon icon={faSave} /> {t("submit")}
            </button>
          </div>
        </form>
      </div>

      <div className={style.accountSection}>
        <h2 className={style.accountSectionTitle}>{t("reportHistory")}</h2>
        <div className={style.reportHistory}>
          {reports.length > 0 ? (
            <>
              <div className={style.gridContainer}>
                <div className={style.gridHeader}>{t("title")}</div>
                <div className={style.gridHeader}>{t("description")}</div>
                <div className={style.gridHeader}>{t("state")}</div>
              </div>
              {reports.map((report, index) => (
                <div key={index} className={style.reportItem}>
                  <div className={style.gridContainer}>
                    <div className={style.gridCell}>{report.header}</div>
                    <div className={style.gridCell}>{report.description}</div>
                    <div className={style.gridCell}>
                      <span>
                        {report.isClosed === 0 ? t("open") : t("closed")}
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
