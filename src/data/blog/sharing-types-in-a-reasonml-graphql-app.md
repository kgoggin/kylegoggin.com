---
title: Sharing Types in a ReasonML/GraphQL App
date: 2018-04-10
summary: When I started building an app in ReasonML with a GraphQL backend, I wanted a way to share the types for my queries and mutations around the app. In this post I'll dive into how that can work, and some of the tradeoffs.
---

> Update 10/01/2019:
> I've refined my approach to defining GraphQL types in Reason! For my most up-to-date thoughts, take a look at [this more recent post](./typing-graphql-operations-in-reason)!

ReasonML and GraphQL sound like a match made in type heaven! But, due to GraphQL’s dynamic data structure on the client, typing your query responses in Reason is actually trickier that it first appears. In this post, I’ll show you how you can create reusable Reason types that correspond to your backend GraphQL schema and use then them in your client-side app to correctly type your query responses.

A quick programming note: this post assumes a basic knowledge of ReasonML types and an understanding of how GraphQL works. If you’re new to either one of these, may I recommend a little pre-reading? [Reason’s documentation](https://reasonml.github.io/docs/en/overview.html) provides a fantastic overview of how to use its many amazing features, and [here’s a great place to dive in with GraphQL](https://graphql.org/learn/).

## Starting Out: graphql_ppx

If you’re diving into building an app in Reason with GraphQL, you may have already discovered [reason-apollo](https://github.com/apollographql/reason-apollo) - it provides Reason bindings on top of the [Apollo](https://www.apollographql.com/) GraphQL client and is a great starting place. But if you’ve got another client in mind, fear not! What I’m about to go over would work equally well with just about any client out there.

If you follow the README for reason-apollo, you’ll find yourself installing something called graphql_ppx and adding it to your bsconfig.json as a `ppx-flag`. So, what’s all this then? Put simply, PPX is a language feature in OCaml that allows for writing macros that get executed at build time. In this case, graphql_ppx is used to analyze your query string and auto-generate a type for it, as well as a way to parse the raw JSON your server returns into that auto-generated type for you to use and enjoy. Sweet, right? This is exactly the kind of integration you’d hope to see between two strongly-typed languages!

Well, not so fast. Yes, this functionality is pretty handy, especially for getting started quickly with pulling some GraphQL goodness into your otherwise boring app. But, to see where this approach breaks down, let’s take a look at a pretty common use case where GraphQL shines:

```graphql
/* Query for list view */
query allMovies {
  allMovies {
    id
    name
    yearReleased
  }
}

/* Query for details view */
query movieDetail($id:ID!) {
  movie(id:$id) {
    id
    name
    rating
    runTime
  }
}
```

We’d use the above queries in an app to first fetch a list of several movies, then fetch the details for a specific movie (presumably once it was clicked on). Breaking it up as two separate queries means we don’t over-fetch data in the initial list - perf win! Now, here’s the catch: even though these queries are based on the same underlying GraphQL type (Movie), the auto-generated type graphql_ppx provides will be different for each query, as it’s based on the fields you actually ask for! So, the first query will have three fields, (`id`, `name`, and `yearReleased`) while the second query will have four (`id`, `name`, `rating`, and `runTime`). Reason will consider the movie objects that you get back from these queries as two distinct types, which means you can’t define a single `movie` type that you can reuse in more than one place (as you’d otherwise be very likely and wise to do).

Let me back up for a minute and say that I don’t think the way graphql_ppx works here is “wrong” per se. Since any given GraphQL field may or may not be fetched for any given query, it actually complicates the process of statically typing query responses on the client. Treating each unique query as a unique type is a valid way of handling this, and may work for you if your app isn’t that complex. But, if you’ve got a data-heavy app that’s sufficiently complicated, I’d say that not being able to share type definitions across views is going to end up costing you in the long run in terms of time and complexity. So, what can we do about it?

Fortunately, we’re not locked in to using graphql_ppx in either reason-apollo nor any other GraphQL client. We just need to replace what graphql_ppx brings to the table for us, which means we need to do two things:

1.  Define types that correspond to our GraphQL schema types
2.  Provide a way to parse the JSON response we get back from a query and transform it into these types.

## Defining GraphQL Types as Reason Records

This part is pretty straightforward. Open up your GraphQL schema definition, and take a look at all the types you’ve defined. For each type, I’d suggest creating a new ([module](https://reasonml.github.io/docs/en/module.html)) with the same name as your type, and use the Reason convention of defining a `type t` that represents that “thing”. So, our Movie type would look like this:

```graphql
# GraphQL schema definition
type Movie {
  id: ID!
  name: String!
  rating: String
  runTime: Int
}
```

```reason
/* Movie.re */

type t = {
  id: string,
  name: string,
  rating: Js.null(string),
  runTime: Js.null(int)
};
```

This is a faithful reproduction of our GraphQL Movie type as a ReasonML record. Note that we’re being explicit about which fields may return `null`! But, there’s one problem: as we already covered, the nature of a GraphQL query means that every field may or may not be fetched in any given query. But our type currently expects each field to always be present (even if it’s `null`). We can get around this by saying that each field is actually “optional” - it may or may not be present in a Movie type depending on whether or not we actually asked for it in our query. Let’s re-write our Movie module to account for this:

```reason
/* Movie.re */

type t = {
  id: option(string),
  name: option(string),
  rating: option(Js.null(string)),
  runTime: option(Js.null(int))
};
```

There! Now we’re differentiating between a field being “optional” - that is, it may or may not be fetched, which is true of all fields - and “nullable” - that the field may or may not be `null`. Type safety FTW!

## Decoding JSON Responses

Now that we’ve got our movie type defined, we can move on to writing a decoder for it. Just to reiterate, the reason we need to do this is that the response we get back from a query is typed as JSON - we need a way to convert it into the nice, much-easier-to-use record type we’ve just defined.

When it comes to parsing JSON in Reason, your one-stop-shop is Glenn Slotte’s excellent [bs-json library](https://github.com/glennsl/bs-json). It provides decoders for generic types, but is also extremely composeable so we can create our own decoders, which will really come in handy. Let’s take a stab at a decoder for our movie type:

```reason
/* Movie.re */

type t = {
  id: option(string),
  name: option(string),
  rating: option(Js.null(string)),
  runTime: option(Js.null(int))
};

let decode = json => {
  Json.Decode.{
    id: optional(field("id", string)),
    title: optional(field("name", string)),
    rating: optional(field("rating", nullable(string))),
    runTime: optional(field("runTime", nullable(int)))
  }
};
```

bs-json’s `optional` wrapper tells the decoder to not worry if that field is not a part of the JSON, so it accommodates our use case where a query response won’t include certain fields quite nicely. And `nullable` handles the fields we’ve defined as.... nullable. One thing that’s a little annoying is all the nested function calls needed, but not to worry! Here are some helpers that’ll come in handy:

```reason
let optionalField = (fieldName, decode) =>
    Json.Decode.(optional(field(fieldName, decoder)));
let optionalNullableField = (fieldName, decoder) =>
    Json.Decode.(optional(field(fieldName, nullable(decoder))));
```

Now we can re-write our decoder like so:

```reason
let decode = json => {
  Json.Decode.{
    id: optionalField("id", string),
    title: optionalField("name", string),
    rating: optionalNullableField("rating", string),
    runTime: optionalNullableField("runTime", int)
  }
};
```

Ah, much better 😃.

## Parsing the Query Root

Okay, so we can parse some JSON that represents a movie. But, we’re still not quite ready to parse our entire query response yet. We need a way to parse the root of the query, which for our example we’ll assume looks like this:

```graphql
type Query {
  allMovies: [Movie]
  movie: Movie
}
```

Let’s spin up a new module called QueryRoot.re:

```reason
/* QueryRoot.re */

type t = {
  movies: option(Js.null(list(Movie.t)))
  movie: option(Js.null(Movie.t))
};

let decode = json => {
  Json.Decode.{
    movies: optionalNullableField("movies", list(Movie.decode)),
    movie: optionalNullableField(“movie”, Movie.decode)
  }
};
```

Looks pretty familiar, right? We’ve defined our QueryRoot type, and a decoder method to go with it. And, notice what we’ve done with our decoder? It’s using bs-json’s `list` decoder to say we want a list of entities, but then we’re passing it our Movie decoder to tell it how to handle each item in that list. We’ve composed our Query Root decoder using our Movie decoder!

As we add additional root fields to our schema, we can add them to our root decoder. And, if we add some additional types, we can create matching modules to define our Reason type and decoder function, then compose it all together!

## Working With a Response

With our type definitions and decoders written, we’re ready to handle any possible response from a query against our schema. In fact, we can write a nice helper component that’ll do all the work for us! Assuming we’re using Reason bindings that map to the [react-apollo Query component](https://www.apollographql.com/docs/react/essentials/queries.html#basic) , it’d look something like this:

```reason
type response =
  | Loading
  | Error(string)
  | Loaded(QueryRoot.t);

let component = ReasonReact.statelessComponent("Query");

let make = (~query: string, ~variables=?, children) => {
  ...component,
  render: _self =>
    <ReactApollo.Query query ?variables>
      ...(
           ({data, error, loading}: ReactApollo.response) => {
             let r =
               switch (loading, error, data) {
               /* lots of pattern matching options! */
               | (false, None, Some(data)) => Loaded(data |> QueryRoot.decode)
               };
             children(r);
           }
         )
    </ReactApollo.Query>,
};
```

Now when we use our `<Query/>` component, it’ll provide our nicely-typed `QueryRoot.t` shape once the data has loaded.

## Un-wrapping optional/nullable fields

Within a couple of minutes of actually using this approach, you’ll probably discover what a pain it is to deal with record fields that are both optional AND nullable. If we wanted to get at our `runTime` field for example, we’d have do this:

```reason
let runTime: int = switch (movie.runTime) {
  | None => /* uh, zero I guess? */ 0
  | Some(rt) => switch (rt |> Js.Null.toOption) {
    | None => 0
    | Some(reallyRealRunTime) => reallyRealRunTime
  }
};
```

I love pattern matching as much as the next Reason fanatic, but that gets really old when you’re working with multiple fields on the same record!

In thinking about how to address this, I realized that when I’m trying to use a field on a record that I fetched via a query, I’m implicitly expecting it to be there. There’s also a good chance I’m expecting it to not be `null` (though there are absolutely exceptions to this that should be considered!). In fact, if I’m writing a component that depends on `runTime` and I didn’t fetch it, that’s an error scenario, not a potential UI case I need to account for! So let’s treat it as such:

```reason
exception NotFetched;

let fetched: option('a) => 'a =
  value =>
    switch (value) {
    | Some(v) => v
    | _ => raise(NotFetched);
    };

exception UnexpectedNull;

let nonNull: Js.null('a) => 'a =
  value =>
    switch (value |> Js.Null.toOption) {
    | Some(v) => v
    | None => raise(UnexpectedNull)
    };
```

These two helpers “unwrap” an option and a nullable, and raise an exception if the value isn’t actually present. Here’s how you can use them to “unwrap” a queried field:

```reason
let runTime: int = movie.runTime |> fetched |> nonNull;
```

Let me say it one more time: there are plenty of cases where `null` is a valid case that you should care about! And in those cases you can just use `fetched` and then pattern match to worry about what to do in the case of `null`. But by using this helper in my UI components, I’m working with my type system to ensure I didn’t screw up and forget to fetch a field I actually care about, or get a `null` value that shouldn’t have been there.

## Recursive Types

GraphQL provides a lot of flexibility with defining recursive data models, and if you’ve got a non-trivial schema you’re very likely to use that flexibility! Unfortunately defining recursive types in Reason can get a little tricky, especially if you’re trying to use different modules for each type as I’ve just suggested you do 😬. For example, if we wanted to add an `Actor` type to our simple schema above, you’ll run into a situation where the `Movie.re` module depends on the `Actor.re` module and vice versa… which Reason won’t let you do.

It’s not impossible to work around this, but it definitely makes things trickier and it gets into some more advanced Reason features, so it’s outside the scope of this post. But, if this is something you’re needing to solve, [here’s a gist](https://gist.github.com/kgoggin/67d787558336a1ec3c2c74cb83d5bb73) where I show how I’m currently handling it, using our same example schema from above. Feel free to reach out if you’ve got any questions and I’ll try to lend a hand as I’m able!

## In Closing…

I’ll close by saying that this whole thing kind of sucks. I mean, I like it more than /not/ having reusable types, but there’s still a better solution out there, and it’s called “code generation”. What I’d love to see is the ability to generate some Reason types + decoders as runnable code based on a GraphQL schema similar to what graphql_ppx does, but in a way that allows reusability because it’s actual generated code! I know there are already a few folks thinking about and working on this and hopefully we’ll have a solid solution in the coming months as more and more folks jump on the ReasonML + GraphQL bandwagon. Until then, I hope this helps you in your quest to build awesome stuff with GraphQL and Reason by allowing you to share your data types across more than one place!
