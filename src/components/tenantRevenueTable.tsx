export const TenantRevenueTable = ({
  data,
}: {
  data: { tenant_id: number; tenant_name: string; revenue: number }[];
}) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border font-semibold">
        Tenant Revenue
      </div>

      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Tenant ID</th>
            <th className="text-left p-3">Tenant Name</th>
            <th className="text-right p-3">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.map((row) => (
              <tr
                key={row?.tenant_id}
                className="border-b border-border last:border-0"
              >
                <td className="p-3">{row?.tenant_id}</td>
                <td className="p-3">{row?.tenant_name}</td>
                <td className="p-3 text-right">
                  ₹{row?.revenue?.toLocaleString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
