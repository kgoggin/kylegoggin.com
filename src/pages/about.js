import React from "react";

const About = () => {
  return (
    <div>
      <h2>
        Hi!{" "}
        <span role="img" aria-label="wave">
          👋
        </span>
      </h2>
      <p>
        My name is Kyle Goggin. I'm a web developer who likes to build with:
        <ul>
          <li>
            <a href="https://reactjs.org/">React</a>
          </li>
          <li>
            <a href="http://graphql.org/">GraphQL</a>
          </li>
          <li>
            <a href="https://reasonml.github.io/">ReasonML</a>
          </li>
        </ul>
      </p>
      <p>
        You can follow me on <a href="https://twitter.com/kgoggin">Twitter</a>,
        or check out some of my work on{" "}
        <a href="https://github.com/kgoggin">Github.</a>
      </p>
      <p>
        I work for <a href="https://www.mywell.org">My Well</a>, where we're
        building a platform to enable faith-based nonprofits to accept payments
        with no extra fees. Pretty cool, huh?
      </p>
      <p>
        I also do some freelance work, like{" "}
        <a href="https://www.mytriptonewyorkcity.com/">this site</a> for my
        friend who creates custom iteneraries for people visiting New York City.
      </p>
    </div>
  );
};

export default About;
