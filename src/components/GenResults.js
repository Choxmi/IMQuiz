import React from 'react';
function Result(props) {
<div>
  <div>
  You got {props.correctAnswers} correct out of {props.questionTotal}
  </div>
  <video id="background-video" autoPlay="autoPlay" controls="controls">
    <source src="vid.mp4" type="video/mp4"/>
  </video>
  <button onClick={props.quizRender}>IQ Questions</button>
</div>
}
GenResults.propTypes = {
  questionTotal: React.PropTypes.string.isRequired,
  correctAnswers: React.PropTypes.string.isRequired,
  quizRender: React.PropTypes.func.isRequired,
  resultState: React.PropTypes.string.isRequired
};

export default Result;
