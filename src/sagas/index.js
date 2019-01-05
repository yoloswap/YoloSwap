import { fork, all } from 'redux-saga/effects';
import dummyWatcher from './dummySaga';

export default function* rootSaga() {
  yield all([
    fork(dummyWatcher),
  ]);
}
