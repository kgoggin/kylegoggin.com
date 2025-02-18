---
title: Text Gradients in Tailwind v4 Using Functional Utilities
date: 2025-02-18
summary: Adding a gradient to text using CSS require a little extra effort. Here's how you can simplify it using Tailwind CSS v4's new functional utilities to create an abstraction that allows you set any gradient you've defined in your theme!
---

Adding a gradient color to text in CSS is a _little_ complicated, since you need to actually set a few css properties of the text element at once. TIL how I can abstract the complexity away using Tailwind CSS’s functional utilities. Along the way, we'll learn how we can create generic abstraction in Tailwind v4 with some of their new, CSS-based directives. Let’s take a look!

## How to create a gradient effect on text

This is one of those CSS things that’s a bit more complicated than you’d hope. I’d love to just specify `color: linear-gradient(#eee, #333)`, but that doesn’t work. Instead, here’s the full set of CSS properties you need to set:

```css
.text-gradient {
  background-image: linear-gradient(#eee, #333);
  background-clip: text;
  color: transparent;
  display: inline-block;
}
```

The background of the element gets the gradient, the text itself is transparent (so you can see the gradient through it), and the background gets clipped so it’s just present on the text (as if the text were a mask). The `inline-block` there helps make sure the background only takes up the width of the text, not the full width of the container.

Once you figure this out, it’s not too complicated, but it’s still a pain because you can’t easily set it in one go. Here's what that'd look like using native Tailwind utility classes:

```html
<h1
  class="...all-your-gradient-tokens inline-block text-transparent bg-clip-text"
>
  Hello, I'm a gradient!
</h1>
```

Note that I’ve omitted the actual gradient styles because they’re pretty specific to what you want, but they can also add [quite a few class names](https://tailwindcss.com/docs/background-image)!

Now, I’m not one of the Tailwind haters who complains about how many classes end up in your markup (I don’t think that’s actually that big of a deal), but I _do_ think it’s great to be able to group a common “grouping” of classes like this together when possible. Let’s create an abstraction to make this a little easier!

## A Gradient Text Component Class

Tailwind CSS v4 allows you to define custom [component classes](https://tailwindcss.com/docs/adding-custom-styles#adding-component-classes) for situations like this one. I think these are a great way to handle scenarios like this where you’ve got a set of styles that are going to get applied together over and over again. Here’s what it’d look like, in your main CSS file:

```css
@layer components {
  .text-gradient {
    @apply bg-clip-text text-transparent inline-block;
    background-image: linear-gradient(#eee, #333);
  }
}
```

The `@apply` directive here lets us specify properties as Tailwind tokens, which is great for composability! And, we can have a little more control over the gradient we want to apply since we can express it as native CSS.

This is pretty great! Now we can easily apply our gradient to any text we’d like, without having to remember all the CSS properties we need to set. But, what if we want to use a _different_ gradient for different places?

## A Functional Gradient Text Utility

Here’s where things get really cool! Let’s switch from using a component class to defining a utility that allows us to specify the gradient we want to use as an _argument_ when we use it!

First, add the gradients you’d like to use as custom properties in your `@theme`, if they’re not there already:

```css
@theme {
  /* Other theme stuff */
  --gradient-blue-red-orange: linear-gradient(
    88deg,
    #2ba2ca 12.37%,
    #df0440 46.89%,
    #ff6f01 82.53%
  );

  --gradient-green-blue-red: linear-gradient(
    91deg,
    #5dbb62 -1.64%,
    #2ba2ca 46.13%,
    #e0023f 100%
  );
}
```

A key thing to note here is that each property has the same prefix, `gradient`. That’s important for this next step! Let’s define our [functional utility](https://tailwindcss.com/docs/adding-custom-styles#functional-utilities):

```css
@utility text-gradient-* {
  @apply bg-clip-text text-transparent inline-block;
  background-image: --value(--gradient- *);
}
```

We keep the `@apply`, but now we can express the `background-image` property using the special `--value()` function, which will match the `*` in the utility’s name to a matching `--gradient` property from the theme. Now, we can add a variant to any text element like so:

```html
<h1 class="text-gradient-blue-red-orange">Hello, I'm a gradient!</h1>
```

You’ll get all the required CSS properties, _and_ you’ll match the specified gradient value from your theme! And, since this is defined as a `@utility`, it works just like any other native Tailwind token, so stuff like `hover:text-gradient-green-blue-red` will work, and you’ll see this as a valid option if you’re using the awesome [VS Code plugin for IntelliSense](https://tailwindcss.com/docs/editor-setup#intellisense-for-vs-code)!

Here’s a [Tailwind Play](https://play.tailwindcss.com/ktVw4MhMz6) link if you’d like to see all of this in a live example.

## Conclusion

Gradient text feels like a _perfect_ use case for some of the more advanced Tailwind features like functional utilities. I’m really enjoying how v4 opens up the ways we can express stuff like this, while still keeping everything defined in a plain CSS file. I hope you find it helpful as well!
