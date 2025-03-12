"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";

export default function ContactsList({ userId, onContactSelect, activeChat }) {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState('people');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchContacts() {
            try {
                const response = await fetch(`/api/getContacts?userId=${userId}`);
                if (!response.ok) throw new Error('Failed to fetch contacts');
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            } finally {
                setIsLoading(false);
            }
        }

        if (userId) {
            fetchContacts();
        }
    }, [userId]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredContacts(contacts);
        } else {
            const filtered = contacts.filter(contact =>
                contact.displayName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredContacts(filtered);
        }
    }, [searchQuery, contacts]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <>
            <div className="search-container">
                <div className="search-input">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearch}
                        aria-label="Search contacts"
                    />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
            </div>

            <div className="tab-buttons">
                <button
                    className={`tab-button ${activeTab === 'people' ? 'active' : ''}`}
                    onClick={() => setActiveTab('people')}
                >
                    People
                </button>
                <button
                    className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`}
                    onClick={() => setActiveTab('groups')}
                >
                    Groups
                </button>
            </div>

            <div className="contacts-list">
                {isLoading ? (
                    <div className="loading-spinner">Loading contacts...</div>
                ) : filteredContacts.length > 0 ? (
                    filteredContacts.map(contact => (
                        <button
                            key={contact.userId}
                            className={`contact-item ${activeChat?.id === contact.userId ? 'active' : ''}`}
                            onClick={() => onContactSelect(contact)}
                        >
                            <Image
                                src={contact.avatar || "https://placehold.co/50x50"}
                                alt="Contact avatar"
                                width={40}
                                height={40}
                                className="avatar"
                            />
                            <div className="contact-info">
                                <h3 className="contact-name">{contact.displayName}</h3>
                                <p className="last-message">{contact.lastMessage}</p>
                            </div>
                            <span className="time">{contact.lastMessageTime}</span>
                            <span className={`status-indicator ${contact.online ? 'online' : 'offline'}`}></span>
                        </button>
                    ))
                ) : (
                    <div className="no-contacts">No contacts</div>
                )}
            </div>
        </>
    );
}