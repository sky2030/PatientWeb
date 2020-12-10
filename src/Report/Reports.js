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
        let key_prefix = ""
        if (token == null) {
            loggedIn = false;
        }
        this.state = {
            loggedIn,
            appointment_id: "",
            Reports: [],
        };
    }
    componentDidMount = () => {
        this.GetReports();

    };

    GetReports = (appointmentid) => {
        let URL = ""
        if (appointmentid) {
            URL = `${BASE_URL}report/${appointmentid}`;
        }
        else {
            URL = `${BASE_URL}reports`;
        }
        console.log(URL);
        axios
            .get(URL,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            )
            .then((response) => {
                // console.log(response);
                if (response.data.code === 200) {
                    const data = response.data.data;
                    console.log(data);
                    this.setState({ Reports: data });
                    console.log("Data has been received!!");
                } else {
                    alert(response.data.message)
                }
            })
            .catch((Error) => {
                alert(Error);
            });
    };
    removeReport = (report_id, index) => {
        const { Reports } = this.state
        let URL = `${BASE_URL}report/${report_id}`;
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

                        let dup_list = [...Reports]
                        dup_list.splice(index, 1);
                        console.log("data after remove :", dup_list)
                        this.setState({ Reports: dup_list })
                    }
                }
                alert(results.message);
            })
            .catch((Error) => {
                alert(Error + " Something Went Wrong");
            });
    }

    render() {
        const { Reports } = this.state;



        const ReportList = Reports.length ? (
            Reports.map((post, index) => {
                let fileString = ""
                if (post.file) {
                    fileString = `${BASE}${post.file.url}`
                }
                const report = post.report_name
                const dateOfReport = moment(Number(post.report_date)).format("ll")
                return (
                    <div key={post.report_id} className="reportcard">
                        <div className="Reportbody">
                            <b>Report Type:</b> {report}
                        </div>
                        <img src={fileString} alt="Report" />
                        <div className="Reportbody">
                            <b>Date of Report: </b>{dateOfReport}
                        </div>
                        <div className="Reportbody">
                            <Link
                                to={{
                                    pathname: "/UpdateReports",
                                    ReportItem: { post },
                                }}
                            ><button><i class="far fa-edit"></i></button></Link>

                            <button onClick={() => this.removeReport(post.report_id, index)}><i class="fas fa-trash-alt"></i></button>
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
                    <Link to="/AddReports" className="btnPanel">
                        <button><i class="fas fa-plus-square"></i></button>
                        Add Report
                    </Link>

                    <div className="flex-container">{ReportList}</div>

                </div>
            </div>
        );
    }
}
export default ReportList;
