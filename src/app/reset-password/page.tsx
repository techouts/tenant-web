import { useSearchParams } from "next/navigation";
import ResetPassword from "./ResetPassword";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const uid = searchParams?.get("uid");
  const token = searchParams?.get("token");
  return <ResetPassword uid={uid || ""} token={token} />;
};

export default ResetPasswordPage;
