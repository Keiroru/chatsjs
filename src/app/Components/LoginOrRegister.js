import "./this.css";

function LoginOrRegister({ children }) {
  return (
    <div className="page">
      <div className="background">
        <div className="form">{children}</div>
      </div>
    </div>
  );
}

export default LoginOrRegister;
