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

var Redux_Router = require("react-router-redux");
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
var ERROR = "ERROR";

// プレーヤー一覧の取得開始を表すアクション
function startFetchPlayers() {
  return {
    type: START
  };
}

// プレーヤー一覧の取得成功を表すアクション
// function successFetchPlayers(result) {
//   return {
//     type: SUCCESS,
//     players: result
//   };
// }

function testResult(result) {
  return {
  	// state
    type: TEST,
    aaa: result// 返値
  };
}

// プレーヤー一覧の取得失敗を表すアクション
function errorFetchPlayers() {
  return {	
    type: ERROR
  };
}

// Web API test
function TestAPI() {
  return function(dispatch) {
    dispatch(startFetchPlayers());

		request.get("/api/test").end(function(err, res) {
			dispatch(testResult(res.body));
		});
	};
}

// Web API を呼び出す非同期アクション
// function fetchPlayersAsync() {
//   return function(dispatch) {
//     dispatch(startFetchPlayers());

//     request.get("/api/players")
//       .end(function(err, res) {
//         if (err) {
//           dispatch(errorFetchPlayers());
//         } else {
//           dispatch(successFetchPlayers(res.body));
//         }
//       });
//   };
// }

// 状態を操作する Reducer
function testReducer(state, action) {
	switch (action.type) {
		case TEST:
			return action.aaa;
		case ERROR:
			return [];
		default:
			return state || [];
	}
}

// プレーヤーの状態を操作する Reducer
// function playersReducer(state, action) {
//   switch (action.type) {
//     case SUCCESS:
//       return action.players;
//     case ERROR:
//       return [];
//     default:
//       return state || [];
//   }
// }

// 進捗の状態を操作する Reducer
// function progressReducer(state, action) {
//   state = state || false;
//   switch (action.type) {
//     case START:
//       return true;
//     case SUCCESS:
//       return false;
//     case ERROR:
//       return false;
//     default:
//       return state;
//   }
// }

// プレーヤーの行を表示するコンポーネント
// var Player = React.createClass({
//   render: function() {
//     return (
//       <tr>
//         <td>{this.props.player.number}</td>
//         <td>{this.props.player.name}</td>
//       </tr>
//     );
//   }
// });

// プレーヤー一覧を表示するコンポーネント
// var Players = React.createClass({
//   players: function() {
//     return _.map(this.props.players, function(p) {
//       return <Player player={p} />
//     });
//   },

//   render: function() {
//     return (
//       <table>
//         <thead>
//           <tr>
//             <th>Number</th>
//             <th>Name</th>
//           </tr>
//         </thead>
//         <tbody>
//           {this.players()}
//         </tbody>
//       </table>
//     );
//   }
// });

// 進捗を表示するコンポーネント
// var Progress = React.createClass({
// 	render: function() {
// 		if (this.props.progress) {
// 			return (
// 				<div>取得中...</div>
// 			);
// 		} else {
// 			return (
// 				<div></div>
// 			);
// 		}
// 	}
// });

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
	render: function() {
		return (
			<p>{this.props.result}</p>
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


// connect でラップし、ストアの状態を props に受け取れるようにする
var MyApp = connect(function(state) {
  return {
    // players: state.players,
    // progress: state.progress,
    result: state.result
  };
})(_MyApp);


// ストアに渡す Reducer を作成
var rootReducer = combineReducers({
  // players: playersReducer,
  // progress: progressReducer
	result: testReducer
});


// ミドルウェアを組み込んだストアを作成
var store = createStoreWithMiddleware(rootReducer);


ReactDOM.render((
  <Provider store={store}>
    <MyApp />
  </Provider>
  ), document.getElementById("content")
);

// var routes = (
//   <Route name="/" handler={App}>
//   </Route>
// );

// Router.run(routes, function (Handler) {
//   React.render(<Handler/>, document.getElementById("content"));
// });

// ReactDOM.render(
//   <Handler/>, document.getElementById("content")
// );