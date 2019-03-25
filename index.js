const fs = require("fs");
const path = require("path");

const content = fs
  .readFileSync(path.join(__dirname, "paragraphtest.txt"))
  .toString()
  .trim();

const pipe = (first, ...more) =>
  more.reduce((acc, curr) => (...args) => curr(acc(...args)), first);

function splitWords(text, regex) {
  const cleanPipe = pipe(cleanSpaces);
  const split = text.split(regex);
  const cleanedSplit = cleanPipe(split);
  return cleanedSplit;
}

function mapWordLength(words) {
  return words
    .map(str => str.toLowerCase())
    .reduce((tally, word) => {
      const length = word.length;
      tally[length] = tally[length]
        ? tally[length].includes(word)
          ? [...tally[length]]
          : [...tally[length], word]
        : [];
      return tally;
    }, {});
}

function tallyUp(words) {
  return words
    .map(function(str) {
      return str.toLowerCase();
    })
    .reduce(function(tally, word) {
      tally[word] = (tally[word] || 0) + 1;
      return tally;
    }, {});
}

function getBottom10(tally) {
  return Object.keys(tally)
    .map(function(word) {
      return { word: word, count: tally[word] };
    })
    .sort(function(one, other) {
      return one.count - other.count;
    })
    .slice(0, 10);
}

function getTop10(tally) {
  return Object.keys(tally)
    .map(function(word) {
      return { word: word, count: tally[word] };
    })
    .sort(function(one, other) {
      return other.count - one.count;
    })
    .slice(0, 10);
}

function getBottom10(tally) {
  return Object.keys(tally)
    .map(function(word) {
      return { word: word, count: tally[word] };
    })
    .sort(function(one, other) {
      return one.count - other.count;
    })
    .slice(0, 10);
}

function getTop10Shortest(tally) {
  return Object.keys(tally)
    .map(function(word) {
      return { word, count: tally[word] };
    })
    .sort(function(one, other) {
      return one.word - other.word;
    })
    .slice(0, 10);
}

function getTop10Largest(tally) {
  return Object.keys(tally)
    .map(function(word) {
      return { word, count: tally[word] };
    })
    .sort(function(one, other) {
      return other.word - one.word;
    })
    .slice(0, 10);
}

function sumChars(words) {
  const reduced = words.reduce((t, s) => {
    return t + s.length;
  }, 0);
  return reduced;
}

function sumLines(lines) {
  return lines.length;
}

function cleanSpaces(words) {
  const blocked = ["", " "];
  return words.filter(word => !blocked.includes(word));
}

const wordsPerParagraph = content => {
  const sum = content.reduce((a, b) => a.words.length + b.words.length);
  return sum / content.length;
};

const wordsPerParagraphCurried = (content, firstRegex) => {
  const paragraphs = splitWords(content, firstRegex);
  return secondRegex =>
    paragraphs.map((paragraph, index) => {
      return {
        paragraph: index,
        words: splitWords(paragraph, secondRegex)
      };
    });
};

const wordsPerLineCurried = (content, firstRegex) => {
  const lines = splitWords(content, firstRegex);
  return secondRegex =>
    lines.map((line, index) => {
      return { line: index, content: splitWords(line, secondRegex) };
    });
};

const wordsPerLine = lines => {
  const sum = lines.reduce((a, b) => {
    a += b.content.length;
    return a;
  }, 0);
  return sum / lines.length;
};

const filterDups = a => [...new Set(a)];

const top10Pipe = pipe(
  splitWords,
  tallyUp,
  getTop10,
  printTop10
);

const bottom10Pipe = pipe(
  splitWords,
  tallyUp,
  getBottom10,
  printBottom10
);

const charNumCleanPipe = pipe(
  splitWords,
  cleanSpaces,
  sumChars,
  printCharNum
);

const charNumDirtyPipe = pipe(
  splitWords,
  sumChars,
  printCharNumSpaces
);

const paragraphNumPipe = pipe(
  splitWords,
  sumLines,
  printParagraphNum
);

const linesNumPipe = pipe(
  splitWords,
  sumLines,
  printLineNum
);

const largestWordsPipe = pipe(
  splitWords,
  mapWordLength,
  getTop10Largest,
  printLargestWords
);

const shortestWordsPipe = pipe(
  splitWords,
  mapWordLength,
  getTop10Shortest,
  printShortestWords
);

const wordsNumPipe = pipe(
  splitWords,
  filterDups,
  printLength
);

/* ---- non-pure functions ------------ */

// printTop10 is the only non-pure function because
// it outputs text to the console - which is a side effect.
function printTop10(top10) {
  console.log("\nThe top 10 most frequently used:");
  console.log("--------------------------------");

  top10.forEach(function(entry, i) {
    let rank = i + 1;
    console.log(rank + ". " + entry.word + ": " + entry.count);
  });
  return top10; // to keep piping
}

function printBottom10(top10) {
  console.log("\nThe top 10 least frequently used:");
  console.log("--------------------------------");

  top10.forEach(function(entry, i) {
    let rank = i + 1;
    console.log(rank + ". " + entry.word + ": " + entry.count);
  });
  return top10; // to keep piping
}

function printCharNum(chars) {
  console.log("\nTotal number of chars w/o spaces");
  console.log("--------------------------------");
  console.log(`total: ${chars}`);
}

function printCharNumSpaces(chars) {
  console.log("\nTotal number of chars w/ spaces");
  console.log("--------------------------------");
  console.log(`total: ${chars}`);
}

function printLineNum(lines) {
  console.log("\nTotal number of lines");
  console.log("--------------------------------");
  console.log(`total: ${lines}`);
}

function printParagraphNum(paragraphs) {
  console.log("\nTotal number of paragraphs");
  console.log("--------------------------------");
  console.log(`total: ${paragraphs}`);
}

function printLength(words) {
  console.log("\nWords in text");
  console.log("--------------------------------");
  console.log(words);
  console.log(`total: ${words.length}`);
}

function printShortestWords(words) {
  console.log("\nThe top 10 shortest words:");
  console.log("--------------------------------");

  words.forEach(function(entry, i) {
    let rank = i + 1;
    console.log(rank + ". " + entry.word + ": " + entry.count);
  });
  return words; // to keep piping
}

function printLargestWords(words) {
  console.log("\nThe top 10 longest words:");
  console.log("--------------------------------");

  words.forEach(function(entry, i) {
    let rank = i + 1;
    console.log(rank + ". " + entry.word + ": " + entry.count);
  });
  return words; // to keep piping
}

function printStat(message, content) {
  console.log();
  console.log(message);
  console.log("--------------------------------");
  console.log(content);
}

top10Pipe(content, /[\s.,\/:\n]+/);
bottom10Pipe(content, /[\s.,\/:\n]+/);
charNumCleanPipe(content, /[\s]+/);
charNumDirtyPipe(content, /(\s+)/);
paragraphNumPipe(content, /\n\s*\n/);
linesNumPipe(content, /\r?\n/);
largestWordsPipe(content, /[\s.,\/:\n]+/);
shortestWordsPipe(content, /[\s.,\/:\n]+/);
wordsNumPipe(content, /[\s.,\/:\n]+/);
printStat(
  "Words per paragraph avg:",
  wordsPerParagraph(
    wordsPerParagraphCurried(content, /\n\s*\n/)(/[\s.,\/:\n]+/)
  )
);
printStat(
  "Lines per paragraph avg:",
  wordsPerParagraph(wordsPerParagraphCurried(content, /\n\s*\n/)(/\r?\n/))
);
printStat(
  "Words per line avg:",
  wordsPerLine(wordsPerLineCurried(content, /\r?\n/)(/[\s.,\/:\n]+/))
);
