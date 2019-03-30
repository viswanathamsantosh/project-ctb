import { IEvent } from './event';
import { ADD_EVENT, REMOVE_EVENT } from './actions';

export interface IAppState {
  events: IEvent[];
  lastUpdate: Date;
}
export function rootReducer(state: IAppState, action): IAppState {
  switch (action.type) {
    case ADD_EVENT:
      action.event.id  = state.events.length + 1;
      return Object.assign({}, state, {
        events: state.events.concat(Object.assign({}, action.event)),
        lastUpdate: new Date()
      });
    case REMOVE_EVENT:
      return Object.assign({}, state, {
        events: state.events.filter(t => t.id !== action.id),
        lastUpdate: new Date()
      });
  }
  return state;
}
export const INITIAL_STATE: IAppState = {
  events: [],
  lastUpdate: null
};

