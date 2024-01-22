// Import necessary modules and libraries"use client";
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the functional component named Home
export default function Home() {
  // State variables to manage component state
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [convertedResult, setConvertedResult] = useState(null);

  // useEffect to fetch currencies from the server on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/currencies")
      .then((response) => setCurrencies(response.data))
      .catch((error) => console.error("Error fetching currencies", error));
  }, []);

  // Function to convert currency when the "Convert" button is clicked
  const convertCurrency = () => {
    axios
      .get(
        `http://localhost:8000/api/convert/${fromCurrency}/${toCurrency}/${amount}`
      )
      .then((response) => setConvertedResult(response.data.converted_amount))
      .catch((error) => console.error("Error converting currency:", error));
  };

  // Render the component with JSX
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="bg-light py-5 border border-3 rounded-5 shadow-lg px-5 col-9">
        <h1 className="text center mb-5">Fx Currency Converter</h1>

        {/* Dropdown for selecting the source currency */}
        <div className="d-flex">
          <div className="col-6 px-3">
            <h3> From</h3>
            <select
              className="form-select form-select-lg mb-3"
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown for selecting the target currency */}
          <div className="col-6 px-3">
            <h3>To</h3>
            <select
              className="form-select form-select-lg mb-3"
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input field for entering the amount */}
        <div className="px-3 mt-3 mb-5">
          <h3>Amount</h3>
          <input
            type="number"
            className="form-control form-control-lg mb-3 "
            onChange={(e) => setAmount(e.target.value)}
          ></input>

          {/* Button to trigger the currency conversion */}
          <button className="btn btn-success" onClick={convertCurrency}>
            Convert
          </button>
        </div>

        {/* Display the result of the currency conversion */}
        {convertedResult && (
          <p className="fs-3">
            {" "}
            {amount} {fromCurrency} = {convertedResult} {toCurrency}{" "}
          </p>
        )}
      </div>
    </div>
  );
}
