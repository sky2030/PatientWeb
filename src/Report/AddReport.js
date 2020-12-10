import React from "react";
import Navigation from "../Nav";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router-dom";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE = "https://stage.mconnecthealth.com";
const BASE_URL = `${BASE}/v1/patient/`

class AddReport extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");

        let loggedIn = true;
        if (token == null) {
            loggedIn = false;
        }
        this.state = {
            loggedIn,
            appointment_id: "",
            report_name: "",
            picture: '',
            reportDate: new Date(),
            reportItem: undefined,
            reportError: "",
            DateError: ""


        };
    }
    componentDidMount = () => {



    };



    validate = () => {
        let reportError = "";
        let DateError = "";

        if (!this.state.report_name) {
            reportError = "****Report Field Cannot be Empty";
        }
        if (!this.state.reportDate) {
            DateError = "****Report Date Cannot be Empty";
        }

        if (reportError || DateError) {
            this.setState({
                reportError,
                DateError
            });
            return false;
        }

        return true;
    };

    SubmitReport = (event) => {
        event.preventDefault();
        const {
            appointment_id,
            report_name,
            picture,
            reportDate,
            reportItem
        } = this.state;

        const isValid = this.validate();
        if (isValid) {
            if (picture.length <= 0) {
                alert("Please add report picture and then try again.");
                return;
            }
            console.log("Picture :", picture);
            console.log("Report Name :", report_name);
            console.log("Report Date :", moment(reportDate).format("x"));

            const payload = new FormData();
            payload.append("report_name", report_name);
            payload.append("report", picture);
            payload.append("report_date", moment(reportDate).format("x"));

            if (appointment_id && appointment_id.length > 0) {
                payload.append("appointment_id", appointment_id);
            }
            let method = "POST"
            let url = `${BASE_URL}report`
            if (reportItem) {
                method = "PUT"
                url = `${url}/${reportItem.report_id}`
            }

            console.log("Data :", JSON.stringify(payload));
            axios({
                url: url,
                method: method,
                data: payload,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: localStorage.getItem("token"),
                },
            })
                .then((response) => {
                    if (response.code === 200) {
                        alert(response.message);
                        console.log("Data has been sent to the server successfully");
                    } else {
                        console.log(response.message);
                    }
                    //this.resetUserInputs();
                    this.setState({
                        submitted: true,
                    });
                })
                .catch((error) => {
                    alert(error)
                    console.log("internal server error");
                });
        }
    };



    handleChange = ({ target }) => {
        const { name, value } = target;
        this.setState({ [name]: value });
    };

    onFileHandler = async (event) => {
        await this.setState({
            picture: event.target.files[0],
            loaded: 0,
        });
        console.log(this.state.picture);
    };


    onChangeHandler = (event) => {
        console.log("file to upload:", event.target.files[0]);

        this.getBase64(event.target.files[0], (result) => {
            this.setState({
                picture: result,
            });
            console.log(result);
        });


    };

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result);
        };
        reader.onerror = function (error) {
            console.log("Error: ", error);
        };
    }



    _handleReaderLoaded = (readerEvt) => {
        let binaryString = readerEvt.target.result;
        this.setState({
            picture: btoa(binaryString),
        });
    };

    handleDatePicker = (date) => {
        console.log(date);
        this.setState({
            reportDate: date
        });
    };


    resetUserInputs = () => {
        this.setState({

        });
    };
    render() {
        const {
            report_name,
            reportError,
            DateError
        } = this.state;

        if (this.state.submitted) {
            return <Redirect to="/Reports" />;
        }
        return (
            <div className="Appcontainer">
                <Navigation />

                <div className="dashboard_wrap">

                    <div className="adddept">
                        <div className="backarrow">
                            {" "}
                            <Link to="/Reports">
                                <i className="fas fa-arrow-left"></i>
                            </Link>
                        </div>
                        <h2>Add Reports</h2>

                        <form action="confirm" onSubmit={this.SubmitReport}>

                            <div className="row">

                                <input
                                    type="text"
                                    name="report_name"
                                    value={report_name}
                                    placeholder="Enter Report Name"
                                    onChange={this.handleChange}
                                />
                                <div style={{ color: 'red', fontSize: "12px" }}> {reportError}</div>



                                <div className="Calendar">
                                    Date of Report:
                                    <DatePicker
                                        disabled={false}
                                        mode="date"
                                        selected={this.state.reportDate}
                                        onChange={(date) => this.handleDatePicker(date)}
                                        className="calendardob"
                                    />
                                </div>
                                <div style={{ color: 'red', fontSize: "12px" }}> {DateError}</div>


                            </div>
                            <div className="row">
                                <input
                                    type="file"
                                    className="uploadbox"
                                    name="file"
                                    accept=".jpeg, .png, .jpg"
                                    onChange={this.onFileHandler}
                                />
                            </div>

                            <div className="btncontainer">
                                {/* <button onClick={this.handleUpload}><i className="fas fa-check"></i>Update Image </button> */}

                                <button type="submit" className="Updatebtn">
                                    <i className="fas fa-save"></i>
                                            Add Report
                                     </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default AddReport;
