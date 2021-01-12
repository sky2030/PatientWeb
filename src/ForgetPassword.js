import React from "react";
// import ReactDOM from 'react-dom';
import "./dashboard/dashboard.css";
import axios from "axios";
import logo from "./img/logo.png";
import { Link, Redirect } from "react-router-dom";

class ForgetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            emailError: "",
            submitted: false
        };
    }

    validate = () => {
        let emailError = "";

        if (!this.state.email) {
            emailError = "****Email Address cannot be blank";
        }

        if (emailError) {
            this.setState({ emailError });
            return false;
        }

        return true;
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    submitForm = (e) => {
        e.preventDefault();
        const { email } = this.state;
        const isValid = this.validate();
        if (isValid) {
            const payload = {
                email
            };
            axios({
                url: "https://stage.mconnecthealth.com/v1/patient/forget-password",
                method: "POST",
                data: payload,
            })
                .then(async (response) => {
                    const data = response.data;
                    console.log(response);
                    if (response.data.code === 200) {
                        alert(data.message)
                        this.setState({
                            submitted: true
                        })
                    } else {
                        alert(data.message)
                        console.log("Something Went Wrong", e);
                    }
                }
                )
                .catch((Error) => {
                    alert(Error + " Server Not Responding")
                    console.log("internal server error");
                });
        }

        // this.setState({
        //     token: localStorage.getItem("token")
        // })

        // if (this.state.token === '') {
        //     return null
        // }
        // else {
        //     this.setState({
        //         LoggedIn: true
        //     })
        // }
        // if (email === "8882973229" && password === "shiv") {
        //     localStorage.setItem("token", "aaaefdgadftaerd")
        //     this.setState({
        //         LoggedIn: true
        //     })
        // }
    };
    render() {
        if (this.state.submitted) {
            return <Redirect to="/login" />;
        }
        return (
            <section className="login">
                <img src={logo} alt="logo" />
                <h2>Welcome to VRCure!</h2>
                <form autocomplete="off" onSubmit={this.submitForm}>
                    <div className="loginbox">
                        <i className="fas fa-lock"></i>
                        <div>
                            <div style={{ fontSize: 12, color: "red" }}>
                                {this.state.emailError}
                            </div>
                            <input
                                placeholder="Enter the Email Address"
                                type="text"
                                id="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.onChange}
                            ></input>
                        </div>
                        <div style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row'
                        }}>

                            <div>
                                {/* <input type="submit" className="button" /> */}
                                <button type="submit" >Submit</button>
                            </div>
                            <div>
                                <Link to="/Login">
                                    {/* <input type="submit" className="button" /> */}
                                    <button type="reset" className='cancelbtn' >Cancel</button>
                                </Link>
                            </div>

                        </div>

                    </div>

                </form>
            </section>
        );
    }
}
export default ForgetPassword;
