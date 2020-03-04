import React from 'react';
import Emoji from './Emoji';
import EmojiTitle from './EmojiTitle';
import EmojiDetail from './EmojiDetail';
import emojipedia from '../emojipedia.js';

function Entry(props) {
  return (
    <div className={'term'}>
      <dt>
        <Emoji emoji={props.emojiIcon}></Emoji>
        <EmojiTitle emojiName={props.emojiName}></EmojiTitle>
      </dt>
      <EmojiDetail emojiMeaning={props.emojiMeaning}></EmojiDetail>
    </div>
  );
}

export default Entry;
