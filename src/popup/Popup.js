import React from 'react';
import Auth from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import { createLinks, updateLinks } from '../graphql/mutations';
import { listLinkss } from '../graphql/queries';
import ShowAlertList from './ShowAlertList';
import Logo from '../img/icon.png';
import './Popup.css';

import { withAuthenticator } from 'aws-amplify-react';

// get current active link
function getCurrentLink(cb) {
  /* eslint-disable */
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      cb(tabs[0].url, tabs[0].title);
    }
  );
  /* eslint-enable */
}

// function to get loggedin user
function getCurrentUserId(cb) {
  Auth.currentAuthenticatedUser().then((user) => {
    const {
      attributes: { sub, email },
    } = user;

    cb({ id: sub, email });
  });
}

const Popup = () => {
  const [loading, setLoading] = React.useState(true);
  const [saveLink, setSaveLink] = React.useState(true);
  const [link, setLink] = React.useState({});
  const [allLinks, setAllLinks] = React.useState([]);
  const [user, setUser] = React.useState({});

  const discountRef = React.useRef();
  const sendAllSalesRef = React.useRef();

  React.useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = () => {
    // fetch data for current page
    getCurrentLink((link) => {
      getCurrentUserId((userData) => {
        const filter = {
          userId: {
            eq: userData.id,
          },
        };

        // perform fetch and update link data in state
        API.graphql(
          graphqlOperation(listLinkss, {
            filter,
          })
        )
          .then(({ data }) => {
            const {
              listLinkss: { items },
            } = data;
            console.log(items);
            const isAlertForCurrentLink = items.find(
              (item) => item.link === link && item.active === true
            );

            setSaveLink(!isAlertForCurrentLink);
            setLink(isAlertForCurrentLink || {});
            setAllLinks(items);
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      });
    });
  };

  // create alert for link
  const createLinkFn = () => {
    const discount = discountRef.current.value;
    const sendAllSales = sendAllSalesRef.current.checked;

    setLoading(true);

    // perform mutation and update newly created alert in state
    getCurrentUserId(({ id: user }) => {
      getCurrentLink((link, title) => {
        // check if current link is already in links
        const isAlreadyAlertPresent = allLinks.find((currentLink) => {
          return currentLink.link === link;
        });
        console.log(isAlreadyAlertPresent);

        if (isAlreadyAlertPresent) {
          updateLinkFn(isAlreadyAlertPresent.id, true);

          return;
        }

        const linkData = {
          link,
          title,
          discount,
          sendAllSales,
          active: true,
        };

        API.graphql(
          graphqlOperation(createLinks, {
            input: { ...linkData, userId: user },
          })
        )
          .then(({ data }) => {
            setLoading(false);
            setSaveLink(false);
            setLink(data.createLinks);
            fetchLinks();
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
          });
      });
    });
  };

  // delete alert mutation
  const updateLinkFn = (linkId, active) => {
    setLoading(true);

    API.graphql(
      graphqlOperation(updateLinks, {
        input: {
          id: linkId,
          active,
        },
      })
    )
      .then(() => {
        // update link status in link list
        fetchLinks();
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  // show loader until ui performs operation
  if (loading) {
    return (
      <div className="popup">
        <div className="loader-container flex-center">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  const filterAndSortLinks = (links) => {
    const activeLinks = links.filter((link) => link.active);
    const deactiveLinks = links.filter((link) => !link.active);

    const sortedActiveLinks = activeLinks.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const sortedDeActiveLinks = deactiveLinks.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return sortedActiveLinks.concat(sortedDeActiveLinks);
  };

  return (
    <div className="popup">
      <div className="popup-header">
        <div className="logo-container">
          <img src={Logo} alt="logo" />
          <button
            className="submit-button"
            onClick={() => {
              Auth.signOut({ global: true }).then((data) => console.log(data));
            }}
          >
            Logout
          </button>
        </div>
        <p className="info-text-main">
          With Creamy you can set email alerts to <b>{user.email}</b> when the
          products you want go on sale.
        </p>
      </div>
      <div className="container">
        <div className="form-part">
          {saveLink ? (
            <React.Fragment>
              <h2>Set an email alert when the sale price is right for you.</h2>
              <div className="form-inputs">
                <div className="sqr-input">
                  <div className="text-input margin-bottom-zero">
                    <div className="sqr-input sqr-input-discount flex-center">
                      <div className="text-input flex-center">
                        <label htmlFor="phone">Discount</label>
                        <input
                          ref={discountRef}
                          type="number"
                          name="discount"
                          id="discount"
                          defaultValue="10"
                        />
                        <span id="percent">%</span>
                      </div>

                      <div className="check-boxes flex-center">
                        <label className="checkbox-container flex-center">
                          Alert all sales from this store
                          <input
                            type="checkbox"
                            ref={sendAllSalesRef}
                            type="checkbox"
                            name="alertAllSites"
                            className="alert-all-sites-checkbox"
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <button
                        className="submit-button"
                        type="button"
                        onClick={createLinkFn}
                      >
                        Set Email Alert
                      </button>
                      <div className="note">
                        <b>Note:</b> We will email you when your product goes on
                        sale for this discount or more.
                      </div>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <div>
              <button
                className="submit-button"
                type="button"
                onClick={() => updateLinkFn(link.id, false)}
              >
                Delete Alert
              </button>
            </div>
          )}
        </div>
      </div>
      <ShowAlertList
        updateLink={updateLinkFn}
        links={filterAndSortLinks(allLinks)}
        user={user}
      />
    </div>
  );
};

const signUpConfig = {
  hiddenDefaults: ['username'],
  header:
    'Create a new account with Creamy to receive email alerts when the products you want go on sale.',
  signInFields: [
    {
      label: 'Email',
      key: 'username',
    },
  ],
  signUpFields: [
    {
      label: 'Email',
      key: 'username', // :exclamation::exclamation::exclamation:
      required: false,
      displayOrder: 2,
      type: 'string',
      custom: false,
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 4,
      type: 'password',
      custom: false,
    },
    {
      label: 'Repeat Email',
      key: 'email',
      required: true,
      displayOrder: 3,
      type: 'tel',
      custom: false,
    },
    {
      label: 'Phone Number (Not Required)',
      key: 'phone_number',
      required: false,
      displayOrder: 5,
      type: 'tel',
      custom: false,
    },
  ],
};

const MyTheme = {};

export default withAuthenticator(Popup, false, [], null, MyTheme, signUpConfig);
