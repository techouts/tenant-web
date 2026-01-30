"use client";
import ResetPassword from "./ResetPassword";

type PageProps = {
  searchParams: {
    uid?: string;
    token?: string;
  };
};

const ResetPasswordPage = async({ searchParams }: PageProps) => {
  const { uid = "", token = "" } = await searchParams;
  return <ResetPassword uid={uid} token={token} />;
};

export default ResetPasswordPage;
