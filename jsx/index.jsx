var React = require("react");
var ReactDOM = require("react-dom");

var createStore = require("redux").createStore;
var applyMiddleware = require("redux").applyMiddleware; 
var combineReducers = require("redux").combineReducers;

var Provider = require("react-redux").Provider;
var connect = require("react-redux").connect;

var thunk = require("redux-thunk");

// 大人の事情で ES2015 が使えないので、
// map や Object.assign を lodash で代用
var _ = require("lodash");

// HTTP クライアントは SuperAgent を使う
var request = require("superagent");

// thunk ミドルウェアを使う
var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

// アクションを定義
var START_FETCH_PLAYERS = "START_FETCH_PLAYERS";
var SUCCESS_FETCH_PLAYERS = "SUCCESS_FETCH_PLAYERS";
var ERROR_FETCH_PLAYERS = "ERROR_FETCH_PLAYERS";

// プレーヤー一覧の取得開始を表すアクション
function startFetchPlayers() {
  return {
    type: START_FETCH_PLAYERS
  };
}

// プレーヤー一覧の取得成功を表すアクション
function successFetchPlayers(result) {
  return {
    type: SUCCESS_FETCH_PLAYERS,
    players: result
  };
}

// プレーヤー一覧の取得失敗を表すアクション
function errorFetchPlayers() {
  return {
    type: ERROR_FETCH_PLAYERS
  };
}

// Web API を呼び出す非同期アクション
function fetchPlayersAsync() {
  return function(dispatch) {
    dispatch(startFetchPlayers());

    request.get("/api/players")
      .end(function(err, res) {
        if (err) {
          dispatch(errorFetchPlayers());
        } else {
          dispatch(successFetchPlayers(res.body));
        }
      });
  };
}

// プレーヤーの状態を操作する Reducer
function playersReducer(state, action) {
  switch (action.type) {
    case SUCCESS_FETCH_PLAYERS:
      return action.players;
    case ERROR_FETCH_PLAYERS:
      return [];
    default:
      return state || [];
  }
}

// 進捗の状態を操作する Reducer
function progressReducer(state, action) {
  state = state || false;
  switch (action.type) {
    case START_FETCH_PLAYERS:
      return true;
    case SUCCESS_FETCH_PLAYERS:
      return false;
    case ERROR_FETCH_PLAYERS:
      return false;
    default:
      return state;
  }
}

// プレーヤーの行を表示するコンポーネント
var Player = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.player.number}</td>
        <td>{this.props.player.name}</td>
      </tr>
    );
  }
});

// プレーヤー一覧を表示するコンポーネント
var Players = React.createClass({
  players: function() {
    return _.map(this.props.players, function(p) {
      return <Player player={p} />
    });
  },

  render: function() {
    return (
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {this.players()}
        </tbody>
      </table>
    );
  }
});

// 進捗を表示するコンポーネント
var Progress = React.createClass({
  render: function() {
    if (this.props.progress) {
      return (
        <div>取得中...</div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
});

var _MyApp = React.createClass({
  reload: function() {
    this.props.dispatch(fetchPlayersAsync());
  },

  render: function() {
    return (
      <div className="wrapper">
        <button onClick={this.reload}>Reload</button>
        <Progress progress={this.props.progress}/> 
        <Players players={this.props.players}/>
      </div>
    );
  }
});

// connect でラップし、ストアの状態を props に受け取れるようにする
var MyApp = connect(function(state) {
  return {
    players: state.players,
    progress: state.progress,
  };
})(_MyApp);

// ストアに渡す Reducer を作成
var rootReducer = combineReducers({
  players: playersReducer,
  progress: progressReducer
});

// ミドルウェアを組み込んだストアを作成
var store = createStoreWithMiddleware(rootReducer);

ReactDOM.render((
  <Provider store={store}>
    <MyApp />
  </Provider>
  ), document.getElementById("content")
);