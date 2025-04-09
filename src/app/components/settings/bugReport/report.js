"use client";

import { useState, useEffect } from "react";
import style from "@/app/styles/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export default function Report({ userData }) {
  const [reportForm, setReportForm] = useState({
    title: "",
    desc: "",
  });
  const [reports, setReports] = useState([]);

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
      alert("Title is to short");
      return;
    }
    if (reportForm.desc.trim().length < 10) {
      alert("Description is too short");
      return;
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
        }),
      });
      if (response.ok) {
        setReportForm({
          title: "",
          desc: "",
        });
        alert("Report submitted successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReports = async () => {
    const response = await fetch(`/api/profile/getReports?userId=${userData.userId}`);
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
      <h1 className={style.accountTitle}>Bug Reports</h1>
      <p className={style.accountDescription}>
        Submit a bug report to help us improve the application. Please provide as much detail as possible.
      </p>

      <div className={style.accountSection}>
        <h2 className={style.accountSectionTitle}>Report Details</h2>
        <form onSubmit={handleSubmit}>
          <div className={style.formField}>
            <label htmlFor="title" className={style.fieldLabel}>
              Title
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
              placeholder="Brief description of the issue"
            />
            <div className={style.charCount}>{reportForm.title.length}/30</div>
          </div>

          <div className={style.formField}>
            <label htmlFor="desc" className={style.fieldLabel}>
              Description
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
              placeholder="Detailed description of the bug, including steps to reproduce"
            />
            <div className={style.charCount}>{reportForm.desc.length}/1024</div>
          </div>

          <div className={style.formActions}>
            <button type="submit" className={style.defaultButton}>
              <FontAwesomeIcon icon={faSave} /> Submit Report
            </button>
          </div>
        </form>
      </div>

      <div className={style.accountSection}>
        <h2 className={style.accountSectionTitle}>Report History</h2>
        <div className={style.reportHistory}>
          {reports.length > 0 ? (
            <>
              <div className={style.gridContainer}>
                <div className={style.gridHeader}>Title</div>
                <div className={style.gridHeader}>Description</div>
                <div className={style.gridHeader}>State</div>
              </div>
              {reports.map((report, index) => (
                <div key={index} className={style.reportItem}>
                  <div className={style.gridContainer}>
                    <div className={style.gridCell}>{report.header}</div>
                    <div className={style.gridCell}>{report.description}</div>
                    <div className={style.gridCell}>
                      <span>
                        {report.isClosed === 0 ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={style.noReports}>No reports found</div>
          )}
        </div>
      </div>
    </div>
  );
}
