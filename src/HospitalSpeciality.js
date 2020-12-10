import React from "react";
import Navigation from "./Nav";
import "./dashboard/dashboard.css";
import addicon from "./img/department.png";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
//import Spinner from "./img/Spinner.gif";
import Spinner from "./img/Spinnergrey.gif";

const initialState = {
  hospitalcode: "",
  deptcode: "",
  departmentname: "",
  description: "",
  picture: "",
  departmentnameError: "",
  descriptionError: "",
  selectedFile: null,
  submitted: false,
};

class HospitalSpeciality extends React.Component {
  state = initialState;

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount = () => {
    this.SpecialityData();
  };

  SpecialityData = () => {
    axios
      .get("https://stage.mconnecthealth.com/v1/hospital", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response);
        const data = response.data.data.specialities;
        this.setState({ posts: data });
        console.log("Data has been received!!" + data);
      })
      .catch(() => {
        alert("Error retrieving data!!");
      });
  };

  DeleteSpeciality = (id) => {
    axios({
      url: `https://stage.mconnecthealth.com/v1/hospital/speciality/${id}`,
      method: "delete",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((data) => {
        if (data.data.code === 200) {
          this.setState({
            submitted: true,
          });
          alert(data.data.message);
        } else {
          alert(data.data.message);
        }
      })
      .catch((Error) => {
        console.log(Error);
        alert(Error)
      });


  };

  render() {
    if (localStorage.getItem("token") == null) {
      return <Redirect to="/" />;
    }

    const { posts } = this.state;

    const BASE = "https://stage.mconnecthealth.com";

    const SpecialityList = posts.length ? (
      posts.map((post) => {
        return (
          <div key={post.id} className="specialitycards">
            <Link
              to={{
                pathname: "/Speciality",
                Speciality: { post },
              }}
            >
              <img
                className="specialityIMG"
                src={
                  post.picture === "" ? addicon : `${BASE}${post.picture.url}`
                }
                alt="Speciality"
              />{" "}
            </Link>
            <p>
              {" "}
              {post.title}{" "}
              <button onClick={() => this.DeleteSpeciality(post.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </p>
          </div>
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

    return (
      <div className="Appcontainer">
        <Navigation />

        <div className="Speciality">{SpecialityList}</div>
        <div className="add_departmet">
          <Link to="/AddSpecialities">
            <i className="fas fa-plus"></i> Add Specialities
          </Link>
        </div>
      </div>
    );
  }
}
export default HospitalSpeciality;
