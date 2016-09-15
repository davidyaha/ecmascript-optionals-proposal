# Ecmascript optionals proposal

An open to discussion proposal of Swift like optionals in javascript.

This repository was opened to bring the power of optionals and optional chaining into javascript.

PR's are very welcome!

## Proposed Syntax
```javascript
// Optional member expression
let field = object?.field;

// Optional computed member expression
let field = object?['field'];

// Optional function call
object.func?();

// Optional chaining to get into deep fields
let field = object?.field?.func?()?['data'];

```

Semantically speaking, all of these syntax additions makes sense and comply with usage of the current "unsafe" `.`, `()`, `[]`.
The suggested syntax add the `?` to imply that the referred variable (or reference if you will) can be undefined and for that case we would like the whole expression to return as undefined.

## Desugaring

```javascript
// Optional member expression
var field = object && object.field;

// Optional computed member expression
var field = object && object['field'];

// Optional function call
typeof object.func === 'function' ? object.func() : null;

// Optional chaining to get into deep fields
var funcResult =  object && 
                  object.field && 
                  typeof object.field.func === 'function' ? object.field.func() : null;
var field =  funcResult && funcResult['data'];
```

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

## Another expample of where we miss out on optionals

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

## Syntax caveats

This syntax uses the `?` character which is otherwise used on the ternary operator `? :`. 
Backwards compatibility with examples like `useArray?[foo]:foo` 
(was brought to my attention on [issue #2 of another proposal repository](https://github.com/claudepache/es-optional-chaining/issues/2#issuecomment-247311512))
is in high priority and therefore the actual solution to allow for the suggested syntax, will have to keep
precedence for the ternary operator. This means that forward inspection is needed and may cause some
performance issues of the parser. After looking into the current implementation of babylon, I suggest that
 we will set performance issues aside until actual implementation and get back to this matter 
 if proven great impact on parsing speed.
 
 ```javascript
 // conditional statement or optional computed member expression?
 useArray?[foo]:foo;
 
 // With ternary precedence this should resolve as following:
 useArray ? ([foo]) : foo;
 
 // More complex example
 useArray?[foo]?[bar]:foo;
 
 // Should resolve as following:
 useArray ? ([foo]?[bar]) : foo;
 
 // And desugar as follows:
 useArray ? ([foo] && [foo][bar]) : foo;
 ```

## Current Roadmap:

- [X] Write a babel plugin to demonstrate the behaviour. (Pushed a naive implementation)
- [ ] Make an official TC39 proposal and look for a champion
- [ ] PR babylon with an optional flag to MemberExpression that will be triggered by the `?.` token or `?()` or `?[]`
- [ ] PR flow to raise errors when not used with "nullable" types

## Previous work

- A strawman - https://github.com/claudepache/es-optional-chaining/
- Discussion regurding the `?.` syntax - https://esdiscuss.org/topic/optional-chaining-aka-existential-operator-null-propagation
