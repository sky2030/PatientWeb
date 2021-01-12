import React from "react";
import Navigation from "./Nav";
import "./dashboard/dashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router-dom";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE = "https://stage.mconnecthealth.com";
const BASE_URL = `${BASE}/v1/patient/`

class AddFamilyMember extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");

        let loggedIn = true;
        if (token == null) {
            loggedIn = false;
        }

        this.state = {
            loggedIn,
            name: '',
            relation: '',
            birth_millis: undefined,
            height: '',
            weight: '',
            gender: '',
            nameError: '',


        };
    }
    // componentDidMount = () => {

    // };



    validate = () => {
        let nameError = "";

        if (!this.state.name) {
            nameError = "****Name Field Cannot be Empty";
        }

        if (nameError) {
            this.setState({
                nameError,
            });
            return false;
        }

        return true;
    };

    // SubmitFamilyMember = (event) => {
    //     event.preventDefault();
    //     const {
    //         name,
    //         relation,
    //         height,
    //         weight,
    //         gender,
    //         birth_millis
    //     } = this.state;

    //     const isValid = this.validate();
    //     if (isValid) {

    //         const payload = {
    //             name,
    //             relation,
    //             height,
    //             weight,
    //             gender,
    //             birth_millis: moment(birth_millis).format("x")
    //         }
    //         let method = "POST"
    //         let url = `${BASE_URL}family-members/add`
    //         axios({
    //             url: url,
    //             method: method,
    //             data: payload,
    //             headers: {
    //                 Authorization: localStorage.getItem("token"),
    //             },
    //         })
    //             .then((response) => {
    //                 if (response.code === 200) {
    //                     alert(response.message);
    //                     console.log("Data has been sent to the server successfully");
    //                 } else {
    //                     console.log(response.message);
    //                 }
    //                 //this.resetUserInputs();
    //                 this.setState({
    //                     submitted: true,
    //                 });
    //             })
    //             .catch((Error) => {
    //                 if (Error.message === "Network Error") {
    //                     alert("Please Check your Internet Connection")
    //                     console.log(Error.message)
    //                     return;
    //                 }
    //                 if (Error.response.data.code === 403) {
    //                     alert(Error.response.data.message)
    //                     console.log(JSON.stringify("Error 403: " + Error.response.data.message))
    //                     this.setState({
    //                         loggedIn: false
    //                     })

    //                 }
    //                 else {
    //                     alert("Something Went Wrong")
    //                 }
    //             });
    //     }
    // };



    // handleChange = ({ target }) => {
    //     const { name, value } = target;
    //     this.setState({ [name]: value });
    // };



    // handleDatePicker = (date) => {
    //     console.log(date);
    //     this.setState({
    //         birth_millis: date
    //     });
    // };

    // handleGender = (e) => {
    //     this.setState({
    //         gender: e.target.value
    //     })
    // }
    // handleHeight = (e) => {
    //     this.setState({
    //         height: e.target.value,
    //     });
    // };

    // handleWeight = (e) => {
    //     this.setState({
    //         weight: e.target.value,
    //     });
    // };

    // handleRelation = (e) => {
    //     this.setState({
    //         relation: e.target.value,
    //     });
    // };



    // resetUserInputs = () => {
    //     this.setState({

    //     });
    // };
    render() {
        const {
            name,
            height,
            weight,
            nameError
        } = this.state;

        if (this.state.loggedIn === false) {
            return <Redirect to="/" />;
        }
        if (this.state.submitted) {
            return <Redirect to="/Search" />;
        }
        return (
            <div className="Appcontainer">
                <Navigation />

                <div className="dashboard_wrap">

                    <div className="adddept">
                        <div className="backarrow">
                            {" "}
                            <Link to="/Dashboard">
                                <i className="fas fa-arrow-left"></i>
                            </Link>
                        </div>
                        <h2>Search Doctor</h2>

                        <form action="confirm" onSubmit={this.SubmitFamilyMember}>

                            <div className="row">

                                <input
                                    type="text"
                                    name="name"
                                    //value={name}
                                    placeholder="Enter Location"
                                //onChange={this.handleChange}
                                />
                                <div style={{ color: 'red', fontSize: "12px" }}> {nameError}</div>

                                <input
                                    type="text"
                                    name="name"
                                    //value={name}
                                    placeholder="Enter Specialities"
                                //onChange={this.handleChange}
                                />
                                <div style={{ color: 'red', fontSize: "12px" }}> {nameError}</div>

                                <input
                                    type="text"
                                    name="name"
                                    //value={name}
                                    placeholder="Enter Symtoms"
                                //onChange={this.handleChange}
                                />
                                <div style={{ color: 'red', fontSize: "12px" }}> {nameError}</div>


                            </div>


                            <div className="btncontainer">
                                <button type="submit" className="Updatebtn">
                                    <i className="fa fa-search"></i>
                                           Search
                                     </button>
                                <Link to="/Dashboard">
                                    <button type="submit" className="Updatebtn">
                                        {/* <i className="fa fa-search"></i> */}
                                           Cancel
                                     </button>
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default AddFamilyMember;
