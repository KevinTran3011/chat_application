import { ModifiedButton } from "./button.styles";

const ButtonComponent = ({ children, ...otherProps }) => {
  return <ModifiedButton {...otherProps}>{children}</ModifiedButton>;
};

export default ButtonComponent;
