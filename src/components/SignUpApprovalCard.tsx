"use client";
type Props = {
  data: any;
  handleGetNodifications?: any;
  setIsNotificationsOpen?: any;
};

const SignupApprovalCard = ({
  data,
  handleGetNodifications,
  setIsNotificationsOpen,
}: Props) => {
  const isPending = data?.status === "pending";


  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {data?.business_name}
        </span>
        <span className="text-sm text-muted-foreground">
          {data?.signup_email}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={!isPending}
          onClick={() => {
            handleGetNodifications("POST", {
              signup_id: data?.signup_id,
              status: "approved",
            });
            setIsNotificationsOpen(false);
          }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition
            ${
              isPending
                ? "bg-success text-success-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
          Approve
        </button>

        <button
          disabled={!isPending}
          onClick={() => {
            handleGetNodifications("POST", {
              signup_id: data?.signup_id,
              status: "rejected",
            });
            setIsNotificationsOpen(false);
          }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition
            ${
              isPending
                ? "bg-destructive text-destructive-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default SignupApprovalCard;
