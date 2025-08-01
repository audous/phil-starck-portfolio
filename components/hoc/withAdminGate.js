// hoc/withAdminGate.js
import { useSession } from "next-auth/react";
import LoginModal from "../../components/LoginModal";
import Nav from "../../components/Nav";

const withAdminGate = (WrappedComponent) => {
  return function AdminGatedComponent(props) {
    const { status, data: session } = useSession();

    if (status === "loading") {
      return <div>Loading...</div>;
    }

    if (!session) {
      return <LoginModal />;
    }

    // Check admin role
    if (!session.user?.meta || session.user.meta !== "admin") {
      // You can customize this message/UI
      return (
        <>
          <Nav />
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Not authorized</h2>
            <p>You do not have permission to view this page.</p>
          </div>
        </>
      );
    }

    // If admin, show Nav and page
    return (
      <>
        <Nav />
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withAdminGate;
