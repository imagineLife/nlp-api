export default function removePunctuation(text) {
  var punctuation = /[\.,?!]/g;
  var newText = text.replace(punctuation, '');
  return newText;
}
