import React, {useEffect, useState} from 'react';
import {useStripe} from '@stripe/react-stripe-js';
import { useNavigate } from "react-router-dom";

export default function Review(props, route) {
  const stripe = useStripe();
  const navigate = useNavigate();

  const {confirmationToken} = props;
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [reviewSummary, setReviewSummary] = useState();

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  useEffect(() => {
    // getConfirmationToken Summaryddddd
    async function getSummary() {
      console.info("ℹ️ Confirmation token from previous page: " + confirmationToken);
      const response = await fetch('/summarize-payment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          confirmation_token_id: confirmationToken,
        }),
      });

      const json = await response.json();

      setReviewSummary(json.summary)
    }

    getSummary();
  }, [confirmationToken]);


  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log('stripe not enabled');
      return;
    }

    setLoading(true);

    // Create the PaymentIntent and obtain clientSecret
    const res = await fetch('/create-intent', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        confirmationTokenId: confirmationToken,
      }),
    });

    const response = await res.json();
    const error = response.error;

    console.log(response);

    if (!error && response.status === 'requires_action') {
      console.info("Calling stripe.handleNextAction")
      error  = await stripe.handleNextAction({clientSecret: response.clientSecret});
    }
    else if (!error && response.status === 'succeeded') {
      navigate('/done');
    }

    // Confirm the PaymentIntent using the details collected by the ConfirmationToken

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
    } else {
      console.log('done');
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
  <form onSubmit={handleSubmit}>
      <main class="c-checkout-step-review__main">
        <section class="c-checkout-step-review__section">
          <header class="c-checkout-step-review__section-header c-checkout-step-review__section-header-prescription">
            <p class="section-header">Prescription</p>
            <p class="edit-button">
              <button
                title="Edit prescription"
                id="c-checkout-step-review__edit--prescription"
                type="button"
                class="edit-button-edit"
              >
                Edit
              </button>
            </p>
          </header>
          <div class="subtitle-section">
            <div>We’ll email you some options to send us your prescription</div>
          </div>
        </section>
        <section class="c-checkout-step-review__section">
          <header class="c-checkout-step-review__section-header c-checkout-step-review__section-header-shipping">
            <p class="section-header">Shipping</p>
            <p class="edit-button">
              <button
                title="Edit shipping"
                id="c-checkout-step-review__edit--shipping"
                type="button"
                class="edit-button-edit"
              >
                Edit
              </button>
            </p>
          </header>
          <div class="subtitle-section">
            <div>Tori McQuinn</div>
            <div>1033 Hayne Ave SW </div>
            <div>Aiken, SC 29801-3729</div>
          </div>
        </section>
        <section class="c-checkout-step-review__section">
          <header class="c-checkout-step-review__section-header c-checkout-step-review__section-header-delivery">
            <p class="section-header">Delivery</p>
            <p class="edit-button">
              <button
                title="Edit delivery"
                id="c-checkout-step-review__edit--delivery"
                type="button"
                class="edit-button-edit"
              >
                Edit
              </button>
            </p>
          </header>
          <div class="subtitle-section">
            <div>Standard shipping (Free)</div>
            <div>
              Arrives 5-7 business days after we’ve verified your prescription
            </div>
            <div> (Expedited available for an additional fee)</div>
          </div>
        </section>
        <section class="c-checkout-step-review__section">
          <header class="c-checkout-step-review__section-header c-checkout-step-review__section-header-payment">
            <p class="section-header">Payment</p>
            <p class="edit-button">
              <button
                title="Edit payment"
                id="c-checkout-step-review__edit--payment"
                type="button"
                class="edit-button-edit"
              >
                Edit
              </button>
            </p>
          </header>
          {reviewSummary === undefined ? <div> not loaded </div> :
          <div class="css-1j7qcnw">
          { reviewSummary.type === 'card' ? 
            <div class="c-checkout-step-review__card">
              <div class="c-checkout-step-review__card-details">
                <img
                  class="c-checkout-step-review__card-brand"
                  src={`${reviewSummary.card.brand}.svg`}
                  height="30"
                  alt="creditCard"
                />
                <div class="subtitle-section">Credit card ending in {reviewSummary.card.last4}</div>
              </div>
            </div> : <div>Affirm</div>} 
          
          </div>
      }
        </section>
        <div class="c-checkout-step-review__promo">
          <button
            type="button"
            class="c-checkout-step-add-button__button c-checkout-step-add-button__button--minimal"
            id="c-checkout-step-payment__add-insurance-button-minimal"
            data-testid="add-insurance-button"
          >
            <img
              src="quick-add.svg"
              height="24"
              width="24"
              alt=""
              class="c-checkout-step-add-button__plus"
            />
            <span class="adds-summary">Check and apply benefits</span>
          </button>
        </div>
        <div class="c-checkout-step-review__promo">
          <button
            type="button"
            class="c-checkout-step-add-button__button c-checkout-step-add-button__button--minimal"
            id="c-checkout-step-payment__add-promo-button-minimal"
            data-testid="add-promo-button"
          >
            <img
              src="quick-add.svg"
              height="24"
              width="24"
              alt=""
              class="c-checkout-step-add-button__plus"
            />
            <span class="adds-summary">Add a gift card or promo code</span>
          </button>
        </div>
      </main>
      <button class="submit-button-review" type="submit" disabled={!stripe || loading}>
        Place order: $204.40
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
