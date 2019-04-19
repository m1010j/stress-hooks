import React from 'react';

import Modal from './Modal';

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
    if (this.state.renderNumber < this.props.totalRenders) {
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
    const { component: Component, handleCloseModal, ...rest } = this.props;
    return (
      <Modal handleCloseModal={handleCloseModal}>
        <Component renderNumber={this.state.renderNumber} {...rest} />
      </Modal>
    );
  }
}

export default Benchmark;
