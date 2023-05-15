import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li id='log-sign'>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <ul className='nav-bar'>
      <div id='logo' className="nav-click">
        <li>
          <NavLink exact to="/"  id='navlogo'>
            <img src='https://us.123rf.com/450wm/cotopaxi/cotopaxi1901/cotopaxi190100388/115953622-m-letter-blue-cool-gradient-flat-vector-logo-template.jpg'/>
            <span id='title'>Meetdown</span>
          </NavLink>
        </li>
      </div>
      <div id='profile'>
        {sessionUser ? (
        <NavLink exact to='/groups/new' className='navlink-big'>Start a new group</NavLink>
        ) : null}
        {isLoaded && sessionLinks}
      </div>
    </ul>
  );
}

export default Navigation;
