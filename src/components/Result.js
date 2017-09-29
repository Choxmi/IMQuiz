import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function Result(props) {

    function renderGenQuiz() {
      return (
      <div>
        <div className="form-reg">
        <label className="lblshow">First phase score : {props.correctAnswers} / {props.questionTotal}     </label>
        <button onClick={props.quizRender} className="form-button">Proceed</button>
        </div>
        <video id="background-video" autoPlay="autoPlay" controls="controls" className="centerdiv">
          <source src="vid.mp4" type="video/mp4"/>
        </video>
      </div>
    );
  }

  function renderIQQuiz() {
    return (
    <div className="form-reg">
      <div>
      <h1 className="lblshow">Second phase score : {props.correctAnswers} / {props.questionTotal}</h1>
      </div>
      <img id="background-image" className="centerdiv" src="final.png" />
      <button onClick={props.quizRender} className="form-button">Proceed</button>
    </div>
  );
}

  function renderFinQuiz() {
    return(
      <div>
      <div id="wrapperz">
      <div className="thanks">
      <b>THANK YOU!!!</b>
      </div>
      <div className="thanks">
      <b>You Scored {props.finalscore} Points</b>
      </div>

      <div id="c1">
        <img src="first.png" width="240px" className="centerdiv"/>
      </div>
      <div id="c2">
        <img src="second.png" width="240px" className="centerdiv"/>
      </div>
      <div id="c3">
        <img src="third.png" width="240px" className="centerdiv"/>
      </div>
      <div className="bottomer">
      <div id="c1">
        <div className="placeholder-one-backup">
        </div>
        <div className="placeholder-one">
          <b>{props.first}</b>
        </div>
        <div className="placeholder-one-backup">
        </div>
      </div>
      <div id="c2">
        <div className="placeholder-two-backup">
        </div>
        <div className="placeholder-two">
          <b>{props.second}</b>
        </div>
        <div className="placeholder-two-backup">
        </div>
      </div>
      <div id="c3">
        <div className="placeholder-three-backup">
        </div>
        <div className="placeholder-three">
          <b>{props.third}</b>
        </div>
        <div className="placeholder-three-backup">
        </div>
      </div>
      </div>
      </div>
      </div>
  );
  }

  if(props.resultState===0){
    return renderGenQuiz();
  }if(props.resultState===1){
    return renderIQQuiz();
  }else {
    return renderFinQuiz()
  }
}

Result.propTypes = {
  quizResult: React.PropTypes.string.isRequired,
  questionTotal: React.PropTypes.string.isRequired,
  correctAnswers: React.PropTypes.string.isRequired,
  quizRender: React.PropTypes.func.isRequired,
  resultState: React.PropTypes.string.isRequired,
  finalscore: React.PropTypes.string.isRequired,
  first: React.PropTypes.string.isRequired,
  second: React.PropTypes.string.isRequired,
  third: React.PropTypes.string.isRequired
};

export default Result;
