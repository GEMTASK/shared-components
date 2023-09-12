import React, { useEffect, useRef, useState } from 'react';

import { Button, Divider, Icon, Slider, Spacer, Stack, Text, View } from 'bare';

const songs = [
  { title: 'Tomorrow', length: '4:54', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-tomorrow.mp3' },
  { title: 'Dubstep', length: '2:04', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-dubstep.mp3' },
  { title: 'Better Days', length: '2:33', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-betterdays.mp3' },
  { title: 'Sunny', length: '2:20', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-sunny.mp3' },
  { title: 'Evolution', length: '2:45', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-evolution.mp3' },
  { title: 'Dreams', length: '3:30', artist: 'Benjamin Tissot — www.bensound.com', uri: './audio/bensound-dreams.mp3' },
];

const Song = ({
  index,
  title,
  length,
  artist,
  selected,
  favorite,
  onSongSelect,
  onSongPlay
}: any) => {
  const handlePointerDown = () => {
    onSongSelect(index);
  };

  const handleDoubleClick = () => {
    onSongSelect(index);
    onSongPlay(index);
  };

  return (
    <View
      horizontal
      padding="small large"
      fillColor={selected ? 'blue-5' : undefined}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
    >
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
  console.log('Music()');

  const audioElementRef = useRef<HTMLAudioElement>(null);

  // const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  // const [activeSongIndex, setActiveSongIndex] = useState<number>(-1);

  const [selectedSongIndex, setSelectedSongIndex] = useState(1);
  const [activeSongIndex, setActiveSongIndex] = useState<number>(-1);
  const [favoriteIndexes, setFavoriteIndexes] = useState([2, 4]);

  const handleSongSelect = (index: number) => {
    setSelectedSongIndex(index);
  };

  const handleSongPlay = (index: number) => {
    setActiveSongIndex(index);
  };

  const handlePlayClick = () => {
    if (activeSongIndex >= 0) {
      setActiveSongIndex(-1);
    } else {
      setActiveSongIndex(selectedSongIndex);
    }
  };

  useEffect(() => {
    if (!audioElementRef.current) {
      return;
    }

    if (activeSongIndex >= 0) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [activeSongIndex]);

  return (
    <View {...props}>
      <View
        ref={audioElementRef}
        as="audio"
        src={activeSongIndex >= 0 ? songs[activeSongIndex].uri : undefined}
      // onLoadedMetadata={handleLoadMetaData}
      // onTimeUpdate={handleTimeUpdate}
      />
      <Stack flex divider dividerInset={16} style={{ overflowY: 'auto' }}>
        {songs.map(({ title, length, artist }, index) => (
          <Song
            key={index}
            index={index}
            title={title}
            length={length}
            artist={artist}
            selected={index === selectedSongIndex}
            favorite={favoriteIndexes.includes(index)}
            onSongSelect={handleSongSelect}
            onSongPlay={handleSongPlay}
          />
        ))}
      </Stack>
      <Divider />
      <View fillColor="gray-1" padding="large" style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        <Slider value={0} style={{ marginTop: -4 }} />
        <Spacer size="small" />
        <Stack horizontal spacing="large" align="center">
          <Button text iconSize="2x" icon="backward-step" titleTextColor="gray-6" />
          <Button text iconSize="4x" icon={activeSongIndex >= 0 ? 'stop-circle' : "play-circle"} titleTextColor="gray-6" onClick={handlePlayClick} />
          <Button text iconSize="2x" icon="forward-step" titleTextColor="gray-6" />
        </Stack>
      </View>
    </View>
  );
};

export default React.memo(Music);
