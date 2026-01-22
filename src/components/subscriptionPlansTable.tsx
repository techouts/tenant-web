export const SubscriptionPlansTable = ({
  data,
  title,
  type,
}: {
  data: any[];
  title?: string;
  type: "subscriptionPlans" | "subscriptionEnding";
}) => {
  const headerFields =
    type === "subscriptionPlans"
      ? [
          "Name",
          "Code",
          "Price",
          "Billing",
          "Trial Days",
          "Daily Limit",
          "Monthly Limit",
          "Api Rate Limit",
          "Status",
          "Action",
        ]
      : ["Tenant Id", "Tenant Name", "Plan", "End Date", "Trial", "Days Left"];
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {title && (
        <div className="p-4 border-b border-border font-semibold">{title}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm ">
          <thead className="bg-muted">
            <tr>
              {headerFields?.map((head) => (
                <th key={head} className="text-left p-3 whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data &&
              data?.map((plan) => (
                <tr
                  key={plan?.code || plan?.tenant_id}
                  className="border-b border-border last:border-0 "
                >
                  <td className="p-3">{plan?.name || plan?.tenant_id}</td>
                  <td className="p-3">{plan?.code || plan?.tenant_name}</td>
                  <td className="p-3">
                    {type === "subscriptionPlans"
                      ? `₹${plan?.price?.toLocaleString()}`
                      : plan?.plan}
                  </td>
                  <td className="p-3 capitalize">
                    {plan?.billing_cycle || plan?.end_date?.split("T")[0]}
                  </td>
                  <td className="p-3">
                    {plan?.trial_days || plan?.is_trial === true
                      ? "True"
                      : "False"}
                  </td>
                  <td className="p-3">
                    {plan?.daily_api_limit || plan?.days_left}
                  </td>
                  {type === "subscriptionPlans" && (
                    <td className="p-3">{plan?.monthly_api_limit}</td>
                  )}
                  {type === "subscriptionPlans" && (
                    <td className="p-3">{plan?.api_rate_limit}</td>
                  )}
                  {type === "subscriptionPlans" && (
                    <td className="p-3">
                      <p
                        className={`px-2 py-1 text-center rounded-sm text-xs ${
                          plan?.is_active
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {plan?.is_active ? "Active" : "Inactive"}
                      </p>
                    </td>
                  )}
                  {type === "subscriptionPlans" && (
                    <td className="p-3">
                      <button
                        // onClick={() => openStatusModal(member)}
                        className="px-3 py-1 rounded-md border text-xs hover:bg-muted min-w-[90px]"
                      >
                        {plan?.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
