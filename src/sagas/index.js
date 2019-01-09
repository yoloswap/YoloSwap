import { fork, all } from 'redux-saga/effects';
import tokenWatcher from './tokenSaga';
import accountWatcher from './accountSaga';

export default function* rootSaga() {
  yield all([
    fork(tokenWatcher),
    fork(accountWatcher),
  ]);
}
