import ResetPassword from "./ResetPassword";

type PageProps = {
  searchParams: {
    uid?: string;
    token?: string;
  };
};

const ResetPasswordPage = ({ searchParams }: PageProps) => {
  const { uid = "", token = "" } = searchParams;
  return <ResetPassword uid={uid} token={token} />;
};

export default ResetPasswordPage;
