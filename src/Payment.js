import React from "react";
import Navigation from "./Nav";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router-dom";
import RazorpayLogo from './img/razorpay-logo.png'

const RAZORPAY_KEY = "rzp_test_pF9ZwXBROCFCP6";
const FETCHING_ORDERID = "Fetching payment information..."
const PAYMENT_SUCCESS_REPORT = "Processing payment..."
const BASE = "https://stage.mconnecthealth.com";
const BASE_URL = `${BASE}/v1/patient/`

class PaymentGatway extends React.Component {
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
            order: {},
            paymentButtonInfo: FETCHING_ORDERID,
            family_member_id: "",
            submitted: false,
            post: {}


        };
    }
    componentDidMount = async () => {
        await this.setState({
            appointment_id: this.props.location.Id.post.id,
            family_member_id: this.props.location.Id.family_member_id,
            post: this.props.location.Id.back
        })
        this.FetchOrderID()

    };
    FetchOrderID = (event) => {
        // event.preventDefault();
        const {
            appointment_id,
            family_member_id
        } = this.state;

        let payLoad = {
            appointment_id: appointment_id
        }
        let method = "POST"
        let url = `${BASE_URL}order`
        if (family_member_id !== "") {
            payLoad = {
                appointment_id: appointment_id,
                family_member_id: family_member_id
            }
        }
        console.log("Data :", JSON.stringify(payLoad));
        axios({
            url: url,
            method: method,
            data: payLoad,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log(response.data)
                if (response.data.code === 200) {
                    const stringVal = `Proceed To Pay ${response.data.data.merchant.amount} ${response.data.data.merchant.currency}`
                    this.setState({
                        paymentButtonInfo: stringVal,
                        order: response.data.data
                    })
                    console.log("Order Fetched successfully");
                } else {
                    console.log(response.message);
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

    loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    displayRazorpay = async (event) => {
        event.preventDefault();
        this.setState({
            paymentButtonInfo: PAYMENT_SUCCESS_REPORT
        })
        const res = await this.loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // const result = await axios.post("/payment/orders");

        // if (!result) {
        //     alert("Server error. Are you online?");
        //     return;
        // }

        // const { amount, id: order_id, currency } = result.data;

        const { order } = this.state

        const options = {
            key: RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
            amount: order.merchant.amount,
            currency: order.merchant.currency,
            name: order.merchant.name,
            description: order.merchant.description,
            image: order.merchant.image,
            order_id: order.razorpay_order_id,
            handler: async function (response) {
                const data = {
                    // orderCreationId: order.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };


                const result = await axios.post({
                    url: `${BASE_URL}order/paid`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    data: data
                });

                alert(result.data.msg);
                this.setState({
                    submitted: true
                })
            },
            // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
            prefill: {
                name: order.customer.name,
                email: order.customer.email,
                contact: order.customer.mobile,
            },
            theme: {
                color: "#61dafb",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    submitData = async () => {
        const { order } = this.state

        if (order && order.merchant && order.customer) {
            var options = {
                description: order.merchant.description,
                image: order.merchant.image,
                currency: order.merchant.currency,
                key: RAZORPAY_KEY,
                amount: order.merchant.amount,
                name: order.merchant.name,
                order_id: order.razorpay_order_id,
                prefill: {
                    email: order.customer.email,
                    contact: order.customer.mobile,
                    name: order.customer.name
                },
                theme: { color: "lightblue" }
            }
            console.log("Razor Pay :", options)
                //  RazorpayCheckout.open(options)
                .then((data) => {
                    console.log("Payment data :", data)
                    this.setState({
                        paymentButtonInfo: PAYMENT_SUCCESS_REPORT
                    })
                    // handle success
                    //  alert(`Success: ${data.razorpay_payment_id}`);
                    this.submitPaymentSucess(data)
                })
                .catch((failure) => {

                    console.log(failure)
                    if (failure && failure.error) {
                        alert(failure.error.description);
                    }

                });
        }
    };
    submitPaymentSucess = async (data) => {
        let URL = `${BASE_URL}order/paid`;
        console.log(URL);
        fetch(URL, {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((results) => {
                console.log(JSON.stringify(results));

                alert(results.message);

            })
            .catch((err) => {

                alert("Something Went Wrong");

            });
    }


    handleChange = ({ target }) => {
        const { name, value } = target;
        this.setState({ [name]: value });
    };


    render() {
        const {
            paymentButtonInfo,
            post
        } = this.state;
        if (this.state.loggedIn === false) {
            return <Redirect to="/" />;
        }
        if (this.state.submitted) {
            return <Redirect to="/Allappointment" />;
        }
        return (
            <div className="Appcontainer">
                <Navigation />

                <div className="dashboard_wrap">

                    <div className="adddept">
                        <div className="backarrow">
                            {" "}
                            <Link to={{
                                pathname: "/DoctorBookingSLot",
                                Doctor: { post },
                            }}>
                                <i className="fas fa-arrow-left"></i>
                            </Link>

                        </div>
                        <h2>Razorpay</h2>

                        <form action="confirm" onSubmit={this.displayRazorpay}>

                            <div className="row">
                                <img src={RazorpayLogo} alt="Razorpay Logo" />

                            </div>


                            <div className="btncontainer">
                                <button type="submit" className="Updatebtn">
                                    <i className="fas fa-save"></i>
                                    {paymentButtonInfo}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default PaymentGatway;
