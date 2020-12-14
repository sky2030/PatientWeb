import React from "react";
import Navigation from "./Nav";
//import ReactDOM from 'react-dom';
import "./dashboard/dashboard.css";
//import Spinner from "./img/Spinner.gif";
import Spinner from "./img/Spinnergrey.gif";
//import Spinner from "./img/Magnify.gif";
import addicon from "./img/department.png";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";




class Alldepartment extends React.Component {
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
    };
  }
  componentDidMount = () => {
    this.getDepartments();
    console.log("product props is", this.props.location.Hospital.post.hospitalcode)
  };

  getDepartments = () => {
    console.log("Data has been received!!");
    axios
      .get(
        `https://stage.mconnecthealth.com/v1/patient/hospitals/${this.props.location.Hospital.post.hospitalcode}/departments`,

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
        alert(Error);
      });
  };
  render() {
    if (localStorage.getItem("token") == null) {
      return <Redirect to="/Allhospital" />;
    }
    const { posts } = this.state;

    const postList = posts.length ? (
      posts.map((post) => {
        return (
          // <Link to={"/Doctorlist/" + post._id} key={post._id} className="linkdecoration" >
          <Link
            to={{
              pathname: "/Doctorlist",
              Hospital: { post },
            }}
            className='linkdecoration'
          >
            <ul>
              <li>
                <div>
                  <img
                    src={post.picture === "" ? addicon : post.picture}
                    alt="Department"
                  />
                  {post.departmentname}
                </div>
              </li>
            </ul>
          </Link>
        );
      })
    ) : (
        <div
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
        <div className="alldept">
          <div className="backarrow">
            <Link to="/Allhospital">
              <i className="fas fa-arrow-left"></i>
            </Link>{" "}
          </div>
          <h2>All Department</h2>

          {postList}

        </div>
      </div>
    );
  }
}
export default Alldepartment;
