import React from 'react';
import nthFib from '../utils/nthFib';

class FibClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { result: nthFib(props.n) };
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
