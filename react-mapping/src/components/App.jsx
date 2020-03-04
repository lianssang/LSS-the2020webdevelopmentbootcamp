import React from 'react';
import Entry from './Entry';
import emojipedia from '../emojipedia';

function createEntry(term) {
  return (
    <Entry
      key={term.id}
      emojiIcon={term.emoji}
      emojiName={term.name}
      emojiMeaning={term.meaning}
    />
  );
}

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>
      <dl className="dictionary">{emojipedia.map(createEntry)}</dl>
    </div>
  );
}

export default App;
