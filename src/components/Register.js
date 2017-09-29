import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Question from '../components/Question';
import QuestionCount from '../components/QuestionCount';
import AnswerOption from '../components/AnswerOption';
import { WithContext as ReactTags } from 'react-tag-input';
import * as firebase from 'firebase';


var _school,_team,_members,_contact;

function Register(props) {

  function setRegVariables(e,prefix){
    if(prefix==="team"){
      _team = e.target.value;
      var ref = firebase.database().ref("Teams/");
      ref.once("value")
        .then(function(snapshot) {
          var b = snapshot.child(_team).exists();
          console.log("Existance : "+b);
          if(b){
            props.duplicateTeam("lblshow");
          }else{
            props.duplicateTeam("lblhide");
          }
        });
    }if(prefix==="school"){
      _school = e.target.value;
    }if(prefix==="members"){
      _members = e.target.value;
    }if(prefix==="contact"){
      _contact = e.target.value;
    }
  }

  function clickHandler(){
    props.proceed(_team,_school,_members,_contact);
  }

  return (
    <ReactCSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
    <div className="form-reg">
    <div>
    <h1>WELCOME!!!</h1>
    </div>
    </div>
    <div>
        <label className="form-label">Team name</label>
        <input type="text" className="form-input" onChange={evt => setRegVariables(evt,"team")}/>
    </div>
        <label className={props.alert}>Team already exists</label>
    <div>
        <label className="form-label">School</label>
        <input type="text" className="form-input" onChange={evt => setRegVariables(evt,"school")}/>
    </div>
    <div>
        <label className="form-label">Members (separate using <strong> | </strong> character)</label>
        <input type="text" className="form-input" onChange={evt => setRegVariables(evt,"members")}/>
    </div>
    <div>
        <label className="form-label">School contact</label>
        <input type="text" className="form-input" onChange={evt => setRegVariables(evt,"contact")}/>
    </div>
    <div className="wrapper">
        <button onClick={clickHandler} className="form-button">Start</button>
    </div>
    </ReactCSSTransitionGroup>
  );
}

Register.propTypes = {
  answer: React.PropTypes.string.isRequired,
  answerOptions: React.PropTypes.array.isRequired,
  alert: React.PropTypes.string.isRequired,
  questionId: React.PropTypes.number.isRequired,
  questionTotal: React.PropTypes.number.isRequired,
  proceed: React.PropTypes.func.isRequired,
  duplicateTeam: React.PropTypes.func.isRequired
};

export default Register;
