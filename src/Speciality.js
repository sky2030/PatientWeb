import React from "react";
import Navigation from "./Nav";
import "./dashboard/dashboard.css";
import { Link, Redirect } from "react-router-dom";
//import axios from "axios";

const initialState = {
  hospitalcode: "",
  deptcode: "",
  departmentname: "",
  description: "",
  picture: "",
  departmentnameError: "",
  descriptionError: "",
  selectedFile: null,
  submitted: false,
};

class Speciality extends React.Component {
  state = initialState;

  constructor(props) {
    super(props);
    this.state = {
      posts: {},
    };
  }

  componentDidMount() {
    console.log("product props is", this.props.location.Speciality);
    this.setState({
      posts: this.props.location.Speciality.post,
    });
  }

  render() {
    if (localStorage.getItem("token") == null) {
      return <Redirect to="/" />;
    }
    const { posts } = this.state;

    const BASE = "https://stage.mconnecthealth.com";

    return (
      <div className="Appcontainer">
        <Navigation />

        <div className="detailsdept">
          <div className="backarrow">
            {" "}
            <Link to="/HospitalSpeciality">
              <i className="fas fa-arrow-left"></i>
            </Link>
          </div>

          <h2>{posts.title}</h2>
          <div className="scrolldiv">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {posts !== undefined && posts.picture !== undefined && (
                <img
                  src={`${BASE}${posts.picture.url}`}
                  alt="Speciality"
                  style={{ width: "20vw", marginBottom: "2em" }}
                />
              )}
            </div>
            {posts.description}
          </div>
        </div>
      </div>
    );
  }
}
export default Speciality;
