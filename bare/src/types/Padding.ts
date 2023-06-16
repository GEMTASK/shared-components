const shorthandPadding = ['xxsmall xxsmall', 'xxsmall xsmall'] as const;

type X = typeof shorthandPadding[number];

const x: X = 'xxsmall xxsmall';

type ShorthandPadding =
  | 'large'
  //
  | 'xxsmall xxsmall'
  | 'xxsmall xsmall'
  | 'xxsmall small'
  | 'xxsmall medium'
  | 'xxsmall large'
  | 'xxsmall xlarge'
  | 'xxsmall xxlarge'
  //
  | 'xsmall xxsmall'
  | 'xsmall xsmall'
  | 'xsmall small'
  | 'xsmall medium'
  | 'xsmall large'
  | 'xsmall xlarge'
  | 'xsmall xxlarge'
  //
  | 'small xxsmall'
  | 'small xsmall'
  | 'small small'
  | 'small medium'
  | 'small large'
  | 'small xlarge'
  | 'small xxlarge'
  //
  | 'medium xxsmall'
  | 'medium xsmall'
  | 'medium small'
  | 'medium medium'
  | 'medium large'
  | 'medium xlarge'
  | 'medium xxlarge'
  //
  | 'large xxsmall'
  | 'large xsmall'
  | 'large small'
  | 'large medium'
  | 'large large'
  | 'large xlarge'
  | 'large xxlarge'
  ;

export type {
  ShorthandPadding
};
