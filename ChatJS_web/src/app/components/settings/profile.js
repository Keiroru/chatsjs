"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import style from "@/app/styles/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Profile({ userData }) {
  const [profileForm, setProfileForm] = useState({
    displayName: userData?.displayName || "",
    bio: userData?.bio || "",
    profilePicture:
      userData?.profilePicPath || "/images/user-icon-placeholder.png",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const { t } = useTranslation();

  const handleCancelAttachment = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setLocalPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewUrl);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError("");

    if (profileForm.displayName.length > 20) {
      alert("Displayname too long");
      setIsUploading(false);
      return;
    } else if (profileForm.displayName.trim().length < 4) {
      alert("Displayname too short");
      setIsUploading(false);
      return;
    }

    try {
      let imageUrl = profileForm.profilePicture;

      if (selectedFile) {
        setUploadProgress(10);

        const formData = new FormData();
        formData.append("image", selectedFile);

        setUploadProgress(30);
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=f739728c1d1aad2703d94f56d8af260b`,
          {
            method: "POST",
            body: formData,
          }
        );

        setUploadProgress(70);
        const data = await response.json();

        if (data.success) {
          imageUrl = data.data.display_url || data.data.url;
        } else {
          throw new Error(data.error?.message || "Upload failed");
        }
      }

      const formData = new FormData();
      formData.append("userId", userData?.userId);
      formData.append("displayName", profileForm.displayName);
      formData.append("bio", profileForm.bio);
      formData.append("profilePicture", imageUrl);

      setUploadProgress(85);
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setProfileForm((prev) => ({
        ...prev,
        profilePicture: imageUrl,
      }));

      setSelectedFile(null);
      setUploadProgress(100);

      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setLocalPreviewUrl(null);

      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      setUploadError(`Failed to update profile: ${error.message}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className={style.accountContainer}>
      <h1 className={style.accountTitle}>{t("editProfile")}</h1>
      <p className={style.accountDescription}>{t("profileText")}</p>

      <div className={style.accountSection}>
        <h2 className={style.accountSectionTitle}>{t("profileInformation")}</h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className={style.profileImageSection}>
            <div className={style.imageContainer}>
              <Image
                src={localPreviewUrl || profileForm.profilePicture}
                alt="Profile picture"
                width={150}
                height={150}
                className={style.profileImage}
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            <button
              type="button"
              className={style.imgButton}
              onClick={handleUploadButtonClick}
              disabled={isUploading}
            >
              <FontAwesomeIcon icon={faCamera} />
              {isUploading ? t("uploading") : t("profileImage")}
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
                    setLocalPreviewUrl(null);
                    handleCancelAttachment();
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            )}

            {uploadError && (
              <div className={style.errorText}>{uploadError}</div>
            )}

            {isUploading && (
              <div className={style.progressBar}>
                <div
                  className={style.progressFill}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className={style.userIdDisplay}>
            User ID: <span className={style.userId}>#{userData.displayId}</span>
          </div>

          <div className={style.formField}>
            <label htmlFor="displayName" className={style.fieldLabel}>
              {t("displayName")}
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={profileForm.displayName}
              onChange={handleInputChange}
              required
              maxLength={20}
              className={style.textInput}
              placeholder={t("displayName")}
            />
            <div className={style.charCount}>
              {profileForm.displayName.length}/20
            </div>
          </div>

          <div className={style.formField}>
            <label htmlFor="bio" className={style.fieldLabel}>
              {t("bio")}
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={profileForm.bio}
              onChange={handleInputChange}
              maxLength={200}
              placeholder={t("writeSomething")}
              className={style.textInput}
            ></textarea>
            <div className={style.charCount}>{profileForm.bio.length}/200</div>
          </div>

          <div className={style.formActions}>
            <button
              type="submit"
              disabled={isUploading}
              className={style.defaultButton}
            >
              <FontAwesomeIcon icon={faSave} />
              {isUploading ? t("saving") : t("saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
