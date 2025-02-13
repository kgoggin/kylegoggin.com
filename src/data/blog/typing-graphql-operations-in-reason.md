---
title: Typing GraphQL Operations in ReasonML
date: 2019-10-01
summary: GraphQL operations are tricky to type well because of their somewhat dynamic nature. graphql-ppx solves this to an extend, but I'd like to propose an alternative approach that allows for more reuse between different parts of your app.
---

How do you type your GraphQL schema on the client side of your application? It seems like an easy question to answer, but it's actually deceivingly tricky. GraphQL's inherent ability to fetch different shapes of data based on the query structure makes typing query responses worthy of some careful thought.

Let's take a look at some different approaches, along with the pros and cons of each!

## Approach #1: A Type For Each Schema Type

This approach is pretty easy to explain: your GraphQL schema is made up of a bunch of types, right? So, let's just make a Reason type for each of those types and call it a day. The understanding of what a `User` is gets shared between the schema and the frontend code, and you can define components that need a prop of type `User` and be able to tell, at a glance, what they're about and what kind of data they're working with.

But here's where a core feature of GraphQL butts up against our simplistic type definition: a GraphQL's operation result may or may not contain any specific field that's defined on a GraphQL type! If we treat the `User` type as equivalent throughout our project, but then query different fields on it in different places, we're likely going to run into a situation where a component is missing a field it's expecting to have, and there's no way for our types to warn us of this.

You _could_ type each field as potentially undefined (and then also nullable on top of that, for fields that aren't non-null in the schema), but then you've got a whole extra layer of unwrapping to do at every point you actually need to use it. And that's no fun.

## Approach #2: A Type For Each Operation

With this approach, we avoid the pitfalls of Approach #1 by creating a specific type for each operation in your project that contains all of the fields that are actually included in your query - and none of the fields that aren't. Now you can work with confidence in your types, knowing you can't accidentally try to access a field you didn't query.

But, there's also a downside. Since each type applies only to that one operation, what is actually one type in your GraphQL schema (say, a `User`), gets represented across your project in different ways depending on how it's queried. This might not sound like that big of a deal, but I'd argue that in a reasonably large or complex app, you can use all the help you can get making sense of things, and the ability to understand at a glance that two components are working with the same GraphQL data from their type definition can really help someone navigating a codebase.

Despite this downside, this is the approach most (all?) of the existing solutions take. In the Reason world, the most well-known is [graphql-ppx](https://github.com/mhallin/graphql_ppx), which auto-generates types for you based on your operation definitions. Even most TypeScript codegen tools follow this approach.

Wouldn't it be great if we could combine the ease of use of types based directly on our schema's types, with the confidence we get from knowing we're not trying to use a field we haven't actually queried?

## Approach #3: Abstract Types With Runtime Field Checking

Abstract types to the rescue! In any typed language, an _abstract type_ is a type without a definition (or with an incomplete definition). Reason (or, more precisely, BuckleScript) actually provides a helper you've probably already encountered for defining an abstract type that's based on an underlying JS object:

```reason
[@bs.deriving abstract]
type person = {
  firstName: string,
  lastName: string
};
```

Reason treats this as an abstract type in that you can't directly access it's properties; you have to use getter/setter functions:

```reason
let myName = firstNameGet(person);
```

So, how does this help us with typing GraphQL schemas? If we model our schema types as abstract types with getter functions, we can do something like this:

```reason
let graphQLResponse: Query.t;
let firstName = graphQLResponse->personGet->firstNameGet;
```

Where `personGet` is a getter on the `Query.t` type for the `person` field, and `firstNameGet` is a getter for the `firstName` field on our `Person.t` type.

Since these are functions, we have the opportunity to do add some extra logic to them at runtime! For instance, we can verify that the `firstName` field actually exists on the underlying JSON object we think is a `Person.t`, and throw a very helpful error if it doesn't.

Here's the thing about trying to use a field you haven't fetched: it'll almost _always_ turn up as a problem during development, way before the code ever gets shipped to a user. Think about it: can you actually imagine a scenario where that issue would escape a developer's notice, let alone QA? If the data you're needing isn't there, the developer will notice, and if there's a helpful error message to boot, it'll be super simple to fix! Sure, it'd be _slightly_ better to catch it with the type system, but catching it a runtime instead is a small price to pay for the benefit of keeping your types closely aligned with your schema!

## What's Best For You?

It's probably not a surprise that I'm partial to the abstract types approach. At my company, we started using this approach several months ago (combined with some codegen tooling I wrote) and it's been a really nice experience for us. I love moving between my GraphQL code and my client-side code and knowing that the type names line up, and being able to tell what a particular component is working with from its type definition!

That said, the popularity of tools like graphql-ppx prove that you can absolutely build an app with operation-specific types... and probably even with non-abstract, schema-specific types, too! I think the key is, as always, to know the tradeoffs inherent in any approach, and make the best decision for your project. I hope this post helps shed some light on your options!
