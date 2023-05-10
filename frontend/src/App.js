import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsListPage from "./components/GroupsListPage";
import EventsListPage from "./components/EventsListPage";
import SingleGroupPage from "./components/SingleGroupPage";
import SingleEventPage from "./components/SingleEventPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
      <Switch>
          <Route exact path='/'>
              <LandingPage/>
          </Route>
          <Route exact path='/groups'>
              <GroupsListPage/>
          </Route>
          <Route exact path="/groups/:groupId">
              <SingleGroupPage/>
          </Route>
          <Route exact path='/events'>
              <EventsListPage/>
          </Route>
          <Route exact path="/events/:eventId">
              <SingleEventPage/>
          </Route>
      </Switch>
      )}
    </>
  );
}

export default App;
