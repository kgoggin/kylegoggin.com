import React from "react";
import {css} from "glamor";
import glamorous from "glamorous";
import Link from "gatsby-link";

const NavItem = glamorous.li({
  padding: ".5rem 1rem",
  margin: 0,
});

const linkStyle = css({
  color: "#fff",
  textShadow: "none",
  backgroundImage: "none",
});

const Masthead = () => {
  return (
    <header
      css={{
        backgroundColor: "#333",
        color: "#fff",
        textAlign: "center",
        padding: "2rem 0",
      }}
    >
      <h1 css={{margin: "0 0 1rem", color: "#fff"}}>Kyle Goggin</h1>
      <ul
        css={{
          padding: 0,
          margin: 0,
          display: "flex",
          listStyle: "none",
          justifyContent: "center",
        }}
      >
        <NavItem>
          <Link className={linkStyle} to="/">
            Home
          </Link>
        </NavItem>
        <NavItem>
          <Link className={linkStyle} to="/about">
            About
          </Link>
        </NavItem>
      </ul>
    </header>
  );
};

export default Masthead;
