import { ShorthandPadding } from '../types/Padding';
import Size from '../types/Size';

function shorthandPaddingToStyle(align: ShorthandPadding): [keyof typeof Size, keyof typeof Size] {
  switch (align) {
    case 'large':
      return ['large', 'large'];
    //
    case 'xxsmall xxsmall':
      return ['xxsmall', 'xxsmall'];
    case 'xxsmall xsmall':
      return ['xxsmall', 'xsmall'];
    case 'xxsmall small':
      return ['xxsmall', 'small'];
    case 'xxsmall medium':
      return ['xxsmall', 'medium'];
    case 'xxsmall large':
      return ['xxsmall', 'large'];
    case 'xxsmall xlarge':
      return ['xxsmall', 'xlarge'];
    case 'xxsmall xxlarge':
      return ['xxsmall', 'xxlarge'];
    //
    case 'xsmall xxsmall':
      return ['xsmall', 'xxsmall'];
    case 'xsmall xsmall':
      return ['xsmall', 'xsmall'];
    case 'xsmall small':
      return ['xsmall', 'small'];
    case 'xsmall medium':
      return ['xsmall', 'medium'];
    case 'xsmall large':
      return ['xsmall', 'large'];
    case 'xsmall xlarge':
      return ['xsmall', 'xlarge'];
    case 'xsmall xxlarge':
      return ['xsmall', 'xxlarge'];
    //
    case 'small xxsmall':
      return ['small', 'xxsmall'];
    case 'small xsmall':
      return ['small', 'xsmall'];
    case 'small small':
      return ['small', 'small'];
    case 'small medium':
      return ['small', 'medium'];
    case 'small large':
      return ['small', 'large'];
    case 'small xlarge':
      return ['small', 'xlarge'];
    case 'small xxlarge':
      return ['small', 'xxlarge'];
    //
    case 'medium xxsmall':
      return ['medium', 'xxsmall'];
    case 'medium xsmall':
      return ['medium', 'xsmall'];
    case 'medium small':
      return ['medium', 'small'];
    case 'medium medium':
      return ['medium', 'medium'];
    case 'medium large':
      return ['medium', 'large'];
    case 'medium xlarge':
      return ['medium', 'xlarge'];
    case 'medium xxlarge':
      return ['medium', 'xxlarge'];
    //
    case 'large xxsmall':
      return ['large', 'xxsmall'];
    case 'large xsmall':
      return ['large', 'xsmall'];
    case 'large small':
      return ['large', 'small'];
    case 'large medium':
      return ['large', 'medium'];
    case 'large large':
      return ['large', 'large'];
    case 'large xlarge':
      return ['large', 'xlarge'];
    case 'large xxlarge':
      return ['large', 'xxlarge'];
  }

  return ['small', 'small'];
}

export {
  shorthandPaddingToStyle,
};
