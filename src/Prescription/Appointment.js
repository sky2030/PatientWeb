import React from "react";
import Navigation from "../Nav";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import Spinner from "../img/Spinnergrey.gif";
import "./Style.css"
const BASE = "https://stage.mconnecthealth.com";
const BASE_URL = `${BASE}/v1/patient/`
const NA = "N/A";

class Prescription extends React.Component {
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
            Prescription: [],
        };
    }
    componentDidMount = async () => {
        console.log(this.props.location.Id.item.id)
        await this.setState({
            appointment_id: this.props.location.Id.item.id
        })

        this.GetPrescriptions()

    };

    GetPrescriptions = () => {
        const { appointment_id } = this.state
        let URL = ""
        URL = `${BASE_URL}prescription?a_id=${appointment_id}`;
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
                    this.setState({ Prescription: data });
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
        const { Prescription } = this.state;
        const PrescriptionList = Prescription.length ? (
            Prescription.map((item, index) => {
                const advice = item.information === undefined ? "" : item.information.advice;
                const special_advice = item.information === undefined ? "" : item.information.special_advice;
                const symptoms = item.information === undefined ? "" : item.information.symptoms;
                const findings = item.information === undefined ? "" : item.information.lab_findings;
                const fileString = item.information === undefined ? "" : item.information.file_path;
                const patientName = item.consultant.name ? item.consultant.name : NA;
                const patientWeight = item.consultant.weight ? item.consultant.weight : NA;
                const patientAge = item.consultant.age ? item.consultant.age : NA;
                const patientHeight = item.consultant.height ? item.consultant.height : NA;
                const patientGender = item.consultant.gender ? item.consultant.gender : NA;
                const suggestedInvestigation = item.information === undefined ? "" : item.information.suggested_investigation;
                const appointmentDate = moment(item.created_date).format("ll");
                const Hospital_Name = item.hospital.name;
                return (
                    <div key={item.appointment_id} className="PresCard">
                        <div className="PresHeader">
                            <p><b>{Hospital_Name}</b></p>
                            <p> Dr. {item.doctor.name} | {item.doctor.degree} </p>
                            <p >{item.doctor.designation}</p>
                            <p >
                                {item.hospital.place} , {item.hospital.city} - {item.hospital.pincode}
                            </p>
                        </div>
                        <div className="PresPatientProfile">
                            <h3>Patient Name: {patientName}</h3>
                            <p>
                                <b>Gender</b>: {patientGender} |
                                <b> Age</b>: {patientAge} Years
                            </p>
                            <p>
                                <b>Height</b>: {patientHeight} cm |
                                <b> Weight</b>: {patientWeight} Kg

                            </p>
                        </div>
                        <div className="Presbody">
                            <div className="PresLeft">
                                <b>Chief Complaint</b>
                                <p>{symptoms}</p>
                                <b>Lab Findings</b>
                                <p>{findings}</p>
                                <b>Suggested Investigation</b>
                                <p>{suggestedInvestigation}</p>
                            </div>
                            <div className="PresRight">
                                {advice}
                            </div>
                        </div>
                        <div className="PresFooter">
                            <b>Special Instructions:</b>
                            <p>{special_advice}</p>
                        </div>
                        <div className="Presbottom">

                            <b> Appointment Date: </b>
                            <p>{appointmentDate} </p>
                            <b>Signature: </b>

                        </div>
                        {fileString ? <div className="Presbottom">
                            <b> Attachement: </b>
                            <img src={fileString} alt="Attachment" />
                        </div> : null}
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

                    <div className="flex-container">{PrescriptionList}</div>

                </div>
            </div>
        );
    }
}
export default Prescription;
