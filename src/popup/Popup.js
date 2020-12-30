import React from 'react';
import './Popup.css';

import {withAuthenticator} from 'aws-amplify-react';

const Popup = () => {
  console.log('POPUP');
  return (
    <div className="popup">
      {/* <p className="contrib-msg">We would love some of your help in making this boilerplate even better. <br /><a href="https://www.github.com/kryptokinght/react-extension-boilerplate" target="_blank">React Extension Boilerplate</a></p> */}
      {/* <AmplifySignOut style={{width: '500px'}} /> */}
    </div>
  );
};


export default withAuthenticator(Popup, true);
