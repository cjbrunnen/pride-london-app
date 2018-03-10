// @flow
import type { State } from "../reducers";

const getEventsState = (state: State) => state.events;

export const selectEvents = (state: State) => getEventsState(state).events;
export const selectEventsLoading = (state: State) =>
  getEventsState(state).loading;
export const selectEventsRefreshing = (state: State) =>
  getEventsState(state).refreshing;

export const selectEventById = (state: State, id: String) =>
  selectEvents(state).find(event => event.sys.id === id);
