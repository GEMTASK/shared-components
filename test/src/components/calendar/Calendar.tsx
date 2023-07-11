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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const firstDayInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth());
  const lastDayInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const handlePrevMonthClick = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonthClick = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const today = new Date();

  return (
    <>
      <View fillColor="gray-1">
        <View horizontal align="left" padding="large">
          <Text flex fontSize="large">
            <Text fontWeight="bold">{months[currentMonth.getMonth()]}{' '}</Text>
            {currentMonth.getFullYear()}
          </Text>
          <Stack horizontal spacing="small">
            <Button solid size="xsmall" icon="arrow-left" onClick={handlePrevMonthClick} />
            <Button solid size="xsmall" icon="arrow-right" onClick={handleNextMonthClick} />
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
            fillColor={currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth() && today.getDate() === day + 1 ? 'blue-5' : undefined}
            textColor={currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth() && today.getDate() === day + 1 ? 'white' : undefined}
            fontWeight={currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth() && today.getDate() === day + 1 ? 'bold' : undefined}
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
