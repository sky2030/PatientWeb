import React from "react";
//import ReactDOM from 'react-dom';
import "./dashboard.css";
//import bgimg from "./img/bgimg.jpg";
import bgimg from "./img/dashboard.jpg";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Navigation from "../Nav";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");

    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }
    this.state = {
      loggedIn,
    };
  }
  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    if (localStorage.getItem("token") == null) {
      return <Redirect to="/" />;
    }

    return (
      <div className="Appcontainer">
        <Navigation />
        <div className="dashboard_wrap">
          <div className="dashboard_maincontent">
            <img src={bgimg} alt="doctor-img" />
            <div className="dashboard_icons">
              <ul>
                <li>
                  <Link to="/Allhospital">
                    <i className="fas fa-plus-square"></i>Book Appointment
                  </Link>
                </li>
                <li>
                  <Link to="/Allappointment">
                    <i class="far fa-calendar-check"></i>Upcoming Appointment
                  </Link>
                </li>
                <li>
                  <Link to="/Reports">
                    <i class="fas fa-file-medical"></i>Reports
                  </Link>
                </li>
                <li>
                  <Link to="/PrescriptionHistory">
                    <i class="fas fa-file-signature"></i>Prescriptions
                  </Link>
                </li>
                <li>
                  <Link to="/PatientProfile">
                    <i class="fas fa-user-circle"></i>My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/Transactions">
                    <i className="fas fa-credit-card"></i>Transaction
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
