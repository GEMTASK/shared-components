import React from 'react';

import Color from '../../types/Color';

interface ViewContext {
  parentHorizontal: boolean,
  parentFillColor?: Color,
}

const ViewContext = React.createContext<ViewContext>({
  parentHorizontal: false,
});

export default ViewContext;
