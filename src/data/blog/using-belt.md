---
title: Use Belt To Hold Up Your ReasonML App
date: 2019-08-08
summary: Belt is ReasonML's new-ish standard library, but it's a little hard to find a good explanation of what it is and what you can do with it. Let's take a look at how you might want to use it in your Reason app!
---

Have you ever seen a reference to the `Belt` module in some ReasonML code and wondered what it was? Well, wonder no more! Here's a quick rundown on what `Belt` is, how you can use it, and why you might want to!

## What's Belt?

Belt is a "stdlib" that's shipped with BuckleScript. If you're like me (👋 non CS-degree over here!) you might not be familiar with the term "stdlib" - it's short for standard library, and it's a term used broadly to describe libraries of utility functions that accompany a language and make its code easier to write.

So, Belt is a standard library for BuckleScript, and it was designed with the intention to provide a "better end-to-end user experience" for devs using BuckleScript to turn their Reason code into JS.

Belt's technically still in "beta", but it's been shipped with the last several releases BuckleScript and (from everything I've been able to see) isn't really all that unstable. The team behind BuckleScript have also been really great about deprecating stuff if they need to, providing helpful warnings that point you in the right direction to upgrade your code if needed, so I wouldn't let the "beta" tag dissuade you from using it in your production code at this point!

## How Do I Use It?

Since it's included with BuckleScript, there's nothing you need to do to install Belt in a ReasonML project you've already set up! Belt is it's own global module, so you can access it just like any of the other included modules.

```reason
let myOpt = Some("hello");
Belt.Option.isSome(myOpt);
/* > true */
```

Since it's included in BuckleScript, you can also use [Reason's REPL](https://reasonml.github.io/en/try?rrjsx=true&reason=DYUwLgBAtgng8gB0gXggZQPZRACgEQAWIwwGeAlANwBQAQsWAHSJgCWGAdo6wM6bY5YLKtSA) to try out the various Belt methods to see how they work. This can be really helpful as you're learning some new APIs - just throw a contrived example together and see how everything will compile!

## Why Should I Use It?

Strictly speaking, you probably don't ever _have_ to use Belt. All of it's methods can be implemented by the core language somehow. That said, using Belt in your code can help make it easier to understand and read, especially when performing a bunch of transformations on some data all at once.

### Pipe First Syntax

One of the main advantages of Belt is that it embraces ["pipe first" syntax](https://bucklescript.github.io/docs/en/pipe-first) by standardizing that its methods take the thing you're operating on as the first argument. For all of its array utilities, for example, the array you're working with is the first argument:

```reason
let myArr = [|0, 1, 2|];
let mappedArr = myArr->Belt.Array.map(num => num * 2);
```

For a single method, this doesn't mean much, but it opens up the ability to chain methods together easily in a way that reads well:

```reason
let myArr = [|0, 1, 2|];
let mappedArr =
  myArr
  ->Belt.Array.map(number => number * 2)
  ->Belt.Array.map(number => number - 3);
```

The Pipe First syntax is optimized for compilation to JavaScript, and in most cases gets compiled away so that it doesn't incur any runtime performance overhead - so you get the affordance of code that easy to read without introducing any performance overhead!

## What Are Your Favorite Belt Methods?

Thanks for asking! Here are a couple I'm pretty fond of:

### Result

There's a whole blog post we could write about the Result type, but I'll try to cover the basics here.

How often do you have code that does A Thing, and if that Thing works you get some data back, but it could also have a problem trying to do that Thing and so you might get an error instead? Pretty much any time you do a network call, right?

The `Result` type standardizes the return value from a method call like that. It looks like this:

```reason
type result('data, 'error) =
  | Ok('data)
  | Error('error);
```

So, it's basically just a wrapper around whatever data type you hope to return, and whatever error you may expect to get back. Pretty simple, right? What's great about this is that it gives us an official paradigm for working with the "result" of methods that might fail, especially any kind of async work. Belt goes a step further and [provides some great utility functions](https://bucklescript.github.io/bucklescript/api/Belt.Result.html) that work directly with the result type. Once you start using this in your code, you'll start to see a lot of pattern's emerge in how you work with your data, and it opens up some other great abstractions you can write for your specific use case!

### Option

Besides `Result`, the module I most often find myself reaching for is [Belt's `Option` utilities.](https://bucklescript.github.io/bucklescript/api/Belt.Option.html) All of these are pretty simple, but they come in handy quite frequently! Here are a couple of quick examples:

```reason
/* get the value of an option, with a default if it's none */
let newStr: string = Some("hi")->Belt.Option.getWithDefault("bye");
/* > "hi" */
let otherStr: string = None->Belt.Option.getWithDefault("bye");
/* > "bye" */

/* map over an option, provide a default value if it's None */
let newNum: int = Some(5)->Belt.Option.mapWithDefault(10, number => number * 2);
/* > 10 */
let otherNum: int = None->Belt.Option.mapWithDefault(10, number => number * 2);
/* > 10 */
```

## Belt It Out

I hope this introduction gives you a good idea of where you can get started using Belt in your own ReasonML projects! If you need more information about all the various utilities, check out [Belt's documentation](https://bucklescript.github.io/bucklescript/api/Belt.html) - or you can do what I do, type `Belt.` in my editor and wait for the intellisense to kick in and tell me what I can do from there 😆.
