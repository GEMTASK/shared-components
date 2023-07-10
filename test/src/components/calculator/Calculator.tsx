import React, { useCallback, useEffect, useRef, useState } from 'react';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { ViewProps } from 'bare/dist/components/view';

const Calculator = () => {
  return (
    <>
      <View fillColor="white">
        <Text fontSize="xlarge" textAlign="right" padding="large small">3.14159</Text>
      </View>
      <Divider />
      <Grid flex fillColor="gray-1" padding="small" columns={4} style={{ gap: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        <Button solid title="C" style={{ minWidth: 0 }} />
        <Button solid title="÷" style={{ minWidth: 0 }} />
        <Button solid title="×" style={{ minWidth: 0 }} />
        <Button solid title="−" style={{ minWidth: 0 }} />
        <Button solid title="7" style={{ minWidth: 0 }} />
        <Button solid title="8" style={{ minWidth: 0 }} />
        <Button solid title="9" style={{ minWidth: 0 }} />
        <Button solid title="+" style={{ minWidth: 0, gridColumnStart: 4, gridRow: '2 / 4' }} />
        <Button solid title="4" style={{ minWidth: 0 }} />
        <Button solid title="5" style={{ minWidth: 0 }} />
        <Button solid title="6" style={{ minWidth: 0 }} />
        <Button solid title="1" style={{ minWidth: 0 }} />
        <Button solid title="2" style={{ minWidth: 0 }} />
        <Button solid title="3" style={{ minWidth: 0 }} />
        <Button solid title="=" style={{ minWidth: 0, gridColumnStart: 4, gridRow: '4 / 6' }} />
        <Button solid title="0" style={{ minWidth: 0, gridColumn: '1 / 3' }} />
        <Button solid title="." style={{ minWidth: 0 }} />
      </Grid>
    </>
  );
};

export default Calculator;
