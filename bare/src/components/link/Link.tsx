// import { Link as RouterLink } from 'react-router-dom';
import Text, { TextProps } from '../text/index.js';

// type LinkProps = TextProps<'a'> & React.ComponentProps<typeof RouterLink>;

const createLink = <T extends React.ElementType>(Component: T) => ({
  children,
  to,
  target,
  ...props
}: TextProps<'a'> & React.ComponentProps<T>) => {
  return (
    <Text inner={Component} innerProps={{ to, target }} textColor="blue-5" {...props}>
      {children}
    </Text>
  );
};

export default createLink;
