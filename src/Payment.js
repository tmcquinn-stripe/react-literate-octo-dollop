import {useEffect, useState} from 'react';

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'

function Payment(props) {
  const { stripePromise } = props;
  //const [ clientSecret, setClientSecret ] = useState('');

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch("/create-payment-intent")
  //     .then((res) => res.json())
  //     .then(({clientSecret}) => setClientSecret(clientSecret));
  // }, []);

  const appearance = {
    theme: 'stripe',
    variables: {
      borderRadius: '15px',
      colorPrimary: '#414b56',
      fontFamily: 'roboto, sans-serif',
      spacingUnit: '5px',
      fontSizeBase: '18px'
    },
    rules: {
      '.Action': {
        color: 'rgb(0, 110, 165)'
      } 

    }
  }

  const options = {
    amount:20440,
    currency: 'usd',
    mode: 'payment',
    externalPaymentMethodTypes: ['external_paypal'],
    appearance: appearance
  }

  return (
    <>
      <h1 className="payment-title">How do you want to pay?</h1>
      <p className="order-total">Order total: $204.40</p>
      {stripePromise && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
