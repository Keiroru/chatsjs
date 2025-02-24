"use client";

import "./chat.css";
import LogoutButton from "./logout";

export default function ChatClient({ userData }) {
  function toggleRightDiv() {
    const rightDiv = document.getElementById("rightDiv");
    rightDiv?.classList.toggle("open");
  }

  function toggleLeftDiv() {}

  function showLeftDivContents() {}

  return (
    <>
      <LogoutButton />
      <div className="left" id="leftDiv">
        <div className="outer">
          <div className="inner-left">
            <i
              className="fa-solid fa-arrow-left back-arrow"
              onClick={() => {
                toggleLeftDiv();
                showLeftDivContents();
              }}
            ></i>
            <image src="https://placehold.co/50x50" alt="" className="pfp" />
            <h2>{userData.displayName}</h2>
          </div>
          <div className="inner-right">
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
            <i className="fa-solid fa-cog settings-icon"></i>
          </div>
        </div>
        <div className="search">
          <div>
            <input type="text" placeholder="Search" />
            <i className="fa-solid fa-search"></i>
          </div>
        </div>
        <div className="buttons">
          <button className="but">People</button>
          <button className="but">Groups</button>
        </div>
        <div className="people">
          <div className="person">
            <image src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="person-info">
              <h2>Name</h2>
              <p>Last message</p>
            </div>
            <p className="time">14:39</p>
          </div>
        </div>
        <div className="people">
          <div className="person">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="person-info">
              <h2>Name</h2>
              <p>Last message</p>
            </div>
            <p className="time">14:39</p>
          </div>
        </div>
      </div>

      <div className="middle" id="middleDiv">
        <div className="chat-top">
          <image
            src="https://placehold.co/50x50"
            alt=""
            className="pfp"
            onClick={toggleRightDiv}
          />
          <h1 onClick={toggleRightDiv}>Name</h1>
        </div>
        <div className="chat">
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-received">
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time">14:39</p>
            </div>
          </div>
          <div className="message-sent">
            <div className="message-info">
              <p className="uzi">
                Message Message Message Message Message Message
              </p>
              <p className="message-time-sent">14:39</p>
            </div>
            <img src="https://placehold.co/50x50" alt="" className="pfp" />
          </div>
        </div>
        <div className="bottom">
          <input type="text" placeholder="Type a message" className="uzenet" />
          <i className="fa-solid fa-paper-plane"></i>
        </div>
      </div>

      <div className="right" id="rightDiv">
        <div className="right-top">
          <i
            className="fa-solid fa-times close-icon"
            onClick={toggleRightDiv}
          ></i>
          <h1>Info</h1>
        </div>
        <div className="right-middle">
          <img src="https://placehold.co/50x50" alt="" className="pfp" />
          <h2>Name</h2>
          <p>Online</p>
        </div>
        <div className="right-bio">
          <div>
            <h2>Bio</h2>
            <p>Message Message Message Message Message Message</p>
          </div>
          <div>
            <h2>created at</h2>
            <p>2069.02.56</p>
          </div>
        </div>
        <div className="right-stuff">
          <div className="right-shared">
            <h2>Shared stuff</h2>
            <i className="fa-solid fa-arrow-right shared-icon"></i>
          </div>
          <div className="shared">
            <img
              src="https://placehold.co/100x100"
              alt=""
              className="shared-img"
            />
            <img
              src="https://placehold.co/100x100"
              alt=""
              className="shared-img"
            />
            <img
              src="https://placehold.co/100x100"
              alt=""
              className="shared-img"
            />
            <img
              src="https://placehold.co/100x100"
              alt=""
              className="shared-img"
            />
            <img
              src="https://placehold.co/100x100"
              alt=""
              className="shared-img"
            />
            <img
              src="https://placehold.co/100x100"
              alt=""
              className="shared-img"
            />
          </div>
        </div>
      </div>
    </>
  );
}
