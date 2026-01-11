import React from "react";
import "../../assets/styles/spinner.scss";

//  * Spinner component - Hiển thị loading spinner
const Spinner = ({ title, subtitle, className = "" }) => (
  <>
    <div class="spinner-follow-the-leader-circle">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </>
);

export default Spinner;
