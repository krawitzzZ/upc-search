export default function createAsyncMiddleware(apiClient) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action;

      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({ ...rest, type: REQUEST});

      const actionPromise = promise(apiClient);
      actionPromise
        .then(data => next({ ...rest, data, type: SUCCESS }))
        .catch(error => next({ ...rest, error, type: FAILURE }));

      return actionPromise;
    };
  };
}
