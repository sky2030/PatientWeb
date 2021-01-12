import React from "react";
// import ReactDOM from 'react-dom';
import "./dashboard/dashboard.css";
import axios from "axios";
import logo from "./img/logo.png";
import { Link, Redirect } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");

    let LoggedIn = true;
    if (token == null) {
      LoggedIn = false;
    }
    this.state = {
      hidden: true,
      mobile: "",
      password: "",
      token: "",
      LoggedIn,
      mobileError: "",
      passwordError: ""
    };
  }

  validate = () => {
    let mobileError = "";
    let passwordError = "";

    if (!this.state.mobile) {
      mobileError = "****User Name cannot be blank";
    }

    if (!this.state.password) {
      passwordError = "****password cannot be blank";
    }

    if (mobileError || passwordError) {
      this.setState({ mobileError, passwordError });
      return false;
    }

    return true;
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitForm = (e) => {
    e.preventDefault();
    const { mobile, password } = this.state;
    const isValid = this.validate();
    if (isValid) {
      const payload = {
        mobile,
        password,
      };

      axios({
        url: "https://stage.mconnecthealth.com/v1/patient/login",
        method: "POST",
        data: payload,
      })
        .then(async (response) => {
          const data = response.data.data.token;
          console.log(response);
          if (response.data.code === 200) {
            localStorage.setItem("token", data);
            await this.setState({
              token: localStorage.getItem("token"),
            });
          } else {
            alert(response.data.message)
            console.log("Something Went Wrong", e);
          }
        }
        )
        .catch((Error) => {
          console.log(JSON.stringify(Error.response.data))
          if (Error.message === "Network Error") {
            alert("Please Check your Internet Connection")
            console.log(Error.message)
            return;
          }
          if (Error.response.data.code === 401) {
            alert(Error.response.data.message)
            console.log(JSON.stringify("Error 401: " + Error.response.data.message))
          }
          if (Error.response.data.code === 422) {
            alert(Error.response.data.message + "Entered Mobile number")
            console.log(JSON.stringify("Error 422: " + Error.response.data.message))
          }
          else {
            alert("Something Went Wrong")
          }
        });
    }


  };

  toggleShow = () => {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    if (this.state.token !== "") {
      return <Redirect to="/Dashboard" />;
    }

    return (
      <section className="login">
        <img src={logo} alt="logo" />
        <h2>WELCOME TO VRCure!</h2>
        <form autocomplete="off" onSubmit={this.submitForm}>
          <div className="loginbox">
            <i className="fas fa-user"></i>
            <div>
              <input
                placeholder="Enter your Registered Mobile Number"
                type="text"
                id="mobile"
                name="mobile"
                value={this.state.mobile}
                onChange={this.onChange}
              ></input>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.mobileError}
              </div>
            </div>
          </div>
          <div className="loginbox">
            <i className="fas fa-lock"></i>

            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <input
                placeholder="Your Password"
                //type="password"
                type={this.state.hidden ? 'password' : 'text'}
                id="password"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
              ></input>
              <p onClick={this.toggleShow}>
                {this.state.hidden ? <i class="fas fa-eye-slash"></i> : <i class="fas fa-eye"></i>}
              </p>
            </div>
            <div style={{ fontSize: 12, color: "red" }}>
              {this.state.passwordError}
            </div>
            <Link to="/ForgetPassword">
              <p className="forgotpass">
                Forgot Password ?
            </p>
            </Link>
          </div>
          <div>
            {/* <input type="submit" className="button" /> */}
            <button id="submit">Login</button>
          </div>
          <Link to="/Signup">
            <div>
              {/* <input type="submit" className="button" /> */}
              <button id="submit">Signup</button>
            </div>
          </Link>
        </form>
      </section>
    );
  }
}
export default Login;
