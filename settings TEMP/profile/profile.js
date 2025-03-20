"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import style from "./profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSave } from "@fortawesome/free-solid-svg-icons";

export default function Profile({ userData }) {
    const [profileForm, setProfileForm] = useState({
        displayName: userData?.displayName || "",
        bio: userData?.bio || "",
        profilePicture: userData?.profilePicPath || "https://placehold.co/150x150",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef(null);
    const formRef = useRef(null);

    // Just preview the file locally without uploading
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Store the file to upload later
        setSelectedFile(file);

        // Create a local URL for preview only
        const previewUrl = URL.createObjectURL(file);
        setLocalPreviewUrl(previewUrl);
    };

    // Trigger file input click when the button is clicked
    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileForm({
            ...profileForm,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setUploadError("");

        try {
            // If there's a new file selected, upload it first
            let imageUrl = profileForm.profilePicture;

            if (selectedFile) {
                setUploadProgress(10);

                // Create FormData to upload the image
                const formData = new FormData();
                formData.append("image", selectedFile);

                // Upload to ImgBB using their API
                setUploadProgress(30);
                const response = await fetch(`https://api.imgbb.com/1/upload?key=f739728c1d1aad2703d94f56d8af260b`, {
                    method: "POST",
                    body: formData
                });

                setUploadProgress(70);
                const data = await response.json();

                if (data.success) {
                    // Get the uploaded image URL
                    imageUrl = data.data.display_url || data.data.url;
                    console.log("Image uploaded successfully:", imageUrl);
                } else {
                    throw new Error(data.error?.message || "Upload failed");
                }
            }

            // Update the profile with the new details
            const formData = new FormData();
            formData.append("userId", userData?.userId || "");
            formData.append("displayName", profileForm.displayName);
            formData.append("bio", profileForm.bio);
            formData.append("profilePicture", imageUrl); // Use the new image URL if uploaded

            // Send data to the server
            setUploadProgress(85);
            const response = await fetch("/api/modifyProfile", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            // Update the form state with the new image URL
            setProfileForm(prev => ({
                ...prev,
                profilePicture: imageUrl
            }));

            // Clean up
            setSelectedFile(null);
            setUploadProgress(100);

            // If we created a local object URL, revoke it to avoid memory leaks
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }
            setLocalPreviewUrl(null);

            // Handle successful response
            const result = await response.json();
            window.location.reload();
            alert("Profile updated successfully!");

        } catch (error) {
            console.error("Error updating profile:", error);
            setUploadError(`Failed to update profile: ${error.message}`);
        } finally {
            setIsUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    return (
        <div className={style.profileContainer}>
            <h2 className={style.sectionTitle}>Edit Profile</h2>

            <form ref={formRef} onSubmit={handleSubmit} className={style.profileForm}>
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

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />

                    {/* Visible upload button */}
                    <button
                        type="button"
                        className={style.uploadButton}
                        onClick={handleUploadButtonClick}
                        disabled={isUploading}
                    >
                        <FontAwesomeIcon icon={faCamera} />
                        {isUploading ? "Uploading..." : "Change Profile Picture"}
                    </button>

                    {selectedFile && (
                        <div className={style.selectedFileInfo}>
                            Selected: {selectedFile.name}
                        </div>
                    )}

                    {uploadError && <div className={style.errorText}>{uploadError}</div>}

                    {isUploading && (
                        <div className={style.progressBar}>
                            <div
                                className={style.progressFill}
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}
                </div>

                <div className={style.formField}>
                    <label htmlFor="displayName" className={style.fieldLabel}>Display Name</label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={profileForm.displayName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                        className={style.textInput}
                    />
                </div>

                <div className={style.formField}>
                    <label htmlFor="bio" className={style.fieldLabel}>Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileForm.bio}
                        onChange={handleInputChange}
                        maxLength={200}
                        placeholder="Write something about yourself"
                        className={style.textArea}
                    ></textarea>
                    <div className={style.charCount}>{profileForm.bio.length}/200</div>
                </div>

                <div className={style.formActions}>
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={style.saveButton}
                    >
                        <FontAwesomeIcon icon={faSave} />
                        {isUploading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};