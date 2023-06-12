import React, { useState, useEffect } from "react";
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
  const [disabled, setDisabled] = useState(true)
  const { closeModal } = useModal();
  const history = useHistory();


  useEffect(() => {
    if (credential.length < 4 || password.length < 6) {
        setDisabled(true);
    } else {
        setDisabled(false);
    }
  }, [credential, password]);

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
      <h2>Log In</h2>
      <form className='form' onSubmit={handleSubmit}>
        <div className="section">
          <label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="modal-input"
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
              className="modal-input"
              placeholder="Password"
            />
          </label>
        </div>
        {errors.credential && (
          <p className="errors">{errors.credential}</p>
        )}
        <button className={disabled ? 'disabled-button': 'modal-button'} type="submit" disabled={disabled}>Log In</button>
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
