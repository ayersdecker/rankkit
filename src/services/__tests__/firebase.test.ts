import { firebaseConfig, getFirebaseConfigurationErrors } from '../../config';
import * as configuration from '../../config';
import ReactDOM from 'react-dom/client';
import { act, screen } from '@testing-library/react';

jest.mock('../../App', () => { throw new Error('App must not initialize without Firebase configuration'); });
jest.mock('../../reportWebVitals', () => ({ __esModule: true, default: jest.fn() }));

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

test('startup renders setup diagnostics without loading Firebase or App', async () => {
  const configurationSpy = jest.spyOn(configuration, 'getFirebaseConfigurationErrors')
    .mockReturnValue(['REACT_APP_FIREBASE_API_KEY']);
  const rootSpy = jest.spyOn(ReactDOM, 'createRoot');
  const container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);
  try {
    await act(async () => { require('../../index'); });
    expect(screen.getByText('Firebase Configuration Required')).toBeInTheDocument();
    expect(screen.getByText('REACT_APP_FIREBASE_API_KEY')).toBeInTheDocument();
  } finally {
    const root = rootSpy.mock.results[0]?.value;
    if (root) await act(async () => { root.unmount(); });
    container.remove();
    configurationSpy.mockRestore();
    rootSpy.mockRestore();
  }
});