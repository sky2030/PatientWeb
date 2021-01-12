import React from "react";
import Navigation from "./Nav";
import "./dashboard/dashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router-dom";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Updatehospitaldetails extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");

    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }
    this.state = {
      loggedIn,
      id: "",
      health_Id: "",
      patient_name: "",
      mothers_name: "",
      gender: "",
      dob: undefined,
      birthday_millis: undefined,
      height: 0,
      weight: 0,
      email: "",
      picture: "",
      place: "",
      city: "",
      state: "",
      pincode: "",
    };
  }
  componentDidMount = () => {
    this.getHospital();

  };

  getHospital = () => {
    axios
      .get("https://stage.mconnecthealth.com/v1/patient", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response);
        const data = response.data.data;

        this.setState({
          id: data._id,
          health_Id: data.health_Id,
          patient_name: data.patient_name,
          email: data.email,
          mothers_name: data.mothers_name,
          gender: data.gender,
          dob: data.dob,
          birthday_millis: data.birthday_millis,
          height: data.height,
          weight: data.weight,
          place: data.place,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          picture: data.picture,
        });

        console.log("Data has been received!!");
      })
      .catch((error) => {
        alert("Error retrieving data!!");
      });
  };

  validate = () => {
    let emailError = "";
    let emergencyNoError = "";
    let phoneError = "";
    let emergencyDetailError = "";

    if (!this.state.email.includes("@")) {
      emailError = "****Invalid Email";
    }
    if (!this.state.phone) {
      phoneError = "****Phone number cannot be blank";
    }

    if (!this.state.emergencyNo) {
      emergencyNoError = "****Emergency No cannot be blank";
    }

    if (!this.state.emergencyDetail) {
      emergencyDetailError = "****Emergency Detail cannot be blank";
    }

    if (emailError || phoneError || emergencyDetailError || emergencyNoError) {
      this.setState({
        emailError,
        phoneError,
        emergencyNoError,
        emergencyDetailError,
      });
      return false;
    }

    return true;
  };

  UpdateHospital = (event) => {
    event.preventDefault();
    // const {
    //   id,
    //   email,
    //   patient_name,
    //   mothers_name,
    //   gender,
    //   dob,
    //   birthday_millis,
    //   height,
    //   weight,
    //   picture,
    //   place,
    //   city,
    //   state,
    //   pincode,
    // } = this.state;

    const isValid = this.validate();
    if (isValid) {
      const payload = new FormData();
      // payload.append("email", email);
      // payload.append("phone", phone);
      // payload.append("emergencyNo", emergencyNo);
      // payload.append("emergencyDetail", emergencyDetail);
      // payload.append("picture", picture);
      axios({
        url: `https://stage.mconnecthealth.com/v1/hospital/${this.state.id}`,
        method: "PUT",
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

  handleSubmit = (event) => {
    event.preventDefault();
    //const isValid = this.validate();
    //if(isValid){

    const {
      id,
      email,
      health_Id,
      patient_name,
      mothers_name,
      gender,
      dob,
      birthday_millis,
      height,
      weight,
      picture,
      place,
      city,
      state,
      pincode,
    } = this.state;

    const payload = {
      id,
      email,
      health_Id,
      patient_name,
      mothers_name,
      gender,
      dob: moment(dob).format("ll"),
      birthday_millis: moment(birthday_millis).format("x"),
      height: height,
      weight: weight,
      picture,
      place,
      city,
      state,
      pincode,
    };
    axios({
      url: `https://stage.mconnecthealth.com/v1/patient`,
      method: "PUT",
      data: payload,
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.data.code === 200) {
          alert(response.data.message)
          this.resetUserInputs();
          this.setState({
            submitted: true,
          });
        }
        else {
          alert(response.data.message);
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
    //}
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

  //   this.getBase64(idCard, (result) => {
  //      idCardBase64 = result;
  // });

  _handleReaderLoaded = (readerEvt) => {
    let binaryString = readerEvt.target.result;
    this.setState({
      picture: btoa(binaryString),
    });
  };

  handleDatePicker = (date) => {
    console.log(date);
    this.setState({
      dob: date,
      birthday_millis: date
    });
  };
  handleGender = (e) => {
    this.setState({
      gender: e.target.value
    })
  }
  handleHeight = (e) => {
    this.setState({
      height: e.target.value,
    });
  };

  handleWeight = (e) => {
    this.setState({
      weight: e.target.value,
    });
  };

  resetUserInputs = () => {
    this.setState({
      patient_name: "",
      health_Id: "",
      mothers_name: "",
      gender: "",
      dob: "",
      birthday_millis: "",
      height: "",
      weight: "",
      email: "",
      picture: "",
      place: "",
      city: "",
      state: "",
      pincode: "",
    });
  };
  render() {
    const {
      email,
      patient_name,
      health_Id,
      mothers_name,
      height,
      weight,
      place,
      city,
      state,
      pincode,
    } = this.state;

    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    if (this.state.submitted) {
      return <Redirect to="/PatientProfile" />;
    }
    return (
      <div className="Appcontainer">
        <Navigation />

        <div className="dashboard_wrap">

          <div className="adddept">
            <div className="backarrow">
              {" "}
              <Link to="/PatientProfile">
                <i className="fas fa-arrow-left"></i>
              </Link>
            </div>
            <h2>Update Profile</h2>

            <form action="confirm" onSubmit={this.handleSubmit}>

              <div className="row">

                <input
                  type="text"
                  name="patient_name"
                  value={patient_name}
                  placeholder="Full Name"
                  onChange={this.handleChange}
                />
                <input
                  type="text"
                  name="email"
                  value={email}
                  placeholder="Enter Email Address"
                  onChange={this.handleChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.emailError}
                </div>
                <input
                  type="text"
                  name="mothers_name"
                  value={mothers_name}
                  placeholder="Mother's Maiden Name"
                  onChange={this.handleChange}
                />
                <input
                  type="text"
                  name="health_Id"
                  value={health_Id}
                  placeholder="Enter NDHM Health ID"
                  onChange={this.handleChange}
                />
                <select
                  onChange={this.handleGender}>
                  <option value="Male">Male </option>
                  <option value="Female">Female </option>
                  <option value="Other">Other </option>

                </select>

                <div className="Calendar">
                  Date of Birth:
                  <DatePicker
                    disabled={false}
                    mode="date"
                    selected={this.state.birthday_millis}
                    onChange={(date) => this.handleDatePicker(date)}
                    className="calendardob"
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"


                  />
                </div>
                <div className="Calendar">
                  Weight: {weight} kg
                  <select
                    style={{ width: '20px', height: '30px', margin: "8px" }}
                    onChange={this.handleWeight}>
                    <option value="N/A">N/A</option>
                    <option value="1">1 kg</option>
                    <option value="2">2 kg</option>
                    <option value="3">3 kg</option>
                    <option value="4">4 kg</option>
                    <option value="5">5 kg</option>
                    <option value="6">6 kg</option>
                    <option value="7">7 kg</option>
                    <option value="8">8 kg</option>
                    <option value="9">9 kg</option>
                    <option value="10" >10 kg</option>
                    <option value="11">11 kg</option>
                    <option value="12">12 kg</option>
                    <option value="13">13 kg</option>
                    <option value="14">14 kg</option>
                    <option value="15">15 kg</option>
                    <option value="16">16 kg</option>
                    <option value="17">17 kg</option>
                    <option value="18">18 kg</option>
                    <option value="19">19 kg</option>
                    <option value="20">20 kg</option>
                    <option value="21">21 kg</option>
                    <option value="22">22 kg</option>
                    <option value="23">23 kg</option>
                    <option value="24">24 kg</option>
                    <option value="25">25 kg</option>
                    <option value="26">26 kg</option>
                    <option value="27">27 kg</option>
                    <option value="28">28 kg</option>
                    <option value="29">29 kg</option>
                    <option value="30">30 kg</option>
                    <option value="31">31 kg</option>
                    <option value="32">32 kg</option>
                    <option value="33">33 kg</option>
                    <option value="34">34 kg</option>
                    <option value="35">35 kg</option>
                    <option value="36">36 kg</option>
                    <option value="37">37 kg</option>
                    <option value="38">38 kg</option>
                    <option value="39">39 kg</option>
                    <option value="40">40 kg</option>
                    <option value="41">41 kg</option>
                    <option value="42">42 kg</option>
                    <option value="43">43 kg</option>
                    <option value="44">44 kg</option>
                    <option value="45">45 kg</option>
                    <option value="46">46 kg</option>
                    <option value="47"> 47 kg</option>
                    <option value="48">48 kg</option>
                    <option value="49">49 kg</option>
                    <option value="50">50 kg </option>
                    <option value="51">51 kg</option>
                    <option value="52">52 kg</option>
                    <option value="53">53 kg</option>
                    <option value="54">54 kg</option>
                    <option value="55">55 kg</option>
                    <option value="56">56 kg</option>
                    <option value="57">57 kg</option>
                    <option value="58">58 kg</option>
                    <option value="59">59 kg</option>
                    <option value="60">60 kg</option>
                    <option value="61">61 kg</option>
                    <option value="62">62 kg</option>
                    <option value="63">63 kg</option>
                    <option value="64">64 kg</option>
                    <option value="65">65 kg</option>
                    <option value="66">66 kg</option>
                    <option value="67">67 kg</option>
                    <option value="68">68 kg</option>
                    <option value="69">69 kg</option>
                    <option value="70">70 kg</option>
                    <option value="71">71 kg</option>
                    <option value="72">72 kg</option>
                    <option value="73">73 kg</option>
                    <option value="74">74 kg</option>
                    <option value="75">75 kg</option>
                    <option value="76">76 kg</option>
                    <option value="77">77 kg</option>
                    <option value="78">78 kg</option>
                    <option value="79">79 kg </option>
                    <option value="80">80 kg</option>
                    <option value="81">81 kg</option>
                    <option value="82">82 kg</option>
                    <option value="83">83 kg</option>
                    <option value="84">84 kg</option>
                    <option value="85">85 kg</option>
                    <option value="86">86 kg</option>
                    <option value="87">87 kg</option>
                    <option value="88">88 kg</option>
                    <option value="89">89 kg</option>
                    <option value="90">90 kg</option>
                    <option value="91">91 kg</option>
                    <option value="92">92 kg</option>
                    <option value="93">93 kg</option>
                    <option value="94">94 kg</option>
                    <option value="95">95 kg</option>
                    <option value="96">96 kg</option>
                    <option value="97">97 kg</option>
                    <option value="98">98 kg</option>
                    <option value="99">99 kg</option>
                    <option value="100">100 kg</option>
                    <option value="101">101 kg</option>
                    <option value="102">102 kg</option>
                    <option value="103" >103 kg</option>
                    <option value="104">104 kg</option>
                    <option value="105">105 kg</option>
                    <option value="106">106 kg</option>
                    <option value="107">107 kg</option>
                    <option value="108">108 kg</option>
                    <option value="109">109 kg</option>
                    <option value="110">110 kg</option>
                    <option value="111">111 kg</option>
                    <option value="112">112 kg</option>
                    <option value="113">113 kg</option>
                    <option value="114">114 kg</option>
                    <option value="115">115 kg</option>
                    <option value="116">116 kg</option>
                    <option value="117">117 kg</option>
                    <option value="118">118 kg</option>
                    <option value="119">119 kg</option>
                    <option value="120">120 kg</option>
                    <option value="121">121 kg</option>
                    <option value="122">122 kg</option>
                    <option value="123">123 kg</option>
                    <option value="124">124 kg</option>
                    <option value="125"> 125 kg</option>
                    <option value="126">126 kg</option>
                    <option value="127">127 kg</option>
                    <option value="128">128 kg</option>
                    <option value="129">129 kg</option>
                    <option value="130">130 kg</option>
                    <option value="131">131 kg</option>
                    <option value="132">132 kg</option>
                    <option value="133">133 kg</option>
                    <option value="134">134 kg</option>
                    <option value="135">135 kg</option>
                    <option value="136">136 kg</option>
                    <option value="137">137 kg</option>
                    <option value="138">138 kg</option>
                    <option value="139">139 kg</option>
                    <option value="140">140 kg</option>
                    <option value="141">141 kg</option>
                    <option value="142">142 kg</option>
                    <option value="143">143 kg</option>
                    <option value="144">144 kg</option>
                    <option value="145">145 kg</option>
                    <option value="146">146 kg</option>
                    <option value="147">147 kg</option>
                    <option value="148">148 kg</option>
                    <option value="149">149 kg</option>
                    <option value="150">150 kg</option>
                    <option value="151">151 kg</option>
                    <option value="152">152 kg</option>
                    <option value="153">153 kg</option>
                    <option value="154">154 kg</option>
                    <option value="155">155 kg</option>
                    <option value="156">156 kg</option>
                    <option value="157">157 kg</option>
                    <option value="158">158 kg</option>
                    <option value="159">159 kg</option>
                    <option value="160">160 kg</option>
                    <option value="161">161 kg</option>
                    <option value="162">162 kg</option>
                    <option value="163">163 kg</option>
                    <option value="164">164 kg</option>
                    <option value="165">165 kg</option>
                    <option value="166">166 kg</option>
                    <option value="167">167 kg</option>
                    <option value="168">168 kg</option>
                    <option value="169">169 kg</option>
                    <option value="170">170 kg</option>
                    <option value="171">171 kg</option>
                    <option value="172">172 kg</option>
                    <option value="173">173 kg</option>
                    <option value="174">174 kg</option>
                    <option value="175">175 kg</option>
                    <option value="176">176 kg</option>
                    <option value="177">177 kg</option>
                    <option value="178">178 kg</option>
                    <option value="179">179 kg</option>
                    <option value="180">180 kg</option>
                    <option value="181">181 kg</option>
                    <option value="182">182 kg</option>
                    <option value="183">183 kg</option>
                    <option value="184">184 kg</option>
                    <option value="185">185 kg</option>
                    <option value="186">186 kg</option>
                    <option value="187">187 kg</option>
                    <option value="188">188 kg</option>
                    <option value="189">189 kg</option>
                    <option value="190">190 kg</option>
                    <option value="191">191 kg</option>
                    <option value="192">192 kg</option>
                    <option value="193">193 kg</option>
                    <option value="194">194 kg</option>
                    <option value="195">195 kg</option>
                    <option value="196">196 kg</option>
                    <option value="197">197 kg</option>
                    <option value="198">198 kg</option>
                    <option value="199">199 kg</option>
                    <option value="200">200 kg</option>
                  </select>
                  Height: {height} cm
                  <select
                    style={{ width: '20px', height: '30px', margin: "8px" }}
                    onChange={this.handleHeight}>
                    <option value="N/A">N/A</option>
                    <option value="30">30 cm</option>
                    <option value="31">31 cm</option>
                    <option value="32">32 cm</option>
                    <option value="33">33 cm</option>
                    <option value="34">34 cm</option>
                    <option value="35">35 cm</option>
                    <option value="36">36 cm</option>
                    <option value="37">37 cm</option>
                    <option value="38">38 cm</option>
                    <option value="39">39 cm</option>
                    <option value="40">40 cm</option>
                    <option value="41">41 cm</option>
                    <option value="42">42 cm</option>
                    <option value="43">43 cm</option>
                    <option value="44">44 cm</option>
                    <option value="45">45 cm</option>
                    <option value="46">46 cm</option>
                    <option value="47"> 47 cm</option>
                    <option value="48">48 cm</option>
                    <option value="49">49 cm</option>
                    <option value="50">50 cm</option>
                    <option value="51">51 cm</option>
                    <option value="52">52 cm</option>
                    <option value="53">53 cm</option>
                    <option value="54">54 cm</option>
                    <option value="55">55 cm</option>
                    <option value="56">56 cm</option>
                    <option value="57">57 cm</option>
                    <option value="58">58 cm</option>
                    <option value="59">59 cm</option>
                    <option value="60">60 cm</option>
                    <option value="61">61 cm</option>
                    <option value="62">62 cm</option>
                    <option value="63">63 cm</option>
                    <option value="64">64 cm</option>
                    <option value="65">65 cm</option>
                    <option value="66">66 cm</option>
                    <option value="67">67 cm</option>
                    <option value="68">68 cm</option>
                    <option value="69">69 cm</option>
                    <option value="70">70 cm</option>
                    <option value="71">71 cm</option>
                    <option value="72">72 cm</option>
                    <option value="73">73 cm</option>
                    <option value="74">74 cm</option>
                    <option value="75">75 cm</option>
                    <option value="76">76 cm</option>
                    <option value="77">77 cm</option>
                    <option value="78">78 cm</option>
                    <option value="79">79 cm</option>
                    <option value="80">80 cm</option>
                    <option value="81">81 cm</option>
                    <option value="82">82 cm</option>
                    <option value="83">83 cm</option>
                    <option value="84">84 cm</option>
                    <option value="85">85 cm</option>
                    <option value="86">86 cm</option>
                    <option value="87">87 cm</option>
                    <option value="88">88 cm</option>
                    <option value="89">89 cm</option>
                    <option value="90">90 cm</option>
                    <option value="91">91 cm</option>
                    <option value="92">92 cm</option>
                    <option value="93">93 cm</option>
                    <option value="94">94 cm</option>
                    <option value="95">95 cm</option>
                    <option value="96">96 cm</option>
                    <option value="97">97 cm</option>
                    <option value="98">98 cm</option>
                    <option value="99">99 cm</option>
                    <option value="100">100 cm</option>
                    <option value="101">101 cm</option>
                    <option value="102">102 cm</option>
                    <option value="103" >103 cm</option>
                    <option value="104">104 cm</option>
                    <option value="105">105 cm</option>
                    <option value="106">106 cm</option>
                    <option value="107">107 cm</option>
                    <option value="108">108 cm</option>
                    <option value="109">109 cm</option>
                    <option value="110">110 cm</option>
                    <option value="111">111 cm</option>
                    <option value="112">112 cm</option>
                    <option value="113">113 cm</option>
                    <option value="114">114 cm</option>
                    <option value="115">115 cm</option>
                    <option value="116">116 cm</option>
                    <option value="117">117 cm</option>
                    <option value="118">118 cm</option>
                    <option value="119">119 cm</option>
                    <option value="120">120 cm</option>
                    <option value="121">121 cm</option>
                    <option value="122">122 cm</option>
                    <option value="123">123 cm</option>
                    <option value="124">124 cm</option>
                    <option value="125"> 125 cm</option>
                    <option value="126">126 cm</option>
                    <option value="127">127 cm</option>
                    <option value="128">128 cm</option>
                    <option value="129">129 cm</option>
                    <option value="130">130 cm</option>
                    <option value="131">131 cm</option>
                    <option value="132">132 cm</option>
                    <option value="133">133 cm</option>
                    <option value="134">134 cm</option>
                    <option value="135">135 cm</option>
                    <option value="136">136 cm</option>
                    <option value="137">137 cm</option>
                    <option value="138">138 cm</option>
                    <option value="139">139 cm</option>
                    <option value="140">140 cm</option>
                    <option value="141">141 cm</option>
                    <option value="142">142 cm</option>
                    <option value="143">143 cm</option>
                    <option value="144">144 cm</option>
                    <option value="145">145 cm</option>
                    <option value="146">146 cm</option>
                    <option value="147">147 cm</option>
                    <option value="148">148 cm</option>
                    <option value="149">149 cm</option>
                    <option value="150">150 cm</option>
                    <option value="151">151 cm</option>
                    <option value="152">152 cm</option>
                    <option value="153">153 cm</option>
                    <option value="154">154 cm</option>
                    <option value="155">155 cm</option>
                    <option value="156">156 cm</option>
                    <option value="157">157 cm</option>
                    <option value="158">158 cm</option>
                    <option value="159">159 cm</option>
                    <option value="160">160 cm</option>
                    <option value="161">161 cm</option>
                    <option value="162">162 cm</option>
                    <option value="163">163 cm</option>
                    <option value="164">164 cm</option>
                    <option value="165">165 cm</option>
                    <option value="166">166 cm</option>
                    <option value="167">167 cm</option>
                    <option value="168">168 cm</option>
                    <option value="169">169 cm</option>
                    <option value="170">170 cm</option>
                    <option value="171">171 cm</option>
                    <option value="172">172 cm</option>
                    <option value="173">173 cm</option>
                    <option value="174">174 cm</option>
                    <option value="175">175 cm</option>
                    <option value="176">176 cm</option>
                    <option value="177">177 cm</option>
                    <option value="178">178 cm</option>
                    <option value="179">179 cm</option>
                    <option value="180">180 cm</option>
                    <option value="181">181 cm</option>
                    <option value="182">182 cm</option>
                    <option value="183">183 cm</option>
                    <option value="184">184 cm</option>
                    <option value="185">185 cm</option>
                    <option value="186">186 cm</option>
                    <option value="187">187 cm</option>
                    <option value="188">188 cm</option>
                    <option value="189">189 cm</option>
                    <option value="190">190 cm</option>
                    <option value="191">191 cm</option>
                    <option value="192">192 cm</option>
                    <option value="193">193 cm</option>
                    <option value="194">194 cm</option>
                    <option value="195">195 cm</option>
                    <option value="196">196 cm</option>
                    <option value="197">197 cm</option>
                    <option value="198">198 cm</option>
                    <option value="199">199 cm</option>
                    <option value="200">200 cm</option>
                    <option value="201">201 cm</option>
                    <option value="202">202 cm</option>
                    <option value="203">203 cm</option>
                    <option value="204">204 cm</option>
                    <option value="205">205 cm</option>
                    <option value="206">206 cm</option>
                    <option value="207">207 cm</option>
                    <option value="208">208 cm</option>
                    <option value="209">209 cm</option>
                    <option value="210">210 cm</option>
                    <option value="211">211 cm</option>
                    <option value="212">212 cm</option>
                    <option value="213">213 cm</option>
                    <option value="214">214 cm</option>
                    <option value="215">215 cm</option>
                    <option value="216">216 cm</option>
                    <option value="217">217 cm</option>
                    <option value="218">218 cm</option>
                    <option value="219">219 cm</option>
                    <option value="220">220 cm</option>
                    <option value="221"> 221 cm</option>
                    <option value="222">222 cm</option>
                    <option value="223">223 cm</option>
                    <option value="224">224 cm</option>
                    <option value="225">225 cm</option>
                    <option value="226">226 cm</option>
                    <option value="227">227 cm</option>
                    <option value="228 cm">228 cm</option>
                    <option value="229 cm">229 cm</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="place"
                  value={place}
                  placeholder="House/Block/Sector"
                  onChange={this.handleChange}
                />
                <input
                  type="text"
                  name="city"
                  value={city}
                  placeholder="Enter City"
                  onChange={this.handleChange}
                />
                <input
                  type="text"
                  name="state"
                  value={state}
                  placeholder="Enter State"
                  onChange={this.handleChange}
                />
                <input
                  type="text"
                  name="pincode"
                  value={pincode}
                  placeholder="Enter Pin Code"
                  onChange={this.handleChange}
                />
              </div>
              <div className="row">
                <input
                  type="file"
                  className="uploadbox"
                  name="file"
                  accept=".jpeg, .png, .jpg"
                  onChange={this.onChangeHandler}
                />
              </div>

              <div className="btncontainer">
                {/* <button onClick={this.handleUpload}><i className="fas fa-check"></i>Update Image </button> */}

                <button type="submit" className="Updatebtn">
                  <i className="fas fa-save"></i>
                  Submit Update
                </button>
              </div>
              <img
                alt="Profile"
                src={this.state.picture}
                style={{ width: "50%" }}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Updatehospitaldetails;
