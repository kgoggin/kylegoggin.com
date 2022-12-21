import type { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="mx-auto my-auto w-96">
      <header className="my-4">KyleGoggin.com</header>
      <div className="absolute w-12 text-right">
        <ul>
          <li>About</li>
          <li>Github</li>
          <li>Twitter</li>
        </ul>
      </div>
      <div className="relative mr-0 ml-20">{children}</div>
    </div>
  );
}
