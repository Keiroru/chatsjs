import "./this.css";

function LoginOrRegister({ children }) {
  return (
    <div className="page">
      <div className="background">
        <div className="down">
          <div className="bg-box"></div>
          <div className="bg-box egy"></div>
          <div className="bg-box ketto"></div>
          <div className="bg-box harom"></div>
        </div>
        <div className="up">
          <div className="bg-box nulla"></div>
          <div className="bg-box"></div>
          <div className="bg-box egy"></div>
          <div className="bg-box ketto"></div>
        </div>
        <div className="form">{children}</div>
      </div>
    </div>
  );
}

export default LoginOrRegister;
