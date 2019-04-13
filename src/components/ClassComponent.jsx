import React from 'react';

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    const { benchmark, values, catchRuntimeError } = this.props;
    let result;
    try {
      result = benchmark(...values);
    } catch (error) {
      catchRuntimeError(error.message);
    }
    this.state = { result: result };
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

export default ClassComponent;
