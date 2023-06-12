import React from "react";
import "./LandingPage.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton/";
import SignupFormModal from "../SignupFormModal";
import { useEffect } from "react";

function LandingPage() {
    const user = useSelector((state) => state.session.user);

    const handleClick = (e) => {
        if (!user) e.preventDefault()
    }

    useEffect(() => {
        if (!user) {
            let createButton = document.getElementById(
                "create-button"
            );
            createButton.style.color = "grey";
            createButton.style.cursor = "default";
        } else {
            let createButton = document.getElementById(
                "create-button"
            );
            createButton.style.color = "teal";
            createButton.style.cursor = "pointer";
        }
    }, [user]);

    return (
        <div className="wrapper">
            <div id='section-1'>
                <div id='section-1-txt'>
                    <h1>
                        The people platform—Where interests become friendships
                    </h1>
                    <p>
                        Whatever your interest, from hiking and reading to
                        networking and skill sharing, there are thousands of
                        people who share it on Meetup. Events are happening
                        every day—log in to join the fun.
                    </p>
                </div>
                <div>
                    <img
                        id='section-1-img'
                        src='https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640'
                    />
                </div>
            </div>
            <div id="section-2">
                <h2>How Meetdown works</h2>
                <p id='howWorks'>
                    Meet new people who share your interests through online and
                    in-person events. It’s free to create an account.
                </p>
            </div>
            <div id="section-3">
                <div className="section-3-part">
                    <img className="smallImage"
                        src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256'
                    />
                    <NavLink to='/groups' className='nav-click teal link-size'>See all groups</NavLink>
                    <p>
                        Do what you love, meet others who love it,
                        find your community. The rest is history!
                    </p>
                </div>
                <div className="section-3-part">
                    <img className="smallImage"
                        src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256'
                    />
                    <NavLink to='/events' className='nav-click teal link-size'>Find an event</NavLink>
                    <p>
                        Events are happening on just about any topic you can think of,
                        from online gaming and photography to yoga and hiking.
                    </p>
                </div>
                <div className="section-3-part">
                    <img className="smallImage"
                        src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256'
                    />
                    <NavLink id='create-button' onClick={handleClick} to='/groups/new' className='nav-click link-size'>Start a group</NavLink>
                    <p>
                        You don’t have to be an expert to gather
                        people together and explore shared interests.
                    </p>
                </div>
            </div>
            {(user) ? null :
                <div id="section-4" className="join-meetup-button">
                    <OpenModalButton
                        buttonText="Join Meetup"
                        modalComponent={<SignupFormModal/>}
                    ></OpenModalButton>
                </div>
            }
        </div>
    )
}

export default LandingPage;
