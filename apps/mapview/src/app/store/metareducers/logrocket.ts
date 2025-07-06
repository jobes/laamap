import { ActionReducer } from '@ngrx/store';
import LogRocket from 'logrocket';

const reduxMiddleware = LogRocket.reduxMiddleware({
  actionSanitizer: (action: any) => {
    return {
      ...action,
      ...(action.jwtToken ? { jwtToken: '***' } : {}),
      ...(action.accessKey ? { accessKey: '***' } : {}),
    };
  },
  stateSanitizer: (state: any) => {
    return {
      ...state,
      'settings.general': {
        ...state['settings.general'],
        loginToken: state['settings.general'].loginToken ? '***' : '',
        loginObject: state['settings.general'].loginObject ? '***' : '',
      },
      'settings.traffic': {
        ...state['settings.traffic'],
        accessKey: state['settings.traffic'].accessKey ? '***' : '',
      },
    };
  },
});

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
