"use client";

import axios from 'axios';

import { useCallback, useEffect, useState } from 'react';

function PaymentForm() {
  const [loading, setLoading] = useState(true);

  const renderPaymentForm = useCallback(async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/checkout");
      const checkoutId = res.data.id;

      // Check if the script already exists
      if (!document.querySelector(`script[src*="paymentWidgets.js"]`)) {
        const script = document.createElement("script");
        script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
        script.async = true;
        document.body.appendChild(script);
      }

      // Check if the form already exists
      if (!document.querySelector("form.paymentWidgets")) {
        const form = document.createElement("form");
        form.action = "http://localhost:3000/result";
        form.setAttribute("class", "paymentWidgets");
        form.setAttribute("data-brands", "VISA MASTER AMEX");
        document.body.appendChild(form);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching checkout data:", error);
    }
  }, []);

  useEffect(() => {
    renderPaymentForm();

    // Cleanup function to remove the script and form when the component unmounts
    return () => {
      const script = document.querySelector(`script[src*="paymentWidgets.js"]`);
      if (script) {
        document.body.removeChild(script);
      }
      const form = document.querySelector("form.paymentWidgets");
      if (form) {
        document.body.removeChild(form);
      }
    };
  }, [renderPaymentForm]);

  if (loading) {
    return <div>Still Loading</div>;
  }

  return null;
}

export default PaymentForm;
