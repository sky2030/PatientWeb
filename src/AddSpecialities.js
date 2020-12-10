import React from "react";
import Navigation from "./Nav";
//import ReactDOM from 'react-dom';
import "./dashboard/dashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router-dom";

const initialState = {
  hospitalcode: "",
  deptcode: "",
  picture: null,
  title: "",
  description: "",
  titleError: "",
  descriptionError: "",
  submitted: false,
};

class AddSpecialities extends React.Component {
  state = initialState;

  validate = () => {
    let titleError = "";
    let descriptionError = "";

    if (!this.state.title) {
      titleError = "****Specialities Title cannot be blank";
    }

    if (!this.state.description) {
      descriptionError = "****Title Description cannot be blank";
    }

    // if (!this.state.email.includes("@")) {
    //   emailError = "****Invalid Email";
    // }
    // if (!this.state.phone) {
    //   phoneError = "****Phone number cannot be blank";
    // }

    if (titleError || descriptionError) {
      this.setState({ titleError, descriptionError });
      return false;
    }

    return true;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { title, description, picture } = this.state;

    const isValid = this.validate();
    if (isValid) {
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("picture", picture);
      axios({
        url: "https://stage.mconnecthealth.com/v1/hospital/speciality",
        method: "POST",
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((resp) => {
          let response = resp.data;
          if (response.code === 200) {
            console.log("Data has been sent to the server successfully");
            alert(response.message);
            this.resetUserInputs();
            this.setState({
              submitted: true,
            });
          } else {
            alert(response.message);
          }
        })
        .catch((Error) => {
          alert(Error);
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

  handleUpload = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("file", this.state.selectedFile);
    data.append("upload_preset", "skyMedi");
    data.append("cloud_name", "skycloud55");

    fetch("https://api.cloudinary.com/v1_1/skycloud55/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.url);
        this.setState({
          picture: data.url,
        });
        console.log(this.state.picture);
      })
      .catch((err) => {
        console.log("error while uploading" + err);
      });
  };

  resetUserInputs = () => {
    this.setState(initialState);
    // this.setState({
    //   hospitalname:'',
    //   code:'',
    //   email:'',
    //   phone:'',
    //   picture:'',
    //   place:'',
    //   Landmark:'',
    //   District:'',
    //   city:'',
    //   state:'',
    //   pincode:''
    // });
  };
  render() {
    if (this.state.submitted) {
      return <Redirect to="/HospitalSpeciality" />;
    }
    return (
      <div className="Appcontainer">
        <Navigation />
        <div className="adddept">
          <div className="backarrow">
            {" "}
            <Link to="/HospitalSpeciality">
              <i className="fas fa-arrow-left"></i>
            </Link>
          </div>
          <h2>Add Specialities</h2>

          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <label>Specialities Title:</label>
              <input
                type="text"
                value={this.state.title}
                name="title"
                placeholder="Enter Specialities Title"
                onChange={this.handleChange}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.titleError}
              </div>
            </div>

            <div className="row">
              <label>Title Description:</label>
              <input
                type="text"
                value={this.state.description}
                name="description"
                placeholder="Enter Title Description"
                onChange={this.handleChange}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.descriptionError}
              </div>
            </div>
            <div className="row">
              <input
                type="file"
                className="uploadbox"
                name="file"
                accept=".jpeg, .png, .jpg"
                //onChange={this.onChangeHandler}
                onChange={this.onFileHandler}
              />
            </div>
            <div className="btncontainer">
              {/* <button onClick={this.handleUpload}>
              <i className="fas fa-upload"></i>Upload Image
              </button> */}

              <button onClick={this.resetUserInputs}>
                <i className="fas fa-save"></i>Reset
              </button>
              {/* <input type='submit' value='Save' />  */}
              <button type="submit">
                <i className="fas fa-save"></i>Save
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }
}
export default AddSpecialities;
