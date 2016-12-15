var React = require("react");
var ReactDOM = require("react-dom");
var createStore = require("redux").createStore;
var applyMiddleware = require("redux").applyMiddleware; 
var combineReducers = require("redux").combineReducers;

var Router = require('react-router'); 
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

//var Redux_Router = require("react-router-redux");
var reduxReactRouter = require("redux-router").reduxReactRouter;
var routerStateReducer = require("redux-router").routerStateReducer;
var createElement = require("redux-router").createElement;
var ReduxRouter = require("redux-router").ReduxRouter;

var Provider = require("react-redux").Provider;
var connect = require("react-redux").connect;
var thunk = require('redux-thunk').default;
var _ = require("lodash");
var request = require("superagent");

// thunk ミドルウェアを使う
var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

// アクションを定義
var START = "START";
var TEST = "TEST";
var DELETE = "DELETE";
var ERROR = "ERROR";

// プレーヤー一覧の取得開始を表すアクション
function startFetchPlayers() {
  return {
    type: START
  };
}

function testResult(result) {
  return {
  	// state
    type: TEST,
    test: result // 返値
  };
}

// 削除
function removeResult() {
  return {  
    type: DELETE,
    test: [] // 返値
  };
}

// プレーヤー一覧の取得失敗を表すアクション
function errorFetchPlayers() {
  return {	
    type: ERROR
  };
}

// Web API を呼び出す非同期アクション
function TestAPI() {
  return function(dispatch) {
    dispatch(startFetchPlayers());

		request.get("/api/test").end(function(err, res) {
			dispatch(testResult(res.body));
		});
	};
}

// 削除
function removeList() {
  return function(dispatch) {
    dispatch(removeResult());
  };
}

var Header = React.createClass({
  render: function () {
    return (
      <header>
        <ul>
          <li><a href="/">top</a></li>
          <li><a href="/inbox">Inbox</a></li>
        </ul>
      </header>
    );
  }
});

var Footer = React.createClass({
  render: function () {
    return (
		  <p>Copy Right 2016</p>
    );
  }
});

// 結果を表示するコンポーネント
var Result = React.createClass({
  remove: function() {
    store.dispatch(removeList());
  },

  render: function() {
		return (
      <div className="result">
		  	<p>{this.props.result}</p>
        <button onClick={this.remove}>削除</button>
      </div>
		);
	}
});

var _MyApp = React.createClass({
  reload: function() {
    this.props.dispatch(TestAPI());
  },

  render: function() {
    return (
		<div className="wrapper">
 			<Header />
			<button onClick={this.reload}>ボタン</button>
			<Result result={this.props.result}/>
 			<Footer />
		</div>
    );
  }
});
// <Progress progress={this.props.progress}/> 
// <Players players={this.props.players}/>

// 状態を操作する Reducer
function testReducer(state, action) {
  console.log(action.type);
  switch (action.type) {
    case TEST:
      return action.test;
    case DELETE:
      return '';
    case ERROR:
      return [];
    default:
      return state || [];
  }
}

// ストアに渡す Reducer を作成
var rootReducer = combineReducers({
  result: testReducer
});

// connect でラップし、ストアの状態を props に受け取れるようにする
var MyApp = connect(function(state) {
  return {
    result: state.result
  };
})(_MyApp);


// ミドルウェアを組み込んだストアを作成
var store = createStoreWithMiddleware(rootReducer);

ReactDOM.render((
  <Provider store={store}>
    <MyApp />
  </Provider>
  ), document.getElementById("content")
);
