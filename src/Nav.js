import React from "react";
//import ReactDOM from 'react-dom';
import "./dashboard/dashboard.css";
import logo from "./img/logo.png";
import { Link } from "react-router-dom";
//import RightNav from './RightNav';
//import Burger from './Burger';

class Nav extends React.Component {

  Display = () => {
    var x = document.getElementById("myNav");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
  render() {
    return (


      <header >
        <div className="container">
          <div className="logo">
            <Link to="/Dashboard">
              {" "}
              <img src={logo} alt="logo" />
            </Link>
          </div>
          {/* <Burger /> */}
          <ul className="animated slideInDown" id="myNav">
            {/* <li>
              <Link to="/Search">
                <i className="fa fa-search"></i>Search
              </Link>
            </li> */}
            <li>
              <Link to="/Dashboard">
                <i className="fas fa-home"></i>Home
              </Link>
            </li>
            <li>
              <Link to="/Allappointment">
                <i className="far fa-calendar-check"></i>Appointments
              </Link>
            </li>
            <li>
              <Link to="/Transactions">
                <i className="fas fa-rupee-sign"></i>Transactions
              </Link>
            </li>
            <li>
              <Link to="/PatientProfile">
                <i className="fas fa-user-circle"></i>Profile
              </Link>
            </li>
            {/* <li>
              <Link to="/Reports">
                <i class="fas fa-file-medical"></i>Reports
              </Link>
            </li> */}
            <li>
              <Link to="/Contact">
                <i className="fas fa-phone-alt"></i>Contact Us
              </Link>
            </li>
            {/* <li><Link to='/Login'><i className="fas fa-user-lock"></i>Login</Link></li> */}
            <li>
              <Link to="/">
                <i className="fas fa-sign-out-alt"></i>logout
              </Link>
            </li>
          </ul>
          <div onClick={() => this.Display()} className="icon">
            <i className="fa fa-bars"></i>
          </div>
        </div>
      </header>


    );
  }
}
export default Nav;
