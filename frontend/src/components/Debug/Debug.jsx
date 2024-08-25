import React from 'react';
import axios from "axios";

const Debug = ({isVisible}) => {
  const testRequests = async () => {
  }

  return (
    <>
      {
        isVisible &&
        (
          <div>
            <button
              onClick={() => testRequests()}
              className={"button-default"}
            >
              Test request
            </button>
          </div>
        )
      }
    </>
  );
};

export default Debug;