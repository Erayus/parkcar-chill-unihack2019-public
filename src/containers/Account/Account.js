import React from 'react';
import classes from './Account.module.css'
const account =  () => {
  return (
      <div>
          <div className={classes.Account}>
              <img src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=60"/>
              <div >
                  <h4><strong>User name</strong></h4>
                  <h4><strong>Balance: $20</strong> </h4>
              </div>
          </div>
          <button className="btn btn-success btn-block mx-2">Top Up</button>

      </div>
  )
};

export default account;
