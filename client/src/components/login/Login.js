import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Login = () => { 

  const [rollno, change_rollno] = useState('');
  const [password, change_password] = useState('');
  localStorage.setItem('rollno', rollno);
  const navigate = useNavigate();

  const auth_user = (e) => { 

    if (!rollno || !password) {
      toast.error("Please enter both Roll Number and Password!"); 
      return
    }

    if (e === 0) {
      axios.post('http://localhost:3001/register', {
        rollno: rollno,
        password: password
      }) 
      .then(res => {
        if(res.data==='User Exist'){
          toast.error('User Already Exist',{
            autoClose: 1000,
          })
          return
        }
        toast.success("Registration successful!", {
          autoClose: 1000,
          onClose: () => navigate('/signin')
        });
      }) 
      .catch(err => {
        console.log(err);
        toast.error("Registration failed"); 
      });
    } else{
      axios.post('http://localhost:3001/register', {
        rollno: rollno,
        password: password
      }) 
      .then(res => {
        localStorage.setItem('rollno',rollno) 
        console.log(localStorage.getItem('rollno'))
        toast.success("Login successful!", {
          autoClose: 1000,
          onClose: () => navigate('/home')
        });
      }) 
      .catch(err => {
        console.log(err);
        toast.error("Registration failed"); 
      });
    }
  }
  
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row border rounded-5 p-3 bg-white shadow box-area">
        {/* Left Box */}
        <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: '#103cbe' }}>
          <div className="featured-image mb-3">
            <img src="images/1.png" className="img-fluid" style={{ width: '250px' }} alt="featured" />
          </div>
          <p className="text-white fs-2" style={{ fontFamily: "'Courier New', Courier, monospace", fontWeight: 600 }}>Be Verified</p>
          <small className="text-white text-wrap text-center" style={{ width: '17rem', fontFamily: "'Courier New', Courier, monospace" }}>
            Join experienced Designers on this platform.
          </small>
        </div>

        {/* Right Box */}
        <div className="col-md-6 right-box">
          <div className="row align-items-center">
            <div className="header-text mb-4">
              <h2>Hello, Again</h2>
              <p>We are happy to have you back.</p>
            </div>
            {/*details*/}
            <div className="input-group mb-3">
              <input onChange={(e) => change_rollno(e.target.value)} type="number" className="form-control form-control-lg bg-light fs-6" placeholder="Roll Number" />
            </div>
            <div className="input-group mb-1">
              <input onChange={(e) => change_password(e.target.value)} type="password" className="form-control form-control-lg bg-light fs-6" placeholder="Password" />
            </div>
            <div className="input-group mb-5 d-flex justify-content-between">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="formCheck" />
                <label htmlFor="formCheck" className="form-check-label text-secondary"><small>Remember Me</small></label>
              </div>
              <div className="forgot">
                <small><a href="#">Forgot Password?</a></small>
              </div>
            </div>
            {/*signin*/}
            <div className="input-group mb-3">
              <button onClick={() => auth_user(0)} className="btn btn-lg btn-primary w-100 fs-6">Sign Up</button>
            </div>
            <div className="input-group mb-3">
              <button onClick={() => auth_user(1)} className="btn btn-lg btn-primary w-100 fs-6">Login</button>
            </div>
            <div className="row">
              <small>Don't have an account? <a href="#">Sign Up</a></small>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};
