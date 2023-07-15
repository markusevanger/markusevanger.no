import React from 'react';

class ScrollTeller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tall: 0};
  }

  oekTall() {
    this.setState({tall: this.state.tall + 1});
  }

  senkTall() {
    this.setState({tall: this.state.tall - 1});
  }

  render() {
    return (
      <div onWheel={ event => {
        if (event.nativeEvent.wheelDelta > 0) {
          this.oekTall();
          console.log("opp")
        } else {
          this.senkTall();
        }
      }}>
        <h1>{this.state.tall}</h1>
      </div>
    );
  }
}

export default ScrollTeller;