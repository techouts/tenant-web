"use client";

import { capitalizeAndCleanString } from "@/lib/CapitalizeString";
import { convertDateFormat } from "@/lib/Date";

const TenantTable = ({
  tenants,
  openStatusModal,
  handleStatusSave,
  handleDelete,
  deleteModalOpen,
  statusModalOpen,
  openDeleteModal,
  setStatusModalOpen,
  setStatus,
  setDeleteModalOpen,
  status,
}: {
  tenants: any[];
  openStatusModal: (tenant: any) => void;
  handleStatusSave: (status: any) => void;
  handleDelete: (tenant: any) => void;
  openDeleteModal: (tenant: any) => void;
  setStatusModalOpen: any;
  setStatus: any;
  setDeleteModalOpen: any;
  deleteModalOpen: boolean;
  statusModalOpen: boolean;
  status: string;
}) => {
  if (!tenants.length) {
    return (
      <div className="text-muted-foreground text-sm">
        No clients onboarded yet.
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border">
        <table className="w-full text-sm ">
          <thead className="border-b border-border">
            <tr>
              <th className="text-left p-3">Tenant Id</th>
              <th className="text-left p-3">Domain</th>
              <th className="text-left p-3">Active</th>
              <th className="text-left p-3">Registered At</th>
              <th className="text-left p-3">Catalog Type</th>
              <th className="text-left  p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants?.map((tenant) => (
              <tr key={tenant?.id} className="border-b border-border">
                <td className="p-3">{tenant?.id}</td>
                <td className="p-3">{tenant?.domain}</td>
                <td className="p-3">{tenant?.is_active ? "True" : "False"}</td>
                <td className="p-3">{convertDateFormat(tenant?.created_at)}</td>
                <td className="p-3">{capitalizeAndCleanString(tenant?.catalog_type)}</td>
                <td className="p-3 flex gap-2  w-[180px]">
                  <button
                    onClick={() => openStatusModal(tenant)}
                    className="px-3 py-1 rounded-md border text-xs hover:bg-muted grow"
                  >
                    {tenant?.is_active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => openDeleteModal(tenant)}
                    className="px-3 py-1 rounded-md border border-red-500 text-red-600 text-xs hover:bg-red-50 grow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {statusModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg w-[400px] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Update Tenant Status</h2>
            <p>{`Are you sure to ${
              status === "activate" ? "Deactivate" : "Activate"
            } this tenant`}</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusSave(
                    status === "activate" ? "deactivate" : "activate"
                  )
                }
                className="px-4 py-2 bg-primary text-black rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg w-[400px] p-6 space-y-4">
            <h2 className="text-lg font-semibold text-red-600">
              Delete Tenant
            </h2>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this tenant? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TenantTable;
