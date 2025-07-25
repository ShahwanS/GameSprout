import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Navbar } from '~/components/Navbar'
import "./tailwind.css";
import { RoomPersistenceProvider } from "~/context/RoomPersistenceContext";

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    ENV: {
      SOCKET_URL: process.env.SOCKET_URL || "https://socket.stormyfocus.cloud",
    },
  };
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <RoomPersistenceProvider>
          <Navbar />
          {children}
        </RoomPersistenceProvider>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <script defer src="https://umami.stormyfocus.cloud/script.js" data-website-id="6cf95d5a-01b4-4881-8d28-acad5d8a60f2"></script>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
