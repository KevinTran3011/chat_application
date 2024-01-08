/* eslint-disable react/prop-types */
import React from "react";
import { Input } from "./input.style";

const InputComponent = React.forwardRef(({ placeholder, ...props }, ref) => {
  return <Input placeholder={placeholder} {...props} ref={ref} />;
});

export default InputComponent;
