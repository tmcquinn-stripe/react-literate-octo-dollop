import { useLocation } from "react-router-dom";
import {Elements} from '@stripe/react-stripe-js';
import Review from './Review'
import React, {useEffect, useState} from 'react';

function Completion(props) {
  const location = useLocation();
  const { stripePromise } = props;
  const [confirmationToken, setConfirmationToken] = useState();

  React.useEffect(() => {
    if (location) {
      console.log(location)
      setConfirmationToken(location.state.confirmation_token);
    }
    else {
      console.log('no state')
    }
  }, [location]);
  //const [ clientSecret, setClientSecret ] = useState('');

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch("/create-payment-intent")
  //     .then((res) => res.json())
  //     .then(({clientSecret}) => setClientSecret(clientSecret));
  // }, []);

  const options = {

  }

  return (
    <>
      <h1 className="payment-title">Review Your Order</h1>
      <p className="order-total">Order total: $204.40</p>
      {stripePromise && (
        <Elements stripe={stripePromise} options={options} >
          <Review confirmationToken={confirmationToken}/>
        </Elements>
      )}
    </>
  );
}

export default Completion;
