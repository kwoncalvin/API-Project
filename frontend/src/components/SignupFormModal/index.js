import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(true)


  useEffect(() => {
    if (username.length < 4 || password.length < 6 || !email || !firstName || !lastName || !confirmPassword) {
        setDisabled(true);
    } else {
        setDisabled(false);
    }
  }, [username, password, email, firstName, lastName, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="box">
      <h2 id='title'>Sign Up</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="section">
          <label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modal-input"
              placeholder="Email"
            />
          </label>
          {errors.email && <p className="errors">{errors.email}</p>}
        </div>
        <div className="section">
          <label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modal-input"
              placeholder="Username - 4 characters minimum"
            />
          </label>
          {errors.username && <p className="errors">{errors.username}</p>}
        </div>
        <div className="section">
          <label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="modal-input"
              placeholder="First Name"
            />
          </label>
          {errors.firstName && <p className="errors">{errors.firstName}</p>}
        </div>
        <div className="section">
          <label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="modal-input"
              placeholder="Last Name"
            />
          </label>
          {errors.lastName && <p className="errors">{errors.lastName}</p>}
        </div>
        <div className="section">
          <label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal-input"
              placeholder="Password - 6 characters minimum"
            />
          </label>
          {errors.password && <p className="errors">{errors.password}</p>}
        </div>
        <div className="section">
          <label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="modal-input"
              placeholder="Confirm password"
            />
          </label>
          {errors.confirmPassword && (
            <p className="errors">{errors.confirmPassword}</p>
          )}
        </div>
        <button className={disabled ? 'disabled-button': 'modal-button'} id='signupbut' type="submit" disabled={disabled}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
