import View from '../view/index.js';

const Splitter = ({ children, ...props }: any) => {
  return (
    <View {...props}>
      {children}
    </View>
  );
};

export default Splitter;
