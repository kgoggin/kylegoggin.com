---
title: Announcing reason-react-apollo 🎉
date: 2019-10-03
---

I'm really happy to introduce a "new" project I'm open-sourcing, [reason-react-apollo](https://reason-react-apollo.kylegoggin.com)! I say "new" because, in actuality, I've been developing it over the past several months to support the ReasonML app we're building at [My Well](https://www.mywell.org).

So, what is it? At its core, reason-react-apollo is a set of bindings for Apollo's @apollo/react-hooks library. _But_, it also includes some powerful code-generation plugins (build on top of the awesome [GraphQL Code Generator](https://graphql-code-generator.com/) library) that make it a breeze to generate types for your GraphQL schema, plus types for the variables in your project's GraphQL _operations_.

## Abstract Types FTW

If you've been working with ReasonML and sought out a way to incorporate GraphQL, chances are you've seen [graphql_ppx](https://www.npmjs.com/package/graphql_ppx). It's a tool for generating types for your GraphQL operations, and it's used in most (all?) of the other GraphQL client bindings libraries that are out there today. When I first started working on our app at My Well, I started out using graphql_ppx to generate our operation types, alongside the [reason-apollo](https://www.npmjs.com/package/reason-apollo) bindings. But I grew frustrated early on when I discovered that I couldn't share my underlying GraphQL types around my app - each operation was given its own specific type!

After a good bit of trial and error with some different approaches, I landed on representing our GraphQL schema's types as abstract ReasonML types with getter functions. This allowed for sharing the types across the app, but also for run-time checks to ensure I hadn't left fields out of my query. If you're interested in learning more about this approach, [check out my recently-published post about it](./typing-graphql-operations-in-reason)!

reason-react-apollo provides tooling to generate your schema's types as abstract ReasonML types, _and_ generate query and mutation hooks that are typed for each of your operations' variables! In practice, it means you can write code that looks like this:

```reason
[@react.component]
let make () => {
  open Apollo.Queries.GetTodos;
  let variables = makeVariables(~filter=`ALL, ());
  let response = useQuery(~variables, ());
  switch (response) {
    | {loading: true} => <LoadingIndicator />
    | {error: Some(err)} => <ErrorDisplay err />
    | {data: Some(queryRoot)} =>
      let todos = queryRoot->Graphql.Query.todos;
      <TodosList todos />
  };
};
```

In the above example, everything in the `Apollo` and `Graphql` modules was generated for you automatically based on your GraphQL schema and the query/mutation operations you've defined for your project!

After building _lots_ of components this way, I've found it to be a suuuuper nice developer experience, and I think the other devs on my team agree 😄!

## How does it work?

To use reason-react-apollo in your GraphQL + ReasonML project, you'll need to set up [GraphQL Code Generator](https://graphql-code-generator.com/) with some plugins that accompany the bindings. _Technically_ the code-generation is optional and you _could_ use the bindings on their own, but then you'd need to define all your own types 😆. Once your codegen is set up correctly, you'll have access to:

1. All of your GraphQL's schema's types, described as abstract ReasonML types with functions for getting their underlying value
2. All of your project's GraphQL operations described as their own ReasonML module with hooks that accept typed variables, and a `makeVariables` function for creating them.

From there, you'll be ready to start writing reason-react components that incorporate your hooks! Make sure to check out the [documentation](https://reason-react-apollo.kylegoggin.com) for more details about how everything gets set up and works!

## How stable is it?

We've been using this project in its current form internally at My Well for the last few months, and it's working great. Our GraphQL schema has dozens of types, and we've got _lots_ of operations. That said, the underlying codegen hasn't been tested much beyond what we've thrown at it, so there's a chance it might generate so unusable code if your schema has something out of the ordinary.

Additionally, you'll notice that parts of the underlying Apollo API aren't fully implemented yet. If you find a piece that's missing, you've found something we haven't needed yet at My Well 😉. That said, the core functionality is there, and I'm excited to fill in the missing bits ASAP!

## Want to help out?

Contributions are very welcome! Probably the biggest help right now is real-world tests against other GraphQL schemas to make sure things are working properly, and for people to file an issues with any examples of the generated code not working properly. Beyond that, we'll hopefully be adding the rest of the Apollo API as time allows (we're about to ship our first release at My Well, so might be a little busy 😉).
