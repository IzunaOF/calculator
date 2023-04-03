import './App.css';
import './css/root.css';
import Calculator from './components/Calc/Calculator';
import Informations from './components/Informations';

function App() {
  return (
    <div className="App">
      <Calculator/>
      <Informations/>
    </div>
  );
}

export default App;
