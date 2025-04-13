import styles from "@/app/styles/input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { forwardRef, useState, useEffect, useRef } from "react";
import { useSocket } from "@/lib/socket";
import { useTranslation } from "@/contexts/TranslationContext";
import Image from "next/image";

const Input = forwardRef(
  (
    {
      activeChat,
      userData,
      conversationId,
      replyTo,
      setreplyTo,
      editMessage,
      setEditMessage,
      setMessages,
      formatMessageTime,
      setFriends,
      attachment,
      setAttachment,
    },
    ref
  ) => {
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const socket = useSocket();
    const { t } = useTranslation();

    const handleUploadButtonClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setAttachment(file);

      const previewUrl = URL.createObjectURL(file);
      setLocalPreviewUrl(previewUrl);
      setEditMessage(null);
      setreplyTo(null);
    };

    const handleCancelAttachment = () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setLocalPreviewUrl(null);
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    };

    const formatFileSize = (bytes) => {
      if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
      } else {
        return (bytes / 1024).toFixed(1) + " KB";
      }
    };

    useEffect(() => {
      if (replyTo && ref?.current) {
        ref.current.focus();
      }
    }, [replyTo, ref]);

    const handleSendMessage = async () => {
      if ((!messageInput.trim() && !attachment) || !conversationId) return;
      setLoading(true);

      if (messageInput.length > 20000) {
        alert(t("messageTooLong") + messageInput.length);
        setLoading(false);
        return;
      }

      if (editMessage) {
        try {
          const response = await fetch("/api/messages/editMessage", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messageId: editMessage.messageId,
              newMessage: messageInput,
            }),
          });

          if (response.ok) {
            setMessageInput("");
            setEditMessage(null);
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.messageId === editMessage.messageId
                  ? { ...msg, messageText: messageInput, isEdited: 1 }
                  : msg
              )
            );
            socket.emit("edit_message", {
              messageId: editMessage.messageId,
              newMessage: messageInput,
              conversationId: conversationId,
            });
            setTimeout(() => {
              if (ref.current) {
                ref.current.focus();
              }
            }, 1);
            setLoading(false);
          }
          return;
        } catch (error) {
          console.error("Error editing message:", error);
          setLoading(false);
        }
      }

      let imageUrl = null;
      try {
        setFriends((prevFriends) =>
          prevFriends.map((friend) =>
            friend.userId === activeChat.userId
              ? { ...friend, lastMessage: messageInput.trim() }
              : friend
          )
        );

        if (attachment) {
          const formData = new FormData();
          formData.append("image", attachment);

          const response = await fetch(
            `https://api.imgbb.com/1/upload?key=f739728c1d1aad2703d94f56d8af260b`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          if (data.success) {
            imageUrl = data.data.display_url;
          } else {
            throw new Error(data.error?.message || "Upload failed");
          }
        }

        const response = await fetch("/api/messages/postMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversationId,
            senderUserId: userData.userId,
            messageText: messageInput.trim(),
            attachmentType: attachment?.type,
            attachmentName: attachment?.name,
            attachmentPath: imageUrl,
            attachmentSize: attachment?.size,
            replyTo: replyTo ? replyTo.messageId : null,
          }),
        });

        var res = await response.json();

        const messageData = {
          conversationId: conversationId,
          messageId: res.data.messageId,
          senderUserId: userData.userId,
          messageText: messageInput.trim(),
          filePath: res.data.filePath,
          fileName: res.data.fileName,
          fileSize: res.data.fileSize,
          senderName: userData.displayName,
          senderProfilePic: userData.profilePicPath,
          sentAt: new Date().toISOString(),
          replyTo: replyTo ? replyTo.messageId : null,
          isDeleted: res.data.isDeleted,
          isEdited: res.data.isEdited,
          receiver: res.receiver,
          state: "sent",
        };

        if (response.ok) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...messageData,
              sentAt: formatMessageTime(messageData.sentAt),
            },
          ]);

          setMessageInput("");
          setreplyTo(null);
          handleCancelAttachment();
          socket.emit("send_message", messageData);

          setTimeout(() => {
            if (ref.current) {
              ref.current.focus();
            }
          }, 1);
        } else {
          console.error("Failed to send message via API");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey && messageInput.trim()) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    useEffect(() => {
      const preventDefault = (e) => {
        e.preventDefault();
      };

      document.addEventListener("dragover", preventDefault);
      document.addEventListener("drop", preventDefault);

      return () => {
        document.removeEventListener("dragover", preventDefault);
        document.removeEventListener("drop", preventDefault);
      };
    }, []);

    useEffect(() => {
      const inputEl = ref?.current;
      if (!inputEl) return;

      const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (const item of items) {
          if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile();
            setAttachment(file);

            const previewUrl = URL.createObjectURL(file);
            setLocalPreviewUrl(previewUrl);
            setEditMessage(null);
            setreplyTo(null);
            break;
          }
        }
      };

      inputEl.addEventListener("paste", handlePaste);
      return () => inputEl.removeEventListener("paste", handlePaste);
    }, [ref]);

    useEffect(() => {
      const container = document.getElementById("drop-zone");
      if (!container) return;

      const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
      };

      const handleDragLeave = (e) => {
        if (!container.contains(e.relatedTarget)) {
          setIsDragging(false);
        }
      };

      const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            setAttachment(file);
            const previewUrl = URL.createObjectURL(file);
            setLocalPreviewUrl(previewUrl);
            setEditMessage(null);
            setreplyTo(null);
          }
        }
      };

      container.addEventListener("dragover", handleDragOver);
      container.addEventListener("dragleave", handleDragLeave);
      container.addEventListener("drop", handleDrop);

      return () => {
        container.removeEventListener("dragover", handleDragOver);
        container.removeEventListener("dragleave", handleDragLeave);
        container.removeEventListener("drop", handleDrop);
      };
    }, []);

    return (
      <>
        {replyTo && (
          <div className={styles.replyPreview}>
            <div className={styles.replyContent}>
              <p className={styles.replyTo}>
                {replyTo.messageText.length > 0 ? (
                  <>
                    {t("replyPreview")} {replyTo.messageText.substring(0, 50)}
                    {replyTo.messageText.length > 50 ? "..." : ""}
                  </>
                ) : (
                  <>
                    {t("replyPreview")} {replyTo.fileName.substring(0, 50)}
                    {replyTo.fileName.length > 50 ? "..." : ""}
                  </>
                )}
              </p>

              <button
                className={styles.cancelReply}
                onClick={() => setreplyTo(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        )}

        {attachment && (
          <div className={styles.attachmentPreview}>
            <div className={styles.attachmentContent}>
              <Image
                src={localPreviewUrl}
                alt="attachment"
                width={150}
                height={150}
                className={styles.attachmentImage}
              />
              <div className={styles.attachmentInfo}>
                {attachment.name}
                {", "}
                {attachment.type.startsWith("image/")
                  ? "Image"
                  : attachment.type}{" "}
                - {formatFileSize(attachment.size)}
              </div>
              <button
                className={styles.cancelReply}
                onClick={() => handleCancelAttachment()}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        )}

        {editMessage && (
          <div className={styles.replyPreview}>
            <div className={styles.replyContent}>
              <p className={styles.replyTo}>
                {editMessage.messageText.length > 0 ? (
                  <>
                    {t("editingMessage")}{" "}
                    {editMessage.messageText.substring(0, 50)}
                    {editMessage.messageText.length > 50 ? "..." : ""}
                  </>
                ) : (
                  <>
                    {t("editingMessage")}{" "}
                    {editMessage.fileName.substring(0, 50)}
                    {editMessage.fileName.length > 50 ? "..." : ""}
                  </>
                )}
              </p>

              <button
                className={styles.cancelReply}
                onClick={() => setEditMessage(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        )}
        <div id="drop-zone" className={styles["message-input-container"]}>
          {isDragging && (
            <div className={styles.dragOverlay}>
              <FontAwesomeIcon icon={faPlus} className={styles.plusIcon} />
            </div>
          )}
          <div className={styles["input-row"]}>
            <input
              type="text"
              ref={ref}
              placeholder={t("typeMessage")}
              className={styles["message-input"]}
              aria-label="Type a message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!activeChat || loading}
              autoComplete="off"
              id="message-input"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className={styles.fileInputRef}
            />
            <button
              type="button"
              className={styles.attachmentButton}
              aria-label="Upload attachment"
              onClick={handleUploadButtonClick}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className={styles["send-button"]}
              aria-label="Send message"
              disabled={(!messageInput.trim() && !attachment) || loading}
              onClick={handleSendMessage}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
