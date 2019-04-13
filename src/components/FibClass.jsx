import React from 'react';

class FibClass extends React.Component {
  constructor(props) {
    super(props);
    const { benchmark, values } = this.props;
    this.state = { result: benchmark(...values) };
  }

  render() {
    return (
      <>
        <h2>Class Component</h2>
        <table>
          <tbody>
            <tr>
              <td>Result</td>
              <td>{this.state.result}</td>
            </tr>
            <tr>
              <td>Render #</td>
              <td>{this.props.renderNumber}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}

export default FibClass;
