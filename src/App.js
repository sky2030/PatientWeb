import React from "react";
import Footer from "./Footer";
import Alldepartment from "./Alldepartment";
import Doctorlist from "./Doctorlist";
import Dashboard from "./dashboard/Dashboard";
import PatientProfile from "./PatientProfile";
import UpdatePatientProfile from "./UpdatePatientProfile";
import Contact from "./Contact";
import Alltransaction from "./Alltransaction";
import splash from "./splash";
import Login from "./Login";
import HospitalSpeciality from "./HospitalSpeciality";
import AddSpecialities from "./AddSpecialities";
import Speciality from "./Speciality";
import ForgetPassword from './ForgetPassword'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Allhospital from './AllHospitals'
import Allappointment from './UpcomingAppointment'
import ReportScreen from './Report/Reports'
import AddReportScreen from './Report/AddReport'
import UpdateReportScreen from './Report/UpdateReport'
import FamilyScreen from './MyFamily'
import AddFamily from './AddFamily'
import FamilyDetail from './FamilyDetail'
import ReportAppointment from './Report/ReportAppointment'
import AddReportAppointment from './Report/AddReportAppointment'
import Prescription from './Prescription/history'
import PrescriptionAppointment from './Prescription/Appointment'
import RazorPayment from './Payment'
import DoctorBookingSLot from './DoctorBookingSlot'


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={splash} />
          <Route path="/Login" component={Login} />
          <Route path="/Alldepartment" component={Alldepartment} />
          <Route path="/Dashboard" component={Dashboard} />
          <Route path="/Doctorlist" component={Doctorlist} />
          <Route path="/PatientProfile" component={PatientProfile} />
          <Route path="/Speciality" component={Speciality} />
          <Route path="/ForgetPassword" component={ForgetPassword} />
          <Route path="/UpdateProfile" component={UpdatePatientProfile} />
          <Route path="/Contact" component={Contact} />
          <Route path="/Transactions" component={Alltransaction} />
          <Route path="/HospitalSpeciality" component={HospitalSpeciality} />
          <Route path="/AddSpecialities" component={AddSpecialities} />
          <Route path="/Allhospital" component={Allhospital} />
          <Route path="/Allappointment" component={Allappointment} />
          <Route path="/Reports" component={ReportScreen} />
          <Route path="/AddReports" component={AddReportScreen} />
          <Route path="/UpdateReports" component={UpdateReportScreen} />
          <Route path="/family" component={FamilyScreen} />
          <Route path="/addfamily" component={AddFamily} />
          <Route path="/familydetail" component={FamilyDetail} />
          <Route path="/AppointmentReport" component={ReportAppointment} />
          <Route path="/AddReportAppointment" component={AddReportAppointment} />
          <Route path="/PrescriptionHistory" component={Prescription} />
          <Route path="/Prescription" component={PrescriptionAppointment} />
          <Route path="/payment" component={RazorPayment} />
          <Route path="/DoctorBookingSLot" component={DoctorBookingSLot} />




        </Switch>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
