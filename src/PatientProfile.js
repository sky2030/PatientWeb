import React from "react";
import "./dashboard/dashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Navigation from "./Nav";
import moment from "moment-timezone";

class Myhospital extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");

    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }
    this.state = {
      loggedIn,
      patients: {},
    };
  }
  componentDidMount = () => {
    this.getPatient();
  };

  getPatient = () => {
    axios
      .get("https://stage.mconnecthealth.com/v1/patient", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          const data = response.data.data;
          this.setState({ patients: data });
          console.log("Data has been received!!");
        } else {
          alert(response.data.message)
        }
      })
      .catch((Error) => {
        alert(Error);
      });
  };

  render() {
    const { patients } = this.state;

    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    return (
      <div className="Appcontainer">
        <Navigation />
        <div className="dashboard_wrap2">

          <div className="banner-text">
            <img
              src={patients.picture}
              alt="patients image"
            />
          </div>
          <div className="flex-container scroll">
            <div className="col5 box-shad">
              <h3>{patients.patient_name}</h3>
              <p>
                <i className="far fa-envelope"></i> {patients.email}
              </p>
              <p>
                <i className="fas fa-phone-alt"></i> {patients.mobile}
              </p>
              <p>
                <i class="fas fa-birthday-cake"></i> {moment(patients.birthday_millis).format('ll')}
              </p>

              <p>
                <b>Mother:</b> {patients.mothers_name}
              </p>
              <p>
                <b>Height:</b> {patients.height} cm
              </p>
              <p>
                <b>Weight:</b> {patients.weight} Kg
              </p>
            </div>
            <div className="col5 box-shad">
              <h3>
                <i className="fas fa-map-marker-alt"></i>Address
                </h3>
              <p>
                <b>Place:</b> {patients.place}
              </p>
              <p>
                <b>City:</b> {patients.city}
              </p>

              <p>
                <b>State:</b> {patients.state} <b>Pin Code:</b>{" "}
                {patients.pincode}
              </p>
            </div>

          </div>

        </div>
        <div className='profileflex'>
          <div className="add_departmet">
            <Link to="/UpdateProfile">
              <i className="far fa-edit"></i> Edit Profile{" "}
            </Link>

            <Link to="/family">
              <i className="far fa-edit"></i> My Family{" "}
            </Link>
          </div>

        </div>
      </div>
    );
  }
}
export default Myhospital;
