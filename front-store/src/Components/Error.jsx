import React from "react";
const Error = ({ status }) => {
  return (
    <div className="text-center page section section-center">
      {status === 404 ? (
        <h2>Route Not Found..</h2>
      ) : status === 505 ? (
        <h2>Server Error...</h2>
      ) : status === 201 ? (
        <h2>
          no post found
        </h2>
      )
      : (
        <h2>there was an error...</h2>
      )}
    </div>
  );
};

export default Error;
