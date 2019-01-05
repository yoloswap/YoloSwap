import { takeLatest } from 'redux-saga/effects';

function* helloWorld() {
  console.log("dummy action has been activated by Saga");
}

export default function* dummyWatcher() {
  yield takeLatest('DUMMY.DUMMY_ACTION', helloWorld)
}
