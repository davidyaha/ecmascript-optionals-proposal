# ecmascript optionals proposal

An open to discussion proposal of Swift like optionals in javascript.

This repository was opened to bring the power of optionals and optional chaining into javascript.

PR's are very welcome!

## Background on Swift

Swift is a strongly typed language. 
Optionals in Swift are a struct that may or may not hold the actual value that you will try to access.

Here is some swift examples of optionals for reference:

``` Swift
var box: String? // box could either have a real string value or a nil value

let content: String = "Bananas"

box = content

print(box) // will output: Optional("Bananas")

// To get rid of this Optional prefix you need to unwrap the Optional
print(box!) // will output: Bananas

// NOTE: This forced unwrpping could crash your application if content is nil!
// For that reason you could also soft unwrap or conditionaly unwrap an Optional

print("\(box ?? "")") // will output: Bananas

// We gave box a default value and lost the Optional.
// print is great to show us that Optional is a thing but how do you interact with the content?

box?.appendContentsOf(" and Oranges")

// Wait what? Why is this question mark there?
// Well, the Swift copiler will not let us access a method of box because it is an optional, 
// and as we already seen, it is a struct of it's own. Then we need to tell the compiler in
// someway to unwrap this value. This what the question mark is for. It tells the compiler to
// softly unwrap our box.

// Which is basically like writing the following condition
if box != nil {
  box!.appendContentsOf(" and Mangoes")
}

// One last cool way to unwrap an optional is this special if statement that defines a concrete type
// constant with the Optional value, only if it is not nil.
if let boxContent = box {
  print(boxContent) // will output: Bananas and Oranges and Mangoes
}

```

## Where we need optionals in JS

JS is not a strongly typed language. 

```es2015
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
// And then the options you have is pretty similar to Swift's

// Conditionally getting the content of box2
console.log(box2 && box2.content); 

// Or safely unwrapping
if (box2 && box2.content)
  console.log(box2.content)

```


## Current Roadmap:

[] Write babel plugin to allow every MemberExpression become a safe unwrap.
[] PR babylon with an optional flag to MemberExpression that will be triggered by the `?.` token or `?()` or `?[]`

