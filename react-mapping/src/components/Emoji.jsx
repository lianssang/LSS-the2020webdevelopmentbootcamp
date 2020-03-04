import React from 'react';

function Emoji(props) {
  return (
    <span className={'emoji'} role={'img'} aria-lable={'Tense Biceps'}>
      {props.emoji}
    </span>
  );
}

export default Emoji;
