import React from 'react';

class Benchmark extends React.Component {
  constructor(props) {
    super(props);
    this.state = { renderNumber: 1 };
    this.increaseRenderNumber = this.increaseRenderNumber.bind(this);
  }

  componentDidMount() {
    this.increaseRenderNumber();
  }

  increaseRenderNumber() {
    if (this.state.renderNumber <= this.props.totalRenders) {
      this.setState(
        state => ({ renderNumber: state.renderNumber + 1 }),
        () => {
          setTimeout(this.increaseRenderNumber, 0);
        }
      );
    } else {
      this.props.stopBenchmark();
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return <Component renderNumber={this.state.renderNumber} {...rest} />;
  }
}

export default Benchmark;
