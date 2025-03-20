"use client";

export default function MyAccount({ userData }) {
  return (
    <div>
      <h1>My Account</h1>
      <p>
        Welcome to your account settings page. Here you can update your account
        information.
      </p>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData?.email}
            disabled
          />
        </div>
        <div>
          <h4>Change Password</h4>
          <input type="password" />
          <input type="password" />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
