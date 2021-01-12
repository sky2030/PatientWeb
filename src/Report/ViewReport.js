import React from "react";
import Navigation from "../Nav";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import Spinner from "../img/Spinnergrey.gif";


const BASE = "https://stage.mconnecthealth.com";
const BASE_URL = `${BASE}/v1/patient/`


class ReportList extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");

        let loggedIn = true;

        if (token == null) {
            loggedIn = false;
        }
        this.state = {
            loggedIn,
            Report: ""
        };
    }
    componentDidMount = () => {
        if (this.props.location.Image) {
            this.setState({
                Report: this.props.location.Image.fileString
            })
        }


    };



    render() {
        const { Report } = this.state;

        if (this.state.loggedIn === false) {
            return <Redirect to="/" />;
        }
        return (
            <div className="Appcontainer">
                <Navigation />
                <div className="dashboard_wrap">
                    <div className="btnPanel">
                        <Link to="/Reports" className="btnbox">
                            <button><i class="fas fa-arrow-circle-left"></i></button>

                        </Link>
                    </div>

                    <div className="flex-container">
                        <div className="ReportView">
                            <img src={Report} alt="Report" />
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}
export default ReportList;
