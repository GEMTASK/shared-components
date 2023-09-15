import { Link as RouterLink } from 'react-router-dom';

import { View, Text, Spacer, createLink } from 'bare';

const Link = createLink(RouterLink);

const About = () => {
  return (
    <View flex fillColor="gray-1" padding="large" align="center">
      <Text fontSize="large">React Desktop</Text>
      <Spacer size="xxlarge" />
      <Text textAlign="center">
        A React-based desktop environment, component library,<br />
        and integrated programming language (Kopi)
      </Text>
      <Spacer size="large" />
      <Text fontSize="xsmall" textColor="gray-6" textAlign="center">
        2022 – 2023 Mike Austin
      </Text>
      <Spacer size="xxlarge" />
      <Text textAlign="center" maxWidth={300}>
        <Link to="https://www.npmjs.com/package/open-color" target="_blank">open-color</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/react-jss" target="_blank">react-jss</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/clsx" target="_blank">clsx</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/react-responsive" target="_blank">react-responsive</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/uuid" target="_blank">uuid</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/@fortawesome/react-fontawesome" target="_blank">react-fontawesome</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/lorem-ipsum" target="_blank">lorem-ipsum</Link>
      </Text>
    </View>
  );
};

export default About;
