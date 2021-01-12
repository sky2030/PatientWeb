import React from "react";
import Navigation from "./Nav";
import "./dashboard/dashboard.css";
import { Link, Redirect } from "react-router-dom";
import docicon from "./img/doctor-icon.jpg";
import axios from "axios";
import Spinner from "./img/Spinnergrey.gif";

class Doctorlist extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");

    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }
    this.state = {
      loggedIn,
      posts: [],
      post: {}
    };
  }
  componentDidMount = () => {
    console.log("product props is", this.props.location.Hospital.post.deptcode)
    this.getDoctors();
    this.setState({
      post: this.props.location.Hospital.post
    })
  };

  getDoctors = () => {
    console.log("Data has been received!!");
    axios
      .get(
        `https://stage.mconnecthealth.com/v1/patient/hospitals/departments/${this.props.location.Hospital.post.deptcode}/doctors`,

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          const data = response.data.data;
          console.log(response);
          this.setState({ posts: data });
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
    const { posts, post } = this.state;

    const postList = posts.length ? (
      posts.map((post) => {
        return (
          <Link
            to={{
              pathname: "/DoctorBookingSLot",
              Doctor: { post },
            }}
            key={post._id} className="doctor-card col">

            <h3 style={{ color: "white" }}>
              Dr. {post.first_name} {post.last_name}
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'row'
            }}>
              <div className="doctorpic">
                <img
                  src={post.picture === "" ? docicon : post.picture}
                  alt="doctors"
                />
                <p
                  style={{
                    color: 'rgb(6, 105, 185)',
                    fontSize: '12px'
                  }}>
                  {" "}
                  <i className="fas fa-star"></i>{" "}
                  <i className="fas fa-star"></i>{" "}
                  <i className="fas fa-star"></i>{" "}
                  <i className="fas fa-star"></i>{" "}
                </p>
              </div>
              <div className="doctordetails">
                <p>
                  <b>{post.department}</b> | {post.experience} EXP.
                </p>
                {/* <p>
                  {" "}
                  <i className="fas fa-star"></i>{" "}
                  <i className="fas fa-star"></i>{" "}
                  <i className="fas fa-star"></i>{" "}
                  <i className="fas fa-star"></i>{" "}
                </p> */}
                <p>Rs. : {post.consultation}</p>
                <p>{post.degree}</p>
                <p>{post.hospitalName}</p>
                <p>{post.designation}</p>
                <p>{post.email}</p>
              </div>
            </div>
            <Link to={{
              pathname: "/BookingSlot",
              // Data: { item },
            }}>
              <button

                className='appointmentbutton'
              >
                <b>Book Appointment</b>
              </button>
            </Link>
          </Link>
        );
      })
    ) : (
        <div
          className="center"
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <img src={Spinner} alt="Loading" />
        </div>
      );

    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    return (
      <div className="Appcontainer">
        <Navigation />
        <div className="dashboard_wrap">
          <div className="flex-head">
            <Link
              to={{
                pathname: "/Alldepartment",
                Hospital: { post },
              }}
              className="backbtn">
              {/* <i className="fas fa-arrow-left"></i> */}
            Back
        </Link>
          </div>

          <div className="flex-container">

            {postList}
          </div>

        </div>
      </div>
    );
  }
}
export default Doctorlist;
