import { Text, View } from 'bare';

const Notes = () => {
  return (
    <Text flex padding="large large" innerProps={{ contentEditable: true, overflow: 'auto' }}>
      <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.</p>
    </Text>
  );
};

export default Notes;
