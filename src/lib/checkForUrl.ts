import fuzzysort from 'fuzzysort';

// I am sure there is a more effective and "clever" way
// of doing the filtering, probably some lib

type TextToFilter = string;

type LikelyHasUrl = boolean;

const BANNED = [
  "net",
  "com",
  "org",
  "ocm",
  "dot net",
  "dot com",
  "dot org",
  "dot ocm",
  ". com",
  ". org",
  ". net",
  ". ocm",
  "dotorg",
  "dotcom",
  "dotnet",
  "dotocm",
  "(dot)com",
  "(dot)net",
  "(dot)org",
  "(dot)ocm",
];

export function filterForUrl(textToFilter: TextToFilter, confidenceLevel: number = 0.80): LikelyHasUrl {
  const confidence = [];

  if (doubleDotChar(textToFilter)) return true;

  for (const term of BANNED) {
    const res = fuzzysort.single(term, textToFilter)
    if (res && res.score >= confidenceLevel) {
      isNotPartOfLargerWord(term, res.target)
        && confidence.push(res.score)
    }
  }

  return confidence.some((x) => x >= confidenceLevel);
}

function isNotPartOfLargerWord(term: string, str: string): boolean {
  let position = str.indexOf(term);
  let leftIdx = position - 1;
  let rightIdx = position + term.length;

  if (
    surroundedBySpaces(str, leftIdx, rightIdx)
    || isEOL(str, leftIdx, rightIdx)
  ) return true;

  return false;
}

function surroundedBySpaces(str: string, leftIdx: number, rightIdx: number) {
  return isSpaceChar(str[leftIdx]) && isSpaceChar(str[rightIdx])
}

function isSpaceChar(char: string) {
  return char === " ";
}

function doubleDotChar(str: string): boolean {
  const annoying = [
    "..com",
    "..ocm",
    "..org",
    "..net"
  ];

  return annoying
    .map((x) => str.includes(x))
    .filter(Boolean)
    .length > 0
}

function isEOL(str: string, left: number, right: number): boolean {
  return isSpaceChar(str[left]) && (right === str.length);
}

