import "@/src/app/styles.css";
import Header from "@/components/Header.jsx";
import getUser from "@/lib/getUser.js";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic";

export const metadata = {
	title: "FriendlyEats",
	description:
		"FriendlyEats is a restaurant review website built with Next.js and Firebase.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Header initialUser={getUser()} />

				{children}
			</body>
		</html>
	);
}
