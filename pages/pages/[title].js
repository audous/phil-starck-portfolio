// pages/pages/[title].js
import dbConnect from "../../lib/dbConnect";
import AddPage from "../../models/AddPage";
import Nav from "../../components/Nav";

export async function getServerSideProps(context) {
  const { title } = context.params;
  await dbConnect();

  // Decode URI component to get the original title
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
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Nav />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {/* Render HTML content safely */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
