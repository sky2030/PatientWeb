import React from "react";
//import ReactDOM from 'react-dom';
import "./dashboard/dashboard.css";
import logo from "./img/logo.png";
import { Link } from "react-router-dom";
//import RightNav from './RightNav';
import moment from "moment-timezone";
import docicon from "./img/doctor-icon.jpg";
import axios from "axios";
import Navigation from "./Nav";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Bookingslot extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");

        let loggedIn = true;
        let startDate = moment().startOf("day").format("x");
        let endDate = moment().endOf("day").format("x");
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
            family: {},
            familyData: [],
            slotsData: [],
            isDatePickerAvailable: 'false',
            family_member_id: ''
            // startDate,
            // endDate,
            // slotValue
        };
    }
    componentDidMount = async () => {
        // console.log("product props is", this.props.location.Hospital.post.deptcode)
        await this.setState({
            doctor: this.props.location.Doctor.post
        });
        this.getDoctorsSlots()
        this.setState({
            post: this.props.location.Doctor.post
        })
    };

    getDoctorsSlots = () => {
        console.log("Data has been received!!");
        const {
            startDate,
            endDate,
        } = this.state;
        axios
            .get(
                `https://stage.mconnecthealth.com/v1/patient/doctorslots?code=${this.state.doctor.hospitalcode}&did=${this.state.doctor._id}&day_from=${startDate}&day_to=${endDate}`,

                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            )
            .then((response) => {
                console.log(response);
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
                alert(Error);
            });
    };

    // componentDidMount = async () => {
    // console.log("product props is", this.props.location.Hospital.post.deptcode)
    // await this.setState({
    //     family: this.props.location.Doctor.post
    // });
    //     this.getfamilydetails()
    //     this.setState({
    //         post: this.props.location.Doctor.post
    //     })
    // };

    // getfamilydetails = () => {
    //     console.log("Data has been received!!");
    //     const {
    //         startDate,
    //         endDate,
    //     } = this.state;
    //     axios
    //         .get(
    //             `https://stage.mconnecthealth.com/v1/patient/family-members`,

    //             {
    //                 headers: {
    //                     Authorization: localStorage.getItem("token"),
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             console.log(response);
    //             if (response.data.code === 200) {
    //                 const data = response.data.data;
    //                 console.log(response);
    //                 this.setState({ posts: data });
    //                 console.log("Data has been received!!");
    //             } else {
    //                 alert(response.data.message)
    //             }
    //         })
    //         .catch((Error) => {
    //             alert(Error);
    //         });
    // };

    // familyItems = () => {
    //     let list = [{ label: 'Self', value: "", key: "self" }];
    //     this.familyData.map(item => {
    //         list.push({ label: `${item.name} - ${item.relation}`, value: item.id, key: item.id })
    //     })

    //     return list
    // }
    render() {
        const { doctor, post } = this.state;

        // const postList = posts.length ? (
        //     posts.map((post) => {
        return (
            <div className="Appcontainer">
                <Navigation />
                <Link
                    to={{
                        pathname: "/Doctorlist",
                        Hospital: { post },
                    }}
                    className="backbtnslot">
                    {/* <i className="fas fa-arrow-left"></i>  */}
                    Back
        </Link>
                <div className="dashboard_wrap">

                    <div className="bookingtab">
                        <div className="maintrans">
                            <h3>
                                Dr. {doctor.first_name} {doctor.last_name} || {doctor.designation}

                            </h3>

                            <div className="bookinghead">

                                {/* <div className="docpic"> */}
                                <div className="doctorslotpic">
                                    <div className='doctorimage'>
                                        <img
                                            src={doctor.picture} alt="Doctor" />
                                    </div>

                                    <div className="docdetails">
                                        {/* <p>{doctor.first_name} {doctor.last_name}</p>
                                        <p>{doctor.designation}</p> */}
                                        <p>{doctor.hospitalName}</p>
                                        <h6>Email:-{doctor.email}</h6>
                                        <h6>Degree:-{doctor.degree}</h6>
                                        <p>Rs.{doctor.consultation} /-</p>



                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="availability">
                            <div className='NextSLotcss'>
                                <p>Next available OPD: 07/12/2020</p>
                            </div>
                            <div className='datecssne2'>
                                <h5>Choose another date:</h5>

                                <DatePicker
                                    disabled={false}
                                    mode="date"
                                    // selected={this.state.slotDate}
                                    // onChange={(date) => this.handleDatePicker(date)}
                                    className="dateslotpicks"
                                    style={{
                                        backgroundColor: "blue",
                                        width: "2em",
                                        marginLeft: '5em',
                                        marginBottom: '1em'

                                    }}

                                />
                            </div>
                        </div>
                        <Link
                            to={{
                                pathname: "/payment",
                                Hospital: { post },
                            }}
                            className="backbtnslot">
                            <button>Pay Now {doctor.consultation} </button>
                        </Link>

                        <h4>Booking Status</h4>



                        <button class="button3 bun1"><p>11:00AM Booked</p></button>
                        <button class="button3 bun2"><p>11:30AM Available</p></button>
                        <button class="button3 bun3"><p>12:00AM Available</p></button>
                        <button class="button3 bun4"><p>12:30PM Available</p></button>
                        <button class="button3 bun5"><p>13:00PM Available</p></button>
                        <button class="button3 bun6"><p>13:30PM Available</p></button>
                        <button class="button3 bun7"><p>14:30PM Available</p></button>
                        <button class="button3 bun8"><p>15:00PM Available</p></button>

                    </div>
                </div>
            </div >



        );
    }
}
export default Bookingslot;