// hoc/withLoginGate.js
import { useSession } from "next-auth/react";
import LoginModal from "../../components/LoginModal";
import Nav from "../../components/Nav";

const withLoginGate = (WrappedComponent) => {
  return function LoginGatedComponent(props) {
    const { status, data: session } = useSession();

    if (status === "loading") {
      return <div>Loading...</div>;
    }

    if (!session) {
      return <LoginModal />;
    }

    // If logged in, wrap page in Nav
    return (
      <>
        <Nav />
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withLoginGate;
