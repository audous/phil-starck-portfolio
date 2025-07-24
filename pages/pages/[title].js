// pages/pages/[title].js
import dbConnect from "../../lib/dbConnect";
import AddPage from "../../models/AddPage";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Nav from "../../components/Nav";

const LoginModal = dynamic(() => import("../../components/LoginModal"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const { title } = context.params;
  await dbConnect();

  const decodedTitle = decodeURIComponent(title);
  const page = await AddPage.findOne({ title: decodedTitle }).lean();

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: page.title,
      html: page.html,
    },
  };
}

export default function CustomPage({ title, html }) {
  const { data: session, status } = useSession();

  // While checking auth, you can optionally show a loading UI
  if (status === "loading") return <div>Loading...</div>;

  // Not signed in: show LoginModal
  if (!session) {
    return (
      <div>
        <LoginModal />
        <div className="mt-6 text-center text-lg text-gray-700">
          You must be signed in to view this page.
        </div>
      </div>
    );
  }

  // Signed in: render the page content
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Nav />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
