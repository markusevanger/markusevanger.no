import logo from './logo.svg';
import './App.css';

export default function App() {
  return (
    <>
      <div style={{ height: 600, width: 300 }} onWheel={(e) => console.log(e)}>
        hello world
      </div>
    </>
  );
}
