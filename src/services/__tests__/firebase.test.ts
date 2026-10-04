import { firebaseConfig, getFirebaseConfigurationErrors } from '../../config';

const validConfig = {
  ...firebaseConfig,
  apiKey: 'test-web-api-key',
  authDomain: 'rankkit-test.firebaseapp.com',
  projectId: 'rankkit-test',
  appId: '1:123:web:test'
};

test('missing configuration is diagnosed before Firebase initializes', () => {
  expect(getFirebaseConfigurationErrors({ ...validConfig, apiKey: undefined }))
    .toEqual(['REACT_APP_FIREBASE_API_KEY']);
});

test.each(['', '   ', 'your_api_key', 'your-api-key', 'invalid:key'])('rejects unusable API key %s', apiKey => {
  expect(getFirebaseConfigurationErrors({ ...validConfig, apiKey }))
    .toEqual(['REACT_APP_FIREBASE_API_KEY']);
});

test('reports all missing required fields without exposing their values', () => {
  expect(getFirebaseConfigurationErrors({ ...validConfig, apiKey: undefined, authDomain: undefined, projectId: undefined, appId: undefined }))
    .toEqual(['REACT_APP_FIREBASE_API_KEY', 'REACT_APP_FIREBASE_AUTH_DOMAIN', 'REACT_APP_FIREBASE_PROJECT_ID', 'REACT_APP_FIREBASE_APP_ID']);
});

test('configured apps can load normally without optional analytics settings', () => {
  expect(getFirebaseConfigurationErrors({ ...validConfig, measurementId: undefined })).toEqual([]);
});