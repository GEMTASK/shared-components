const shorthandPadding = ['xxsmall xxsmall', 'xxsmall xsmall'] as const;

type X = typeof shorthandPadding[number];

const x: X = 'xxsmall xxsmall';

type ShorthandPadding =
  | 'small'
  | 'small none'
  | 'medium'
  | 'medium none'
  | 'large'
  | 'large none'
  | 'xlarge'
  | 'xlarge none'
  | 'xxlarge'
  | 'xxlarge none'
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
  //
  | 'xlarge xxsmall'
  | 'xlarge xsmall'
  | 'xlarge small'
  | 'xlarge medium'
  | 'xlarge large'
  | 'xlarge xlarge'
  | 'xlarge xxlarge'
  //
  | 'xxlarge xxsmall'
  | 'xxlarge xsmall'
  | 'xxlarge small'
  | 'xxlarge medium'
  | 'xxlarge large'
  | 'xxlarge xlarge'
  | 'xxlarge xxlarge'
  ;

export type {
  ShorthandPadding
};
