import React from 'react';
import Auth from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import { createLinks, deleteLinks } from '../graphql/mutations';
import { listLinkss } from '../graphql/queries';
import './Popup.css';

import { withAuthenticator } from 'aws-amplify-react';

// get current active link
function getCurrentLink(cb) {
  /* eslint-disable */
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      cb(tabs[0].url);
    }
  );
  /* eslint-enable */
}

// function to get loggedin user
function getCurrentUserId(cb) {
  Auth.currentAuthenticatedUser().then((user) => {
    const {
      attributes: { sub },
    } = user;

    cb(sub);
  });
}

const Popup = () => {
  const [loading, setLoading] = React.useState(true);
  const [saveLink, setSaveLink] = React.useState(true);
  const [link, setLink] = React.useState({});

  const discountRef = React.useRef();
  const sendAllSalesRef = React.useRef();

  React.useEffect(() => {
    // fetch data for current page
    getCurrentUserId((user) => {
      getCurrentLink((link) => {
        const filter = {
          userId: {
            eq: user,
          },
          link: {
            eq: link,
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

            setSaveLink(items.length > 0 ? false : true);
            setLink(items[0]);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      });
    });
  }, []);

  // create alert for link
  const createLinkFn = () => {
    const discount = discountRef.current.value;
    const sendAllSales = sendAllSalesRef.current.checked;

    setLoading(true);

    // perform mutation and update newly created alert in state
    getCurrentUserId((user) => {
      getCurrentLink((link) => {
        const linkData = {
          link,
          discount,
          sendAllSales,
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
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
          });
      });
    });
  };

  // delete alert mutation
  const deleteLinkFn = () => {
    setLoading(true);

    API.graphql(
      graphqlOperation(deleteLinks, {
        input: {
          id: link.id,
        },
      })
    )
      .then(() => {
        setSaveLink(true);
        setLoading(false);
        setLink({});
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

  return (
    <div className="popup">
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
                onClick={deleteLinkFn}
              >
                Delete Alert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuthenticator(Popup, true);
