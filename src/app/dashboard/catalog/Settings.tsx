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

  return (
    <div className="rounded-lg border bg-background">
      <CardHeader className="p-4">
        <CardTitle>Catalog Settings</CardTitle>
        <CardDescription>
          Choose how to add data to your catalog.
        </CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Field</TableHead>
            <TableHead className="text-center">Active</TableHead>
            <TableHead className="text-center">Search</TableHead>
            <TableHead className="text-center">Auto Suggest</TableHead>
            <TableHead className="text-center">Response</TableHead>
            <TableHead className="text-center">Facet</TableHead>
            <TableHead className="text-center">Mapping</TableHead>
            <TableHead>Mapping Name</TableHead>
            <TableHead className="text-center">Mandatory</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows?.map((setting) => (
            <TableRow key={setting?.id}>
              {Object?.entries(setting)?.map(([key, value]) => (
                <>
                  {key !== "updated_at" && key !== "created_at" && (
                    <TableCell>
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
                    </TableCell>
                  )}
                </>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Settings;
