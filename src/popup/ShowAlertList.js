import React from 'react';

const ShowAlertList = ({ links, updateLink }) => {
  return (
    <div className="alert-list-container">
      <h2>SAVED ALERTS</h2>
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
