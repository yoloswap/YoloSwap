import { fork, all } from 'redux-saga/effects';
import swapWatcher from './swapSaga';
import marketWatcher from './marketSaga';
import accountWatcher from './accountSaga';

export default function* rootSaga() {
  yield all([
    fork(swapWatcher),
    fork(accountWatcher),
    fork(marketWatcher),
  ]);
}
