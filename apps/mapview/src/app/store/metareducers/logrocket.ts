import { ActionReducer } from '@ngrx/store';
import LogRocket from 'logrocket';

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const reduxMiddleware = LogRocket.reduxMiddleware();

export function logRocketMiddleware(
  reducer: ActionReducer<any>,
): ActionReducer<any> {
  let currentState: any;
  const fakeDispatch = reduxMiddleware({
    getState: () => currentState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  })(() => {});

  return function (state, action) {
    const newState = reducer(state, action);
    currentState = state;
    fakeDispatch(action);
    return newState;
  };
}
