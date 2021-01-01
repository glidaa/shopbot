import React from 'react';

const ShowAlertList = ({ links, updateLink, user }) => {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="alert-list-container">
      <h2 className="saved-alert-text">SAVED ALERTS</h2>
      <p className="info-text-main">
        Creamy is watching this product for you and will email you at{' '}
        {user.email} when your product goes on sale.
      </p>
      {links.map((link) => (
        <div
          key={link.id}
          className={link.active ? 'alert-item' : 'alert-item fade-link'}
        >
          <a href={link.link} target="_blank">
            {link.title || 'N/A'}
          </a>
          <button
            className="submit-button alert-cta"
            type="button"
            onClick={() => updateLink(link.id, !link.active)}
          >
            {link.active ? 'Delete Alert' : 'Activate Alert'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ShowAlertList;
