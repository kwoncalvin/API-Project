import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div id='profile-wrap'>
      <i className="fas fa-user-circle" />
      <button onClick={openMenu} id='prof-drop'>
        {showMenu ? <i class="fa-solid fa-caret-up"></i>
                  : <i class="fa-solid fa-caret-down"></i>}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.firstName}</li>
        <li>{user.email}</li>
        <li>
          <NavLink to='/groups' className='nav-click'>View Groups</NavLink>
        </li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </div>
  );
}

export default ProfileButton;
