import React, { useCallback, useEffect, useRef, useState } from 'react';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { ViewProps } from 'bare/dist/components/view';

const Label = ({ children, ...props }: any) => {
  return (
    <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6" {...props}>
      {children}
    </Text>
  );
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const today = new Date();
  const firstDayInMonth = new Date(today.getFullYear(), today.getMonth());
  const lastDayInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return (
    <>
      <View fillColor="gray-1">
        <View horizontal align="left" padding="large">
          <Text flex fontSize="large">
            <Text fontWeight="bold">{months[today.getMonth()]}{' '}</Text>
            {today.getFullYear()}
          </Text>
          <Stack horizontal spacing="small">
            <Button solid size="xsmall" icon="arrow-left" />
            <Button solid size="xsmall" icon="arrow-right" />
          </Stack>
        </View>
        <View horizontal paddingHorizontal="small">
          {days.map(day => (
            <Label key={day} flex align="right" paddingHorizontal="small">
              {day}
            </Label>
          ))}
        </View>
        <Spacer size="xsmall" />
      </View>
      <Divider />
      <Grid flex padding="small" columns={7}>
        {Array.from({ length: firstDayInMonth.getDay() }, (_, day) => (
          <Text key={day}></Text>
        ))}
        {Array.from({ length: lastDayInMonth }, (_, day) => (
          <Text
            key={day}
            align="top right"
            padding="small"
            fillColor={day + 1 === today.getDate() ? 'blue-5' : undefined}
            textColor={day + 1 === today.getDate() ? 'white' : undefined}
            fontWeight={day + 1 === today.getDate() ? 'bold' : undefined}
            style={{ borderRadius: 2.5 }}
          >
            {day + 1}
          </Text>
        ))}
      </Grid>
    </>
  );
};

export default Calendar;
