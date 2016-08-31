# Ecmascript optionals proposal

An open to discussion proposal of Swift like optionals in javascript.

This repository was opened to bring the power of optionals and optional chaining into javascript.

PR's are very welcome!

## Where we need optionals in JS

```javascript
// Lets define a box in js
let box = {};

// Now we will try to check the box content
console.log(box.content); // will output: undefined

// But what happens if we try to check for the contents of box2?
let box2;
console.log(box2.content); // Will throw an error telling you that 
                           // you cannot get to the content of undefined

// This is all well and good and kind of helpfull when 
// you want to track down bugs. But, sometimes box2 is likely to be undefined.
// And then your best option would be to check for existence with && operator.

// Conditionally getting the content of box2 or undefined
console.log(box2 && box2.content); 

// Or safely unwrapping without executing the actual command
if (box2 && box2.content)
  console.log(box2.content)
  
// But when you have a deeper nested objects this gets messy really quick
if (box2 && box2.content && box2.content.carrots && box2.content.carrots.stale)
  console.log(box2.content.carrots.stale);
  
// Or with functions
if (box2 && box2.content && typeof box2.content.countInvetory === 'function')
  box2.content.countInvetory();
  
// This could potentially be solved like this
box2?.content?.countInventory?();

```

## Where we really miss out on optionals

```javascript
var collection = [
  {
    a: 1
  },
  {
    b: {
      green: true
    }
  },
  {
    c: {
      black: 'opaque'
    }
  },
  {
    c: {
      black: 'opaque',
      backgroundColor() {
        return this.black;
      }
    }
  }
];

var result = collection.filter(function (obj) {
  return !!obj.a // No need for ?. notation here
});

// The following optional use
result = collection.filter(function(obj) {
  return !!obj.b?.green // NOTE the use of ?.
});

// Will be transpiled to the follwing
result = collection.filter(function(obj) {
  return !!(obj.b && obj.b.green)
});

// This optional function call
collection.forEach(function(obj) {
  console.log(obj.c?.backgroundColor?());
});

// Will be transpiled to
collection.forEach(function(obj) {
  obj.c && typeof obj.c.backgroundColor === 'function' ? console.log(obj.c.backgroundColor()) : void 0;
});

// And typically you would solve this scenario like this
collection.forEach(function(obj) {
  if (obj.c && typeof obj.c.backgroundColor === 'function')
    console.log(obj.c.backgroundColor());
});

```
## Current Roadmap:

- [X] Write a babel plugin to demonstrate the behaviour. (Pushed a naive implementation)
- [ ] Make an official TC39 proposal and look for a champion
- [ ] PR babylon with an optional flag to MemberExpression that will be triggered by the `?.` token or `?()` or `?[]`
- [ ] PR flow to raise errors when not used with "nullable" types

## Previous work

- A strawman - https://github.com/claudepache/es-optional-chaining/
- Discussion regurding the `?.` syntax - https://esdiscuss.org/topic/optional-chaining-aka-existential-operator-null-propagation
