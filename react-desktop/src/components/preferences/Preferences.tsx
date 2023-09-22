import React, { useState } from 'react';

import { Checkbox, Spacer, Tabs, View } from 'bare';

const Preferences = ({ ...props }: any) => {
  console.log('Preferences()');

  const [useCollapsed, setUseCollapsed] = useState(false);

  return (
    <View {...props} fillColor="gray-1">
      <Spacer size="large" />
      <Tabs flex labels={['General', 'Background', 'Colors']}>
        <View flex fillColor="white" padding="large">
          <Checkbox
            label="Use collapsed titlebars"
            value={useCollapsed}
            onValueChange={(value: boolean) => setUseCollapsed(value)}
          />
        </View>
      </Tabs>
    </View>
  );
};

export default React.memo(Preferences);
