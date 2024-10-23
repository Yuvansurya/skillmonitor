import logo from './logo.svg';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/login/Login';
import { FormComponent } from './components/sign_form/FormComponent';
import { Homepage } from './components/dashboard/Homepage'


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/signin" element={<FormComponent />}/>
          <Route path="/home" element={<Homepage />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
