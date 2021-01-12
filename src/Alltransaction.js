import React from "react";
//import ReactDOM from 'react-dom';
import Navigation from "./Nav";
import "./dashboard/dashboard.css";
import { Link, Redirect } from "react-router-dom";
//import {Redirect } from 'react-router-dom';

import axios from "axios";
import moment from "moment-timezone";
import Spinner from "./img/Spinnergrey.gif";

const BASE = "https://stage.mconnecthealth.com";
const BASE_URL = `${BASE}/v1/patient/`

class Alltransation extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");

    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }
    this.state = {
      loggedIn,
      posts: [],
      dup_post: [],
      doctor: [],

    };
  }

  componentDidMount = () => {
    this.setState({ doctor: [] })
    this.setState({ status: [] })
    this.GetTransactions();
  };



  GetTransactions = () => {
    axios
      .get(`https://stage.mconnecthealth.com/v1/patient/orders`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.code === 200) {
          const data = response.data.data;
          let dup_doctors = [
            JSON.stringify({
              _id: "alltransaction",
              name: "All Doctors",
            })];


          response.data.data.map(item => {
            let jsonOBJ = {
              _id: item.doctor_id,
              name: item.doctor_name
            }
            let objString = JSON.stringify(jsonOBJ)
            let index = dup_doctors.indexOf(objString)

            if (index === -1) {
              console.log("Push :", index)
              dup_doctors.push(objString)
            }


          })
          this.setState({
            doctor: dup_doctors,
            posts: data,
            dup_post: data
          })
          //   console.log("Data has been received!!" + data);
        } else {
          this.setState({
            posts: [],
            dup_post: [],
            doctor: []
          });
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

  LoadMoreTransactions = () => {
    const { posts } = this.state
    console.log(`https://stage.mconnecthealth.com/v1/patient/orders?offset=${posts.length}`)
    axios
      .get(`https://stage.mconnecthealth.com/v1/patient/orders?offset=${posts.length}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.code === 200) {
          let data = response.data.data;
          this.setState({
            posts: posts.concat(data),
            dup_post: posts.concat(data)
          })
          //   console.log("Data has been received!!" + data);
        } else {
          this.setState({
            posts: [],
            dup_post: [],
          });
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

  handleStatus = (e) => {
    console.log("This is status: ", e.target.value);
    if (e.target.value === "status") {
      this.setState({
        posts: this.state.dup_post
      })
    } else {
      let filterList = this.state.dup_post.filter(item => {
        if (item.status === e.target.value) {
          return item
        }
      })
      this.setState({ posts: filterList })
    }

  }

  handleOnChange = (e) => {
    console.log("This is Doctor ID : ", e.target.value);
    if (e.target.value === "alltransaction") {
      this.setState({
        posts: this.state.dup_post
      })
    } else {
      let filterList = this.state.dup_post.filter(item => {
        if (item.doctor_id === e.target.value) {
          return item
        }
      })
      this.setState({ posts: filterList })
    }

  };
  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    if (localStorage.getItem("token") === null) {
      return <Redirect to="/" />;
    }
    const { posts, doctor } = this.state;
    const DoctorList = doctor.length ? (
      doctor.map((item) => {
        let item_copy = JSON.parse(item)
        return (
          <option key={item_copy._id} value={item_copy._id} >
            {item_copy.name}
          </option>
        );
      })
    ) : (
        <option value="" >
          All Doctor
        </option>
      );

    const TransactionsList = posts.length ? (
      posts.map((post) => {
        return (
          <div key={post.invoice}>
            <div className="alltransation">
              <div
                className="list"
              >
                <p>{post.invoice}</p>
              </div>
              <div
                className="list"
              >

                <p>{moment(post.date).format("ll")}</p>
              </div>
              <div className="list">
                <p>Dr. {post.doctor_name}</p>
              </div>

              <div className="list">
                <p>
                  {" "}
                  {post.amount} {post.currency}
                </p>
              </div>
              <div className="list">
                <p>{post.status} </p>
              </div>
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
          }}
        >
          <img src={Spinner} alt="Loading" />
        </div>
      );
    return (
      <div className="Appcontainer">
        <Navigation />

        <div className="transactioncard pb15">
          <div className="backarrow">
            {" "}
            <Link to="/Dashboard">
              <i className="fas fa-arrow-left"></i>
            </Link>
          </div>
          <h2>All Transactions</h2>
          <div className="maintrans">
            <div className="alltransation">
              <div
                className="listhead"
              >
                <p>
                  <b>Invoice No</b>
                </p>
              </div>

              <div
                className="listhead"
              >
                <p>
                  <b>Date</b>
                </p>
              </div>

              <div className="listhead">
                <p>
                  <select
                    id="doctors"
                    onChange={this.handleOnChange}
                    className="transdoctor"
                  >
                    {DoctorList}
                  </select>
                  {/* <b>Doctor Name</b> */}
                </p>
              </div>

              <div className="listhead">
                <p>
                  <b>Amount</b>
                </p>
              </div>
              <div className="listhead">
                <p>
                  <select
                    id="doctors"
                    onChange={this.handleStatus}
                    className="transdoctor"
                  >
                    <option value="status">Status</option>
                    <option value="initiated">INITIATED</option>
                    <option value="paid">PAID</option>
                  </select>
                </p>
              </div>
            </div>
          </div>
          {TransactionsList}
          {posts.length >= 20 ? <div className="tranbottom">
            <button onClick={() => this.LoadMoreTransactions()}>  <i className="fa fa-arrow-down"></i> Load More </button>
          </div> : null}
        </div>
      </div>
    );
  }
}
export default Alltransation;
