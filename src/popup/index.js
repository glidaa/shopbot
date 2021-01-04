import React from 'react';
import ReactDOM from 'react-dom';
import * as browser from 'webextension-polyfill';
import './index.css';
import Popup from './Popup';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
browser.runtime.sendMessage({ data: 'hello' });

ReactDOM.render(
    <Popup text="Ext boilerplate" />, document.getElementById('root')
    );

serviceWorker.unregister();