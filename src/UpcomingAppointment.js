import React from "react";
import "./dashboard/dashboard.css";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Nav from "./Nav";
//import Spinner from "./img/Spinnergrey.gif";
import events from './img/baloon.png';
import * as AiIcons from 'react-icons/ai';


class Allappointment extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");

        let LoggedIn = true;
        let startDate = moment().startOf("day").format("x");
        let endDate = moment().endOf("day").format("x");

        if (token == null) {
            LoggedIn = false;
        }
        this.state = {
            email: "",
            password: "",
            token: "",
            LoggedIn,
            startDate: startDate,
            endDate: endDate,
            slotDate: new Date(),
            submitted: false,
            isDatePickerAvailable: false,
            appointmentList: [],
            slotValue: "booked",
            allSlots: [],
            loading: "",
            slotValue: 'booked',
            // appointmentList: [],
            allSlots: [],
            Joindata: []
        };
    }

    componentDidMount = () => {
        this.fetchData();

    };

    fetchData = () => {

        const {
            startDate,
            endDate,
            slotValue
        } = this.state;

        console.log(`this is start date ${startDate}`);
        console.log(`this is start date ${endDate}`);
        let URL = `https://stage.mconnecthealth.com/v1/patient/slots?day_from=${startDate}&day_to=${endDate}&status[]=booked`;
        let URL2 = `https://stage.mconnecthealth.com/v1/patient/doctorslots?day_from=${startDate}&day_to=${endDate}&self=true`;

        fetch(URL2, {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        }
        )
            .then((res) => res.json())
            .then((results) => {
                console.log(results)
                if (results.code === 200) {
                    this.setState({
                        allSlots: results.data
                    });
                    let list = results.data.filter(item => {
                        if (item.status == slotValue)
                            return item
                    })
                    this.setState({
                        appointmentList: list
                    });

                } else {
                    alert(results.message);
                }
                // if (results.code === 200) {
                //   this.setState({
                //     appointmentList: results.data,
                //   });
                // } else {
                //   alert(results.message);
                // }
            })
            .catch((err) => {
                alert(err);
            });
    };

    handleStatus = (e) => {
        this.setState({
            slotValue: e.target.value
        })
        let list = this.state.allSlots.filter(item => {
            if (item.status == e.target.value)
                return item
        })
        this.setState({
            appointmentList: list
        })
    }



    updateStartEndDate = (sdate) => {
        console.log("date inside update:" + sdate);
        this.setState({
            startDate: moment(sdate).startOf("day").format("x"),
            endDate: moment(sdate).endOf("day").format("x"),
        });
        console.log("Start Date:" + this.state.startDate);
    };
    handleDatePicker = async (date) => {
        console.log(date);
        await this.updateStartEndDate(date);
        this.setState({
            slotDate: date,
        });
        await this.fetchData();
    };

    joinConversationPressed = (item) => {
        console.log("Appointment ID : " + item.id)
        fetch(
            `https://stage.mconnecthealth.com/v1/patient/appointment/join-now?appointment_id=${item.id}`,
            {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            }
        )
            .then((res) => res.json())
            .then((results) => {
                //  console.log(results);
                this.setState({
                    submitted: true
                })
                if (results.code === 200) {
                    this.setState({
                        Joindata: results.data
                    })
                    // Redirect("EnableX", {
                    //   streamId: results.data.enableX.room_id,
                    //   token: results.data.enableX.token,
                    // });
                } else {

                    alert(results.message);
                    // <Redirect to="/EnableX" />

                }
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            });
    };
    statusForJoinConversation = (item) => {
        //console.log(item);
        return 0;
    };


    statusForJoinConversation = (item) => {
        console.log(item);
        return 0;
    };
    StringFromTime = (timevalue) => {
        if (timevalue <= 0) {
            return "12:00 AM";
        }
        let time = Number(timevalue) / 60000;
        let sdate = new Date();
        sdate.setHours(Math.floor(time / 60));
        sdate.setMinutes(time % 60);
        var returnValue = moment(sdate.getTime(), "x").format("hh:mm A");

        return returnValue;
    };

    render() {
        if (localStorage.getItem("token") == null) {
            return <Redirect to="/" />;
        }

        const RoomData = this.state.Joindata

        // if (this.state.submitted == true) {
        //   return <Redirect to={{
        //     pathname: '/EnableX',
        //     item: { RoomData }
        //   }} />
        // }

        const { appointmentList, slotValue, allSlots } = this.state;
        const appointmentdata = appointmentList.length ? (
            appointmentList.map((item) => {
                return (
                    <div className="maintrans">
                        <h3>
                            Dr. {item.doctor.name} || {moment(item.day_millis).format("ll")} ||{" "}
                            {this.StringFromTime(item.time_millis)}
                        </h3>
                        {item.status == "booked" ?
                            <div className="alltransation">

                                <Link
                                    to={{
                                        pathname: "/AppointmentReport",
                                        Data: { item },
                                    }}
                                    className="MarginTop11"
                                >
                                    <button

                                        className='reportscss'
                                    >
                                        <b> View Reports</b>
                                    </button>
                                </Link>


                                <div className="MarginTop11">

                                    <Link
                                        to={{
                                            pathname: "/EnableX",
                                            Enx: { item },
                                        }}
                                    >
                                        <button
                                            onClick={() => this.joinConversationPressed(item)}

                                            className='consultationcss'
                                        >
                                            <b>Start Consultation</b>
                                        </button>

                                    </Link>
                                </div>



                                {/* <Link
                                    to={{
                                        pathname: "/Prescription",
                                        Id: { item },
                                    }}
                                    className="MarginTop11"
                                >
                                    <button

                                        className='prescriptioncss'
                                    >
                                        <b>Precsription</b>
                                    </button>
                                </Link> */}

                                <Link
                                    to={{
                                        pathname: "/Reschedule",
                                        Data: { item },
                                    }}
                                    className="MarginTop11"
                                >
                                    <button

                                        className='reschedulecss'
                                    >
                                        <b>Reschedule</b>
                                    </button>
                                </Link>


                            </div> : <div className="alltransation">

                                <Link
                                    to={{
                                        pathname: "/AppointmentReport",
                                        Data: { item },
                                    }}
                                    className="MarginTop11"
                                >
                                    <button

                                        className='reportscss'
                                    >
                                        <b> View Reports</b>
                                    </button>
                                </Link>


                                <Link
                                    to={{
                                        pathname: "/Prescription",
                                        Id: { item },
                                    }}
                                    className="MarginTop11"
                                >
                                    <button

                                        className='prescriptioncss'
                                    >
                                        <b>Precsription</b>
                                    </button>
                                </Link>




                            </div>}
                    </div>
                );
            })
        ) : (
                <div

                    className="spinnerdiv"
                >
                    {/* <b>No Appointments Available for the  Selected Date </b> */}
                    <img src={events} alt="Loading"

                    />
                    <p

                        className='noappointmentcss'>
                        No Appointments Available
            </p>
                </div>
            );

        return (
            <div className="Appcontainer">
                <Nav />
                <div className="alldept pb15">
                    <div className="backarrow">
                        {" "}
                        <Link to="/Dashboard">
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                    </div>
                    <h2>All Appointment</h2>

                    <div
                        style={{
                            marginTop: "10px",
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}
                    >
                        {/* <b style={{
              marginRight: '10px',
              marginTop: '3px'
            }}>
              Upcoming Appointments on: </b> */}

                        <DatePicker
                            disabled={false}
                            mode="date"
                            selected={this.state.slotDate}
                            onChange={(date) => this.handleDatePicker(date)}
                            className="datepiccss"
                            style={{
                                backgroundColor: "blue",
                                width: "2em",
                                marginLeft: '5em',
                                marginBottom: '1em'

                            }}

                        />
                        <AiIcons.AiFillCalendar className="slotIcons" style={{

                            marginTop: '3px',
                            marginLeft: '10px'
                        }} />

                        <select
                            onChange={this.handleStatus}
                            className="filtercss"
                            style={{
                                borderBottomWidth: '1px',
                                borderColor: 'blue'
                            }}
                        >
                            <option value="booked">UPCOMING</option>
                            <option value="completed">COMPLETED</option>

                        </select>
                    </div>

                    {appointmentdata}
                </div>
            </div>
        );
    }
}

export default Allappointment;
