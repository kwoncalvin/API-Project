import React from "react";
import "./LandingPage.css";

function LandingPage() {
    return (
        <div>
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
                    >
                    </img>
                </div>
            </div>
            <div id="section-2">
                <h2>How MeetUp works</h2>
                <p>
                    Meet new people who share your interests through online and
                    in-person events. It’s free to create an account.
                </p>
            </div>
            <div id="section-3">
                <div className="section-3-part">
                    <h3>See all groups</h3>
                    <img
                        src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256'
                    >
                    </img>
                    <p>
                        Do what you love, meet others who love it,
                        find your community. The rest is history!
                    </p>
                </div>
                <div className="section-3-part">
                    <h3>Find an event</h3>
                    <img
                        src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256'
                    >
                    </img>
                    <p>
                        Events are happening on just about any topic you can think of,
                        from online gaming and photography to yoga and hiking.
                    </p>
                </div>
                <div className="section-3-part">
                    <h3>Start a group</h3>
                    <img
                        src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256'
                    >
                    </img>
                    <p>
                        You don’t have to be an expert to gather
                        people together and explore shared interests.
                    </p>
                </div>
            </div>
            <div id="section-4">
                <button>Join Meetup</button>
            </div>
        </div>
    )
}

export default LandingPage;
