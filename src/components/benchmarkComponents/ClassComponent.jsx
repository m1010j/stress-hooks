import React from 'react';

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    const { benchmark, args } = this.props;
    this.state = { result: benchmark(...args) };
  }

  render() {
    return (
      <>
        <h2>ClassComponent</h2>
        <div>
          <p>Result: {this.state.result}</p>
          <p>Render #: {this.props.renderNumber}</p>
        </div>
      </>
    );
  }
}

export default ClassComponent;
