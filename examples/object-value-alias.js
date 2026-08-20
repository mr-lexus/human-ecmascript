const original = { score: 1 };
let alias = original;

alias.score = 2;
console.log(original.score);

alias = { score: 3 };
console.log(original.score, alias.score);
