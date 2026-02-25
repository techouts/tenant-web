"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { catalogSettings } from "../apis";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Setting = {
  id: number;
  field: string;
  is_active: boolean;
  is_search_field: boolean;
  is_autosuggestion_field: boolean;
  is_response_field: boolean;
  is_facet_field: boolean;
  is_mapping_enabled: boolean;
  mapping_name?: string;
  is_mandatory: boolean;
};

type SwitchCellProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

const SwitchCell = ({ value, onChange }: SwitchCellProps) => {
  return (
    <div className="flex justify-center">
      <Switch
        checked={value}
        onCheckedChange={onChange}
        className="data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-green-500"
      />
    </div>
  );
};

const Settings = ({ data }: { data: Setting[] }) => {
  const [rows, setRows] = useState<Setting[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const filteredRows = rows?.filter((row) =>
    row?.field?.toLowerCase()?.includes(currentQuery.toLowerCase()),
  );
  useEffect(() => {
    setRows(data);
  }, [data]);

  const updateSetting = async (id: number, key: any, value: boolean) => {
    const payload = rows?.find((item) => item?.id === id);
    const response = await catalogSettings("POST", {
      ...payload,
      [key]: value,
    });
    setRows((prev) =>
      prev?.map((row) => (row?.id === id ? { ...row, [key]: value } : row)),
    );
  };

  const handleQueryChange = (e: any) => {
    const query = e.target.value;
    setCurrentQuery(query);
  };

  return (
    <div className="rounded-lg border bg-background ">
      <CardHeader className="p-4">
        <CardTitle>Catalog Settings</CardTitle>
        <CardDescription>
          Choose how to add data to your catalog.
        </CardDescription>
      </CardHeader>
      <div className="relative max-w-sm ml-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search field name"
          className="pl-10"
          value={currentQuery}
          onChange={handleQueryChange}
        />
      </div>

      <div className="overflow-auto h-[300px] mt-2">
        <table className="w-full text-sm z-40">
          <thead className="bg-muted sticky top-0 z-40">
            <tr>
              <th className="text-left p-3 whitespace-nowrap  min-w-3">ID</th>
              <th className="text-left p-3 whitespace-nowrap  min-w-10">
                Field
              </th>
              <th className="text-center ">Active</th>
              <th className="text-center">Search</th>
              <th className="text-center">Auto Suggest</th>
              <th className="text-center">Response</th>
              <th className="text-center">Facet</th>
              <th className="text-center">Mapping</th>
              <th>Mapping Name</th>
              <th className="text-center">Mandatory</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows?.map((setting) => (
              <tr
                key={setting?.id}
                className="border-b border-border last:border-0"
              >
                {Object?.entries(setting)?.map(([key, value]) => (
                  <>
                    {key !== "updated_at" && key !== "created_at" && (
                      <td className="p-3">
                        {key !== "id" &&
                        key !== "field" &&
                        key !== "mapping_name" ? (
                          <SwitchCell
                            value={value as boolean}
                            onChange={(value) =>
                              updateSetting(setting?.id, key, value)
                            }
                          />
                        ) : (
                          <Badge variant="secondary">{value || "NA"}</Badge>
                        )}
                      </td>
                    )}
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
