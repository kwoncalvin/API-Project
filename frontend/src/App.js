import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ListPage from "./components/ListPage";
import SingleGroupPage from "./components/SingleGroupPage";
import SingleEventPage from "./components/SingleEventPage";
import CreateGroupPage from "./components/CreateGroupPage";
import CreateEventPage from "./components/CreateEventPage";

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
              <ListPage type={'group'}/>
          </Route>
          <Route exact path="/groups/new">
              <CreateGroupPage/>
          </Route>
          <Route exact path="/groups/:groupId">
              <SingleGroupPage/>
          </Route>
          <Route exact path="/groups/:groupId/edit">
              <CreateGroupPage/>
          </Route>
          <Route exact path="/groups/:groupId/events/new">
              <CreateEventPage/>
          </Route>
          <Route exact path='/events'>
              <ListPage type={'event'}/>
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
