import { convertDateFormat } from "@/lib/Date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const SubscriptionPlansTable = ({
  data,
  title,
  type,
  handlesubscriptionEnding,
}: {
  data: any[];
  title?: string;
  handlesubscriptionEnding?: any;
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
          // "Api Rate Limit",
          "Status",
          "Action",
        ]
      : ["Tenant Id", "Tenant Name", "Plan", "End Date", "Trial", "Days Left"];
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden col-span-2">
      <div className="flex items-center">
        {title && <div className="p-4 font-semibold">{title}</div>}
        {type === "subscriptionEnding" && (
          <div className="space-y-1 p-2">
            <Select
              // value={newJobSchedule}
              onValueChange={(value) => handlesubscriptionEnding(value)}
              defaultValue="quarter"
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="overflow-auto h-[300px]">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0">
            <tr>
              {headerFields?.map((head) => (
                <th
                  key={head}
                  className="text-left p-3 whitespace-nowrap  min-w-24"
                >
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
                  className="border-b border-border last:border-0"
                >
                  <td className="p-3">{plan?.name || plan?.tenant_id}</td>
                  <td className="p-3">{plan?.code || plan?.tenant_name}</td>
                  <td className="p-3">
                    {type === "subscriptionPlans"
                      ? `₹${plan?.price?.toLocaleString()}`
                      : plan?.plan}
                  </td>
                  <td className="p-3 capitalize">
                    {plan?.billing_cycle || convertDateFormat(plan?.end_date)}
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
                  {/* {type === "subscriptionPlans" && (
                    <td className="p-3">{plan?.api_rate_limit}</td>
                  )} */}
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
        {data?.length === 0 ? (
          <div className="mx-auto">
            <p className="p-0 text-center ">No Data Available</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
