import React, { Component } from 'react';
import update from 'react-addons-update';
import quizQuestions from './api/quizQuestions';
import iqQuizQuestions from './api/iqQuizQuestions';
import Quiz from './components/Quiz';
import IQQuiz from './components/IQQuiz';
import Result from './components/Result';
import Register from './components/Register';
import logo from './svg/logo.svg';
import './App.css';
import * as firebase from 'firebase';

var totalCorrect=0;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyB6ywsEUxZw58MCapcdfOG-OyeduTf_bbY",
  authDomain: "im-quiz.firebaseapp.com",
  databaseURL: "https://im-quiz.firebaseio.com",
  projectId: "im-quiz",
  storageBucket: "im-quiz.appspot.com",
  messagingSenderId: "984431897593"
};
var fire = firebase.initializeApp(config);
var overall=null;
var overallRef = fire.database().ref('Scores/');
overallRef.on('value', function(snapshot) {
  console.log(snapshot.val());
  overall = snapshot.val();
});
var today = new Date();
var dd = today.getDate();
var dailyScore = null;
var dailyRef = fire.database().ref('Daily/'+dd+'/');
dailyRef.on('value', function(snapshot) {
  console.log(snapshot.val());
  dailyScore = snapshot.val();
});
var _team,_school,_members,_contact;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {
        Opt1: 0,
        Opt2: 0,
        Opt3: 0,
        Correct: 0
      },
      result: '',
      questions: quizQuestions,
      iqQuiz: 0,
      alert: "lblhide",
      init: 0,
      finalscore: 0,
      first: '',
      second: '',
      third: ''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.setIQQuiz = this.setIQQuiz.bind(this);
    this.setQuiz = this.setQuiz.bind(this);
    this.duplicateTeam = this.duplicateTeam.bind(this);
  }

  componentWillMount() {
    const shuffledAnswerOptions = quizQuestions.map((question) => this.shuffleArray(question.answers));
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if(this.state.iqQuiz===1){
      if (this.state.questionId < iqQuizQuestions.length) {
          setTimeout(() => this.setNextQuestion(), 300);
      } else {
          setTimeout(() => this.setResults(this.getResults()), 300);
      }
    }else {
      if (this.state.questionId < quizQuestions.length) {
          setTimeout(() => this.setNextQuestion(), 300);
      } else {
          setTimeout(() => this.setResults(this.getResults()), 300);
      }
    }
  }

  setIQQuiz(){
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    const shuffledAnswerOptions = iqQuizQuestions.map((question) => this.shuffleArray(question.answers));
    var iqQuizState = this.state.iqQuiz +1;
      this.setState({
        counter: 0,
        questionId: 1,
        question: iqQuizQuestions[0].question,
        answerOptions: shuffledAnswerOptions[0],
        answer: '',
        answersCount: {
          Opt1: 0,
          Opt2: 0,
          Opt3: 0,
          Correct: 0
        },
        result: '',
        questions: iqQuizQuestions,
        iqQuiz: iqQuizState
      });
  }

  setUserAnswer(answer) {
    const updatedAnswersCount = update(this.state.answersCount, {
      [answer]: {$apply: (currentValue) => currentValue + 1}
    });

    this.setState({
        answersCount: updatedAnswersCount,
        answer: answer
    });
  }

  setQuiz(team,school,members,contact) {
    _team=team;
    _school=school;
    _members=members;
    _contact=contact;

    fire.database().ref('Teams/'+_team+'/').set({
        Team: _team,
        School: _school,
        members: _members,
        contact: _contact
    });

    this.setState({
        init: 1
    });
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    var arr;
    if(this.state.iqQuiz===1){
      arr = iqQuizQuestions[counter];
    }else{
      arr = quizQuestions[counter];
    }

    this.setState({
        counter: counter,
        questionId: questionId,
        question: arr.question,
        answerOptions: arr.answers,
        answer: ''
    });
  }

  checkOverall(val){
    if(overall===null){
      for (var j = 1; j < 4; j++) {
        fire.database().ref('Scores/'+j+'/').set({
          Date : Date(),
          Points : 0,
          School : _school,
          Team : _team
        });
      }
    }

    for (var i = 1; i < overall.length; i++) {
        if(val > overall[i].Points){
          return i;
        }
    }
    return null;
  }

  checkDaily(val){
    if(dailyScore===null){
      for (var i = 1; i < 4; i++) {
        fire.database().ref('Daily/'+dd+'/'+i+'/').set({
          Points : 0,
          School : _school,
          Team : _team
        });
      }
    }

    for (var i = 1; i < dailyScore.length; i++) {
        if(val > dailyScore[i].Points){
          return i;
        }
    }
    return;
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);
    totalCorrect = totalCorrect + this.state.answersCount.Correct;
    console.log("Total correct : "+totalCorrect);
    this.setState({
      finalscore : totalCorrect
    });
    if(this.state.iqQuiz===2){
      var place = this.checkOverall(totalCorrect);
      if(place!=null){
        var overall_dup = overall;
        if(place===1){
          fire.database().ref('Scores/2/').set({
            Date : overall[1].Date,
            Points : overall[1].Points,
            School : overall[1].School,
            Team : overall[1].Team
          });
          fire.database().ref('Scores/3/').set({
            Date : overall_dup[2].Date,
            Points : overall_dup[2].Points,
            School : overall_dup[2].School,
            Team : overall_dup[2].Team
          });
        }if(place===2){
          fire.database().ref('Scores/3/').set({
            Date : overall[2].Date,
            Points : overall[2].Points,
            School : overall[2].School,
            Team : overall[2].Team
          });
        }

      fire.database().ref('Scores/'+place+'/').set({
        Date : Date(),
        Points : totalCorrect,
        School : _school,
        Team : _team
      });
    }

    var daily = this.checkDaily(totalCorrect);
    if(daily!=null){
      var dailyScore_dup = dailyScore;
      if(daily===1){
        fire.database().ref('Daily/'+dd+'/2/').set({
          Points : dailyScore[1].Points,
          School : dailyScore[1].School,
          Team : dailyScore[1].Team
        });
        fire.database().ref('Daily/'+dd+'/3/').set({
          Points : dailyScore_dup[2].Points,
          School : dailyScore_dup[2].School,
          Team : dailyScore_dup[2].Team
        });
      }if(daily===2){
        fire.database().ref('Daily/'+dd+'/3/').set({
          Points : dailyScore[2].Points,
          School : dailyScore[2].School,
          Team : dailyScore[2].Team
        });
      }

    dailyRef.child(daily).set({
      Points : totalCorrect,
      School : _school,
      Team : _team
    });
  }
    }
    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }

  duplicateTeam(char){
    this.setState({
      alert: char,
      first: overall[1].School,
      second: overall[2].School,
      third: overall[3].School
     });
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={this.state.questions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderRegister() {
    return (
      <Register
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        alert={this.state.alert}
        questionTotal={this.state.questions.length}
        duplicateTeam={this.duplicateTeam}
        proceed={this.setQuiz}
      />
    );
  }

  renderResult() {
    return (
      <Result quizResult={this.state.result}
              questionTotal={this.state.questions.length}
              correctAnswers={this.state.answersCount.Correct}
              quizRender={this.setIQQuiz}
              resultState={this.state.iqQuiz}
              finalscore={this.state.finalscore}
              first={this.state.first}
              second={this.state.second}
              third={this.state.third}
              />
    );
  }

  render() {
    const { tags, suggestions } = this.state;
    if(this.state.init===0){
      return(
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>IM Quiz 2017</h2>
          </div>
          {this.renderRegister()}
          <div className="filler">
          </div>
        </div>
      );
    }
    if(this.state.result){
      return(
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>IM Quiz 2017</h2>
          </div>
          {this.renderResult()}
          <div className="filler">
          </div>
        </div>
      );
    }else{
      return(
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>IM Quiz 2017</h2>
          </div>
          {this.renderQuiz()}
          <div className="filler">
          </div>
        </div>
      );
    }
  }

}

export default App;
