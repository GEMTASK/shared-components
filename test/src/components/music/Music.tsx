import { useState } from 'react';

import { Button, Divider, Icon, Slider, Spacer, Stack, Text, View } from 'bare';

const songs = [
  { title: 'Tomorrow', length: '4:54', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-tomorrow.mp3' },
  { title: 'Dubstep', length: '2:04', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-dubstep.mp3' },
  { title: 'Better Days', length: '2:33', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-betterdays.mp3' },
  { title: 'Sunny', length: '2:20', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-sunny.mp3' },
  { title: 'Evolution', length: '2:45', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-evolution.mp3' },
  { title: 'Dreams', length: '3:30', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-dreams.mp3' },
];

const Song = ({ index, title, length, artist, selected, favorite, onSongSelect }: any) => {
  return (
    <View horizontal padding="small large" fillColor={selected ? 'blue-5' : undefined} onPointerDown={() => onSongSelect(index)}>
      <View flex>
        <Text textColor={selected ? 'white' : undefined}>
          <Text fontWeight="semibold">{title}</Text>
          &nbsp;
          (<Text fontSize="xsmall">{length})</Text>
        </Text>
        <Spacer size="small" />
        <Text fontSize="xsmall" fontWeight="medium" textColor={selected ? 'gray-3' : 'gray-6'}>
          {artist}
        </Text>
      </View>
      <Icon icon="heart" color={favorite ? 'red-5' : 'gray-4'} />
    </View>
  );
};

const Music = ({ ...props }: any) => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [favoriteIndexes, setFavoriteIndexes] = useState([2, 4]);

  const handleSongSelect = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <View {...props}>
      <Stack divider dividerInset={16} style={{ overflowY: 'auto' }}>
        {songs.map(({ title, length, artist }, index) => (
          <Song
            key={index}
            index={index}
            title={title}
            length={length}
            artist={artist}
            selected={index === selectedIndex}
            favorite={favoriteIndexes.includes(index)}
            onSongSelect={handleSongSelect}
          />
        ))}
      </Stack>
      <Divider />
      <View fillColor="gray-1" padding="large" style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        <Slider value={0} style={{ marginTop: -4 }} />
        <Spacer size="small" />
        <Stack horizontal spacing="large" align="center">
          <Button text iconSize="2x" icon="backward-step" />
          <Button text iconSize="4x" icon="play-circle" />
          <Button text iconSize="2x" icon="forward-step" />
        </Stack>
      </View>
    </View>
  );
};

export default Music;
