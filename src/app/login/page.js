import LoginOrRegister from "../Components/LoginOrRegister";
import "../Components/this.css";

function Login() {
  return (
    <>
      <LoginOrRegister>
        <h1>Login</h1>
        <form>
          <div className="inputContainer">
            <i className="fa fa-user"></i>
            <input type="text" id="username" placeholder="Username" required />
          </div>
          <div className="inputContainer">
            <i className="fa fa-lock"></i>
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          dont have an account? <a href="/register">Register Here</a>
        </p>
      </LoginOrRegister>
    </>
  );
}

export default Login;
