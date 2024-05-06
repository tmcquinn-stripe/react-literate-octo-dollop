import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { useNavigate } from "react-router-dom";

const options = {
  layout: 'accordion',
  wallets: {
    applePay: 'never',
    googlePay: 'never'
  },
  defaultValues: {
    billingDetails: {
      email: 'tony@example.com',
      phone: '8034470448',
      address: {
        line1: '1033 Hayne Ave SW',
        city: 'aiken',
        state: 'sc',
        postal_code: '29801',
        country: 'us'
      }
    }
  },
  fields: {
    billingDetails: {
      address: {
      //  country: 'never'
      }
    }
  }
}



export default function CheckoutForm() {
  const history = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  
 const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  }

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const {error: submitError} = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the ConfirmationToken using the details collected by the Payment Element
    const {error, confirmationToken} = await stripe.createConfirmationToken({
      elements,
      params: {
        payment_method_data: {
          billing_details: {
            address: {
              line1: '1033 Hayne Ave SW',
              city: 'aiken',
              state: 'sc',
              postal_code: '29801',
              country: 'us'
            }
          }
        },
      }
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the ConfirmationToken. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      return;
    }
    else {
      console.log(confirmationToken.id);
      history('/completion', {state:{confirmation_token: confirmationToken.id}});
    }

    // Now that you have a ConfirmationToken, you can use it in the following steps to render a confirmation page or run additional validations on the server

    //TODO return fetchAndRenderSummary(confirmationToken)
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={options} />


      <button className="addi-button addi-top benefits"><img src="quick-add.svg" height="24" width="24" alt="" class="c-checkout-step-add-button__plus"/><span>Check and apply benefits</span></button>
      <button className="addi-button addi-bottom giftcard"><img src="quick-add.svg" height="24" width="24" alt="" class="c-checkout-step-add-button__plus"/><span>Add a gift card or promo code</span></button>


      <button className="review-button" type="submit" disabled={!stripe || loading}>
        Review your order
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};
