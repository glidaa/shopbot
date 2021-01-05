import React from "react";
import "./Popup.css";

import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignUp,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";

const Popup = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  const form = (
    <div>
      <AmplifyAuthenticator usernameAlias="email">
        <AmplifySignUp
          slot="sign-up"
          usernameAlias="email"
          formFields={[
            {
              type: "email",
              label: "Email",
              placeholder: "Email",
              required: true,
            },
            {
              type: "password",
              label: "Password",
              placeholder: "Password",
              required: true,
            },
          ]}
        />
        <AmplifySignIn slot="sign-in" usernameAlias="email" />
      </AmplifyAuthenticator>
    </div>
  );

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <h1 style={{ color: "white" }}> Welcome to auth app </h1>
      <AmplifySignOut />
    </div>
  ) : (
    form
  );
};
export default Popup;
