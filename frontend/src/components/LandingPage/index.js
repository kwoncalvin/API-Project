import React from "react";
import "./LandingPage.css";

function LandingPage() {
    return (
        <div>
            <div className='section-1'>
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
                    >
                    </img>
                </div>
            </div>
            <div className="section-2">
                <h2>How MeetUp works</h2>
                <p>
                    Meet new people who share your interests through online and
                    in-person events. It’s free to create an account.
                </p>
            </div>
            <div className="section-3">

            </div>
            <div className="section-4">

            </div>
        </div>
    )
}

export default LandingPage;
