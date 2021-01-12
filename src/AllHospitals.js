import React, { Component } from "react";
//import ReactDOM from 'react-dom';
import "./dashboard/dashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Nav from "./Nav";
//import Spinner from "./img/Spinner.gif";
import Spinner from "./img/Spinnergrey.gif";
//import Spinner from "./img/Magnify.gif";

class AllHospital extends Component {
    //const Allhospitals = (props) => {
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
                console.log(response);
                if (response.data.code === 200) {
                    const data = response.data.data;
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
        const { posts } = this.state;
        const postList = posts.length ? (
            posts.map((post) => {
                return (
                    <Link
                        to={{
                            pathname: "/Alldepartment",
                            Hospital: { post },
                        }}
                        className="doctor-card2 col"
                    >
                        <h3 style={{ color: "white" }}>{post.hospitalname}</h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div className="doctorpic">
                                <img
                                    src={post.picture} alt="Hospital" />
                            </div>
                            <div className="doctordetails">

                                <p>
                                    {post.place}
                                </p>
                                <p>
                                    {post.landmark} {post.district}
                                </p>

                                <p>
                                    {" "}
                                    {post.state} {post.pincode}{" "}
                                </p>
                            </div>
                        </div>
                    </Link>
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

        if (this.state.loggedIn === false) {
            return <Redirect to="/" />;
        }
        return (
            <div className="Appcontainer">
                <Nav />
                <div className="dashboard_wrap">
                    <div className="flex-container">{postList}</div>

                </div>
            </div>
        );
    }
}
export default AllHospital;
