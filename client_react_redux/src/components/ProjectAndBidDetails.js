import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import * as API from '../api/API';
import cookie from 'react-cookies';
import {connect} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './Navbar';
import { Container, Block, Row, Column, Spacer } from 'react-email-components'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { withStyles } from 'material-ui/styles';
import FaceIcon from 'material-ui-icons/Face';
import PeopleIcon from 'material-ui-icons/People';
import TimelineIcon from 'material-ui-icons/Timeline';
import AttachMoneyIcon from 'material-ui-icons/AttachMoney';
import DescriptionIcon from 'material-ui-icons/Description';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SentimentDissatisfiedIcon from 'material-ui-icons/SentimentDissatisfied';

class ProjectAndBids extends Component {

  constructor (props) {
      super(props)
      console.log("Project details constructor is called");
      this.state = {
        projectDetails: this.props.pick.projectDetails,
        userProfilesWithBids: this.props.pick.userProfilesWithBids,
        projectId: this.props.pick.projectId,
        username: this.props.pick.username,
        message: ''
      };
  }

  componentDidMount() {
    console.log("Profile did mount called ... ");
    console.log("project id is : " + this.props.pick.projectId);
    console.log("project id state : " + this.state.projectId);
    if(cookie.load('token') === undefined) {
      // Redirect to login page if cookie not found
      this.props.history.push('/');
    }
    var status;
    if (localStorage.getItem('projectId')) {
      API.projectAndBids({projectId: localStorage.getItem('projectId')})
        .then((res) => {
          status = res.status;
          try {
            return res.json();
          } catch(error) {
            console.log("Error in response: " + error);
          }
        }).then((json) => {
          console.log("project and bids info: " + JSON.stringify(json));
          if (status === 201) {
            localStorage.setItem('projectDetails', JSON.stringify(json.projectDetails));
            localStorage.setItem('userProfilesWithBids', JSON.stringify(json.userProfilesWithBids));
            this.props.usersInfoWithBids(json.userProfilesWithBids);
            this.props.projectInfo(json.projectDetails);

            this.setState({
              projectDetails: json.projectDetails,
              userProfilesWithBids: json.userProfilesWithBids,
              message: 'Got project details and user profiles with bids'
            });
          } else if (status === 401) {
            this.setState({
              message: "Something went wrong. Try again !!!"
            });
          } else {
            this.setState({
              message: "Something went wrong. Try again !!!"
            });
          }
        });
    } else {
      this.setState({message: "Cannot get project details"});
    }
  }

  render() {
      let BidForm = localStorage.getItem('username') ===
                        this.props.pick.projectDetails.username
                              ? "" : <Bid bidrange={{low: this.props.pick.projectDetails.budgetLow,
                                                    high: this.props.pick.projectDetails.budgetHigh}}/>
      return (
        <MuiThemeProvider>
          <div className="container-fluid">
            <div className="col-md-12">
                <img src="/fl-logo.svg" height="80" width="120" className="left-block" alt="logo"/>
            </div>
            <div className="col-md-12 ">
                <Navbar/>
              <div className="panel panel-primary">
                <div className="panel-body">
                  <h2 className="text-center"><b>*** PROJECT DETAILS ***</b></h2>
                  <DescriptionIcon style={{width:50, height:50}}/>
                  <hr/>
                  <h4><i>EMPLOYER:</i></h4>
                  <p><i>{this.props.pick.projectDetails.name}</i></p>
                  <hr/>

                  <h4><i>CONTACT:</i></h4>
                  <p><i>{this.props.pick.projectDetails.contact}</i></p>
                  <hr/>

                  <h4><i>PROJECT TITLE:</i></h4>
                  <p><i>{this.props.pick.projectDetails.title}</i></p>
                  <hr/>

                  <h4><i>PROJECT DESCRIPTION:</i></h4>
                  <p>{this.props.pick.projectDetails.description}</p>
                  <hr/>

                  <h4><i>LOWER BUDGET:</i></h4>
                  <p>{this.props.pick.projectDetails.budgetLow}</p>
                  <hr/>

                  <h4><i>HIGHER BUDGET:</i></h4>
                  <p>{this.props.pick.projectDetails.budgetHigh}</p>
                  <hr/>

                  <h4><i>SKILLS REQUIRED:</i></h4>
                  <p>{this.props.pick.projectDetails.skills}</p>
                  <hr/>
                  {BidForm}
                </div>
              </div>
              <div className="panel panel-primary">
                <div className="panel-body">
                  <div className="panel-body">
                      <h2 className="text-center"><b>*** BIDDERS DETAILS ***</b></h2>
                      <hr></hr><br/>
                      <UserProfiles userProfiles={this.props.pick.userProfilesWithBids}/>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </MuiThemeProvider>
      );
    }
}

class UserProfiles extends Component {

  render () {
    let userProfiles = <h2><i>
                        "No bidders yet"
                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <SentimentDissatisfiedIcon style={{width:50, height:50}}/>
                      </i></h2>;
    if (this.props.userProfiles.length != 0) {
        userProfiles = this.props.userProfiles.map((userProfile, index) => {
            return <div key={index} className="row"><ProfileCreator userProfile={userProfile}/></div>
      });
    }
    return (
      <div className="container-fluid">
        <h3><i><b>
          <PeopleIcon style={{width:50, height:50}}/>
          <span>
            &nbsp;&nbsp;&nbsp;
          </span>
          TOTAL BIDDERS: {this.props.userProfiles.length}
        </b></i></h3>
        <br/><hr/>
        {userProfiles}
      </div>
    );
  }
}

class ProfileCreator extends Component {
  constructor (props) {
        super(props)
        this.state = {
          message: '',
          bids: JSON.parse(localStorage.getItem("userProfilesWithBids")),
          acceptButton: ''
        };
  }

  notify = (message) => {
    toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000
    });
  }

  notifySuccess = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000
    });
  }

  handleAccept() {
    var status;
    console.log("employee ID: " + this.props.userProfile.userId.userId);
    var employeeId = this.props.userProfile.userId.userId;
    var projectId = localStorage.getItem('projectId');
    API.acceptBid(projectId, employeeId)
        .then((res) => {
            status = res.status;
            return res.json();
        }).then((json) => {
            if (status === 201) {
                this.setState({
                    message: json.message
                });
                notifySuccess(json.message);
            } else if (status === 200) {
                this.setState({
                    message: json.message
                });
                notifySuccess(json.message);
            } else if (status === 401) {
                const message = "Something went wrong. Try signing up again !!!"
                this.setState({
                    message: message
                });
                notify(message);
            } else {
                const message = "Server error... Try signing up later !!!"
                this.setState({
                    message: message
                });
                notify(message);
            }
    });
  }

  componentDidMount() {
    console.log("did mount called: " + this.props.userProfile.userId.userId);
    let prj_details = JSON.parse(localStorage.getItem('projectDetails'));
    let acceptButton = localStorage.getItem('username') === prj_details.username ? <button className="btn btn-success"
                                                                                          type="button"
                                                                                          id="hireButton"
                                                                                          value={this.props.userProfile.userId.userId}
                                                                                          onClick={this.handleAccept.bind(this)}>
                                                                                      Hire
                                                                                    </button>: "";
    this.setState({
      acceptButton: acceptButton
    });
  }

  render () {
    return (
      <div className="col">
        <FaceIcon color="primary" style={{ fontSize: 30 }}/>
        <h4><i>Name:</i></h4>
        <p>{this.props.userProfile.name}</p>
        <hr/>
        <h4><i>Contact:</i></h4>
        <p>{this.props.userProfile.contact}</p>
        <hr/>
        <h4><i><b>Bid Amount:</b></i></h4>
        <p>{this.props.userProfile.bidAmount}</p>
        <hr/>
        <h4><i><b>Time Estimation in Days:</b></i></h4>
        <p>{this.props.userProfile.periodInDays}</p>
        <br/><hr/>
        {this.state.acceptButton}
        <br/><hr/><hr/>
        <div className="form-group">
          <ToastContainer />
        </div>
      </div>
    );
  }
}

class Bid extends Component {
  constructor (props) {
      super(props)
      this.state = {
        bidAmount: '',
        periodInDays: '',
        username: localStorage.getItem('username'),
        projectId: localStorage.getItem('projectId')
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleBidAmount = this.handleBidAmount.bind(this);
      this.handlePeriodInDays = this.handlePeriodInDays.bind(this);
      this.notify = this.notify.bind(this);
      this.notifySuccess = this.notifySuccess.bind(this);
  }

  notify = (message) => {
    toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000
    });
  }

  notifySuccess = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000
    });
  }

  handleBidAmount = (event) => {
    var amount = parseInt(String, event.target.value);
    this.setState({bidAmount: event.target.value});
  }

  handlePeriodInDays = (event) => {
    var days = parseInt(String, event.target.value);
    this.setState({periodInDays: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.state.bidAmount = parseInt(this.state.bidAmount);
    this.props.bidrange.low = parseInt(this.props.bidrange.low);
    this.props.bidrange.high = parseInt(this.props.bidrange.high);
    console.log("lower: " + typeof this.props.bidrange.low);
    console.log("higher: " + typeof this.props.bidrange.high);
    console.log("bidAMount: " + typeof this.state.bidAmount);
    console.log("lower: " + this.props.bidrange.low);
    console.log("higher: " + this.props.bidrange.high);
    console.log("bidAMount: " + this.state.bidAmount);

    if (isNaN(this.state.bidAmount) || isNaN(this.state.periodInDays)) {
      this.notify("Input cannot be non numeric");
    } else if (this.state.bidAmount <= 0 || this.state.periodInDays <= 0) {
      this.notify("** Bid Amount **  or ** Time in Days ** cannot be 0 or -ve");
    } else if (this.state.bidAmount < this.props.bidrange.low || this.state.bidAmount > this.props.bidrange.high) {
      this.notify("Bid out of range -:- Lower Bid: $"
                  + this.props.bidrange.low
                  + "  Higher Bid: $"
                  + this.props.bidrange.high);
    } else {
      var status;
      API.userBid(this.state)
          .then((res) => {
              status = res.status;
              try {
                  return res.json();
              }
              catch(error) {
                console.log("Error in response: " + error);
              }
          }).then((json) => {
              if (status === 201) {
                  this.notifySuccess(json.message);
              } else if (status === 401) {
                  this.notify("Failed to close the project. Try again !!!");
              } else {
                  this.notify("Server error... Try again later !!!");
              }
          });
      }
  }

  render () {
    return (
      <div className="container-fluid">
        <div className="row justify-content-md-center">
          <div className="panel panel-primary">
            <div className="panel-body">
              <form>
                <div className="form-group">
                    <label htmlFor="BidAmount">
                      <b><AttachMoneyIcon color="primary" style={{ fontSize: 10 }}/></b>
                      <span>&nbsp;Amount: &nbsp;</span>
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="BidAmount"
                        placeholder="Amount ($)"
                        required="required"
                        value={this.state.bidAmount}
                        onChange={this.handleBidAmount}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="PeriodInDays">
                      <b><TimelineIcon color="primary" style={{ fontSize: 10 }}/></b>
                      <span>&nbsp;&nbsp;Estimated Time in Days &nbsp;</span>
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="PeriodInDays"
                        placeholder="Time in Days"
                        required="required"
                        value={this.state.periodInDays}
                        onChange={this.handlePeriodInDays}
                    />
                </div>

                <div className="form-group">
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={this.handleSubmit}>
                            Bid
                    </button>
                    <hr></hr>
                </div>
                <div className="form-group">
                    <ToastContainer />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      pick: state.reducers
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
      projectInfo: (projectDetails) => {
          dispatch({
              type: "PROJECT_DETAILS",
              payload : {projectDetails:projectDetails}
          });
      },
      usersInfoWithBids: (userProfilesWithBids) => {
          dispatch({
              type: "USER_PROFILES_WITH_BIDS",
              payload : {userProfilesWithBids:userProfilesWithBids}
          });
      },
      rehydrate: (persistState) => {
          dispatch({
              type: "REHYDRATE",
              payload : {persistState:persistState}
          });
      }
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ProjectAndBids));
