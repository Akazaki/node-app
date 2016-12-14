import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Index extends Component {
  render() {
    return (
      <div>
        <h1>ログインページです</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);