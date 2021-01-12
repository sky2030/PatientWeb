import React from "react";
import Navigation from "./Nav";
import "./dashboard/dashboard.css";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Spinner from "./img/Spinnergrey.gif";
import Support from './img/Technical_Support-256.png'

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
      hospitals: {},
    };
  }

  componentDidMount = () => {
    this.getHospital();
  };

  getHospital = () => {
    axios
      .get("https://stage.mconnecthealth.com/v1/patient/hospitals", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.code === 200) {
          console.log(response);
          const data = response.data.data;
          this.setState({ hospitals: data });
          console.log("Data has been received!!");
        } else {
          alert(response.data.message)
        }
      })
      .catch((Error) => {
        if (Error.message === "Network Error") {
          alert("Please Check your Internet Connection")
          console.log(Error.message)
          return;
        }
        if (Error.response.data.code === 403) {
          alert(Error.response.data.message)
          console.log(JSON.stringify("Error 403: " + Error.response.data.message))
          this.setState({
            loggedIn: false
          })

        }
        else {
          alert("Something Went Wrong")
        }
      });
  };
  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    if (localStorage.getItem("token") == null) {
      return <Redirect to="/" />;
    }

    const {
      hospitals
    } = this.state;

    const postList = hospitals.length ? (
      hospitals.map((post) => {
        return (
          <div className="contact-card col">
            <h3 style={{ color: "white" }}>{post.hospitalname}</h3>
            <div className="ContactUs">
              <h4>Customer Care</h4>
              <p><i className="far fa-envelope"></i>
                {post.email}
              </p>
              <p>
                <i className="fas fa-phone-alt"></i>
                {post.phone}
              </p></div>
            <div className="ContactUs" style={{
              backgroundColor: "lightgrey",
              paddingTop: "5px"
            }}>
              <h4>Emergency Support</h4>
              <p>
                <i className="far fa-envelope"></i> {post.emergencyDetail}
              </p>
              <p>
                <i className="fas fa-phone-alt"></i>
                {post.emergencyNo}
              </p>
            </div>

          </div>
        );
      })
    ) : (
        <div
          className="center"
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "150px",
            marginBottom: "100px",
          }}
        >
          <img src={Spinner} alt="Loading" />
        </div>
      );

    return (
      <div className="Appcontainer">
        <Navigation />
        {/* <div
          className="banner-text"
        >
          <img
            src={contactImg}
            alt="Contact_img"
          />
        </div> */}
        <div className="dashboard_wrap">

          <div className="flex-container">
            {postList}
            <div className="contact-card col">
              <h3 style={{ color: "white" }}>Application Support</h3>
              <div className="ContactUs">
                <img src={Support} alt="Suport" />
                <p><i className="far fa-envelope"></i>
                vrcure@smhs.motherson.com
              </p>
                <p>
                  <i className="fas fa-phone-alt"></i>
                0120-4365125
              </p>

              </div>

            </div></div>

        </div>
      </div>
    );
  }
}
export default Myhospital;
