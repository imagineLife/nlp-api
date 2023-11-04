// import natural from 'natural'

export default function buildArrOfSentences(txt) {
  const twoWhiteSpaces = /(\s{2})/gm;
  return txt
    .replace(twoWhiteSpaces, ' ')
    .match(
      /(?:(?!Mr|Ms|Dr|[.?!]).|Mr\.|Ms\.|Dr\.)*(?:(?!Mr|Ms|Dr|[.?!]).|Mr\.|Ms\.|Dr\.)*[\"!?:.]\"?/g
    )
    .map((s) => s.trim());
}
