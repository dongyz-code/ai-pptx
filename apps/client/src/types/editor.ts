export type AlignmentLineAxis = {
  x: number;
  y: number;
};

export type AlignmentLineProps = {
  type: 'horizontal' | 'vertical';
  axis: AlignmentLineAxis;
  length: number;
};
