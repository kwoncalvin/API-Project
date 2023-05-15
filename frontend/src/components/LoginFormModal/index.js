import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    if (!Object.keys(errors).length) {
      history.push("/");
    }
  };

  const demoLogin = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    if (!Object.keys(errors).length) {
      history.push("/");
    }
  }

  return (
    <div className="box">
      <h1>Log In</h1>
      <form className='form' onSubmit={handleSubmit}>
        <div className="section">
          <label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              placeholder="Username or Email"
            />
          </label>
        </div>
        <div className="section">
          <label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </label>
        </div>
        {errors.credential && (
          <p className="errors">{errors.credential}</p>
        )}
        <button type="submit">Log In</button>
        <button
            onClick={demoLogin}
            id="demo"
        >
            Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
