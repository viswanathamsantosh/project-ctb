import { Event } from './event';
import { ADD_EVENT, REMOVE_EVENT, EDIT_EVENT } from './actions';
import { isNgTemplate } from '@angular/compiler';

export interface IAppState {
  events: Event[];
  lastUpdate: Date;
}
export function rootReducer(state: IAppState, action): IAppState {
  switch (action.type) {
    case ADD_EVENT:
      action.event.id = state.events.length + 1;
      return Object.assign({}, state, {
        events: state.events.concat(Object.assign({}, action.event)),
        lastUpdate: new Date()
      });
    case REMOVE_EVENT:
      return Object.assign({}, state, {
        events: state.events.filter(t => t.id !== action.event.id),
        lastUpdate: new Date()
      });
    case EDIT_EVENT:
      return Object.assign({}, state, {
        events: state.events.map(t => {
          if (t.id === action.event.id) {
            return { ...t, ...action.event };
          }
          return t;
        }),
        lastUpdate: new Date()
      });
  }
  return state;
}
export const INITIAL_STATE: IAppState = {
  events: [],
  lastUpdate: null
};

