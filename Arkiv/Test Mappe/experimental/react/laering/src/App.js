import logo from './logo.svg';
import './App.css';

function App(props) {
  const subject = props.subject;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          
        </p>
          Hello {subject}!
         
      </header>
    </div>
  );
}

export default App;
