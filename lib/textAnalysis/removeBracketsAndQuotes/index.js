// takes a string
// removes "[" and "]"
export default function removeBracketsAndQuotes(s) {
  var punctuation = /[\[\]\"]/g;
  var newText = s.replace(punctuation, '');
  return newText;
}
