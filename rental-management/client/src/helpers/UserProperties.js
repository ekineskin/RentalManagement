import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserProperties = ({ userProperties }) => {
  return (
    <div className="general-properties">
    <h2 className="card-header">Properties</h2>
    <p className="card-text">
        Your property details are as follows.
    </p>
    <div className='properties-list'>
        <div className="user-properties">      
        {userProperties.length > 0 ? (
            userProperties.map((property, index) => (
            <div key={index} className="property-card">
                <p>Property Type: <div className='description'>{property.propertyType}</div></p>
                <p>Address: <div className='description'>{property.publicAddress}</div></p>
                <div className='button-container'>
                <button className="icon-button start-lease">
                    <FontAwesomeIcon icon={faPencil} />
                </button>
                <button className="icon-button terminate-lease">
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className="icon-button remove-property">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                </div>
         
            </div>
            ))
        ) : (
            <p>No properties found for this user.</p>
        )}        
        </div>        
    </div>
    </div>
  );
};
export default UserProperties;
