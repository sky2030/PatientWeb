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

const BASE = "https://stage.mconnecthealth.com";
const BASE_URL = `${BASE}/v1/patient/`

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
        this.GetFamilyMembers();
    };

    GetFamilyMembers = () => {
        axios
            .get(`${BASE_URL}family-members`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((response) => {
                console.log(response);
                if (response.data.code === 200) {
                    const data = response.data.data.members;
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
    removeReport = (id, index) => {
        const { posts } = this.state
        let URL = `${BASE_URL}family-members/${id}`;
        console.log(URL);
        fetch(URL, {
            method: "delete",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((results) => {
                console.log(JSON.stringify(results));
                if (results.code === 200) {
                    console.log("Index to remove :", index)
                    if (index > -1) {

                        let dup_list = [...posts]
                        dup_list.splice(index, 1);
                        console.log("data after remove :", dup_list)
                        this.setState({ posts: dup_list })
                    }
                }
                alert(results.message);
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
    }
    render() {
        const { posts } = this.state;
        const postList = posts.length ? (
            posts.map((post, index) => {
                return (
                    <div className="family-card col">
                        <h3 style={{ color: "white" }}>{post.name}</h3>
                        <div className="FamilyCard">
                            <div className="doctordetails">
                                <p>
                                    Relation: {post.relation}
                                </p>
                                <p>
                                    {post.age} {post.gender}
                                </p>
                                <p>
                                    Height: {post.height} cm
                                </p>
                                <p>
                                    Weight: {post.weight} Kg
                                </p>
                            </div>
                            <div className="doctordetails">
                                <Link
                                    to={{
                                        pathname: "/familydetail",
                                        Detail: { post },
                                    }}
                                ><button ><i class="far fa-edit"></i></button></Link>

                                <button onClick={() => this.removeReport(post.id, index)}><i class="fas fa-trash-alt"></i></button>

                            </div>
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

        if (this.state.loggedIn === false) {
            return <Redirect to="/" />;
        }
        return (
            <div className="Appcontainer">
                <Nav />
                <div className="dashboard_wrap">
                    <div className="btnPanel">
                        <Link to="/addfamily" className="btnbox" >
                            <button><i class="fas fa-plus-square"></i></button>
                        Add Member
                    </Link>
                    </div>
                    <div className="flex-container">{postList}</div>

                </div>
            </div>
        );
    }
}
export default AllHospital;
