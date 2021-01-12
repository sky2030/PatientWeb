import React from "react";
import "./dashboard/dashboard.css";
import { Link, Redirect } from "react-router-dom";
import moment from "moment-timezone";
import docicon from "./img/doctor-icon.jpg";
import axios from "axios";
import Navigation from "./Nav";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "./img/Spinnergrey.gif";

const BASE = "https://stage.mconnecthealth.com";
const BASE_URL = `${BASE}/v1/patient/`

const AVALABLE_COLOR = "#73ff73";
const BOOKED_COLOR = "#2d332d";
const CANCELLED_COLOR = "#de0202";
const COMPLETED_COLOR = "#015711";
const TRANSIENT_COLOR = "#F72";
const IS_TRANSIENT = "transient";
const IS_AVAILABLE = "available";
const IS_BOOKED = "booked";
const IS_CANCELLED = "cancelled";
const IS_COMPLETED = "completed";
const AVALABLE_FONT = "#000";
const BOOKED_FONT = "#606e60";
const CANCELLED_FONT = "#ACB9B7";
const COMPLETED_FONT = "#fff";

class Bookingslot extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");

        let loggedIn = true;
        let startDate = moment().format("x");
        let endDate = moment().endOf("day").format("x");;
        if (token == null) {
            loggedIn = false;
        }
        this.state = {
            loggedIn,
            startDate: startDate,
            endDate: endDate,
            posts: [],
            doctor: {},
            post: {},
            back: {},
            family: {},
            familyData: [],
            slotsData: [],
            isDatePickerAvailable: 'false',
            family_member_id: '',
            slotDate: new Date(),

        };
    }

    updateStartEndDate = async (sdate) => {
        console.log("date inside update:" + sdate);
        await this.setState({
            startDate: moment(sdate).startOf("day").format("x"),
            endDate: moment(sdate).endOf("day").format("x"),
        });
        // let iscurrentDate = moment().isSame(sdate, "day");
        // if (iscurrentDate) {
        //     await this.setState({
        //         startDate: moment().format("x")
        //     })
        // } this.setState({
        //     slotDate: moment(sdate).format("ll")
        // })

    };
    handleDatePicker = async (date) => {
        console.log(date);
        await this.updateStartEndDate(date);
        this.setState({
            slotDate: date,
        });
        await this.getDoctorsSlots();
    };

    handleFamily = (e) => {
        this.setState({
            family_member_id: e.target.value
        })
    }
    displayBGSlot = (item) => {
        if (item == IS_AVAILABLE) {
            return AVALABLE_COLOR
        }
        return BOOKED_COLOR
    }

    displayColor = (item) => {
        if (item == IS_AVAILABLE) {
            return AVALABLE_FONT;
        }
        return BOOKED_FONT;
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
    componentDidMount = async () => {
        await this.setState({
            doctor: this.props.location.Doctor.post,
            post: this.props.location.Doctor.post,
            back: this.props.location.Doctor.post
        });
        // await this.updateStartEndDate(new Date())
        this.getDoctorsSlots()
        this.getfamilydetails()
    };

    getDoctorsSlots = () => {
        console.log("Data has been received!!");
        const {
            startDate,
            endDate,
        } = this.state;
        axios
            .get(
                `${BASE_URL}doctorslots?code=${this.state.doctor.hospitalcode}&did=${this.state.doctor._id}&day_from=${startDate}&day_to=${endDate}`,

                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            )
            .then((response) => {
                console.log("this is Slots" + response);
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



    getfamilydetails = () => {
        console.log("Data has been received!!");
        axios
            .get(
                `${BASE_URL}family-members`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            )
            .then((response) => {
                console.log("this is family" + response);
                if (response.data.code === 200) {
                    const data = response.data.data.members;
                    console.log(response);
                    this.setState({ familyData: data });
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
        const { doctor, post, posts, familyData, slotDate, back } = this.state;
        let allfamilyjson = [
            {
                id: "",
                name: "Self"
            },
        ];

        allfamilyjson = allfamilyjson.concat([...familyData]);
        // familyData = [...allfamilyjson];
        const familylist = allfamilyjson.length ? (
            allfamilyjson.map((post) => {
                return (
                    <option value={post.id} key={post.id} >
                        {post.name}
                    </option>
                );
            })
        ) : (
                <option value='self'>
                    Self
                </option>
            );
        const slotlist = posts.length ? (
            posts.map((post) => {
                const { family_member_id } = this.state
                return (

                    <Link
                        to={{
                            pathname: "/payment",
                            Id: { post, family_member_id, back },
                        }}
                        className="SlotCard"
                        style={{
                            backgroundColor: this.displayBGSlot(post.status),
                        }}
                    >
                        <div className="bodytext">
                            <p
                                className="slotalign"
                                style={{
                                    color: this.displayColor(post.status),
                                }}
                            >
                                {this.StringFromTime(post.time_millis)}

                            </p>
                            <p
                                className="statusfont"
                                style={{
                                    color: this.displayColor(post.status),
                                }}
                            >
                                {post.status.toUpperCase()}
                            </p>
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
                <Navigation />
                <div className="flex-head">
                    <Link
                        to={{
                            pathname: "/Doctorlist",
                            Hospital: { post },
                        }}
                        className="backbtnslot">
                        {/* <i className="fas fa-arrow-left"></i>  */}
                    Back
        </Link>
                </div>

                <div className="dashboard_wrap">

                    <div className="bookingtab">
                        <div className='doctorslotcol'>
                            <div
                                className="doctor-card1 col">

                                <h3 style={{ color: "white" }}>
                                    Dr. {doctor.first_name} {doctor.last_name}
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}>
                                    <div className="doctorpic">
                                        <img
                                            src={doctor.picture === "" ? docicon : doctor.picture}
                                            alt="doctors"
                                        />
                                        <p
                                            style={{
                                                color: 'rgb(6, 105, 185)',
                                                fontSize: '12px'
                                            }}>
                                            {" "}
                                            <i className="fas fa-star"></i>{" "}
                                            <i className="fas fa-star"></i>{" "}
                                            <i className="fas fa-star"></i>{" "}
                                            <i className="fas fa-star"></i>{" "}
                                        </p>
                                    </div>
                                    <div className="doctordetails">
                                        <p>
                                            <b>{doctor.department}</b> | {doctor.experience} EXP.
                                         </p>


                                        <p>{doctor.degree}</p>
                                        <p>{doctor.hospitalName}</p>
                                        <p>{doctor.designation}</p>
                                        <p>Consultation Fees : Rs. {doctor.consultation}</p>
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                            {/* <div className="availability"> */}
                            <div
                                key={post._id} className="doctor-card1 col">

                                <h3 style={{ color: "white" }}>
                                    {post.slotData}
                                    Next Available OPD on: {moment(slotDate).format("DD/MM/YYYY")}
                                </h3>
                                {/* <div className='NextSLotcss'>
                                <p>Next available OPD: 07/12/2020</p>
                            </div> */}
                                <div className='datecssne2'>
                                    <h5
                                        style={{
                                            marginTop: '5px'
                                        }}
                                    >Choose Another Date:</h5>

                                    <DatePicker
                                        disabled={false}
                                        mode="date"
                                        selected={slotDate}
                                        onChange={(date) => this.handleDatePicker(date)}
                                        className="dateslotpicks"
                                        style={{
                                            backgroundColor: "blue",
                                            width: "2em",
                                            marginLeft: '5em',
                                            marginBottom: '1em'

                                        }}

                                    />

                                </div>
                                <div className='datecssne3'>
                                    <h5
                                        style={{
                                            marginBottom: '5px'
                                        }}
                                    >Consultation Type:</h5>
                                    <select
                                        onChange={this.handleFamily}>
                                        {familylist}

                                    </select>
                                </div>
                            </div>
                        </div>


                        <div className='bookingslotcss'>

                            <h4>Booking Slots Status</h4>

                            <div className='slotdatecss'>
                                {slotlist}

                            </div>
                        </div>
                    </div>
                </div>
            </div >



        );
    }
}
export default Bookingslot;