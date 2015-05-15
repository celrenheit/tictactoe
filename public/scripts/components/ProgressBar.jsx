import React from 'react'

export default class ProgressBar extends React.Component {

  render() {
    let percent = +this.props.percent;
    if (percent < 0) {percent = 0};
    if (percent > 100) {percent = 100};

    let style = {
      backgroundColor: this.props.color || 'rgba(0,0,0,0.6)',
      width: percent + '%',
      transition: "width 400ms",
      height: this.props.height || 10,
      borderRadius: 3,
      transitionTimingFunction: "ease-in-out"
    };

    let container = {
      margin: "0 auto",
      width: 150,
      border: "1px solid "+ (this.props.borderColor || "rgba(0,0,0,0.2)"),
      borderRadius: 3
    }
    return (
      <div className="progressbar-container" style={container}>
        <div className="progressbar-progress" style={style}>{this.props.children}</div>
      </div>
    );
  }

}