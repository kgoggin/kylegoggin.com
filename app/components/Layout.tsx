import { Link } from "@remix-run/react";
import type { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <>
      <header className="bg-sky-800 py-4">
        <div className="mx-auto max-w-2xl px-10">
          <Link
            className="font-martian-mono text-xl text-sky-100 hover:text-sky-200"
            to="/"
          >
            KyleGoggin.com
          </Link>
        </div>
      </header>
      <div className="mx-auto my-auto max-w-2xl border-x border-slate-200 bg-white px-10 py-8">
        {children}
      </div>

      <footer className="bg-sky-800 py-10 px-10 text-center text-sky-100">
        <div className="mb-4">
          <span>
            Everything here is written by me, Kyle Goggin. Thanks for reading!
          </span>
        </div>
        <div className="">
          <span className="font-martian-mono text-xs text-sky-200 ">
            Copyright © 2019-2022 Kyle Goggin
          </span>
        </div>
      </footer>
    </>
  );
}
