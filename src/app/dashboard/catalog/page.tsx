"use client";

import React, { useState } from "react";
import { DashboardHeader, DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  UploadCloud,
  File,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  PlusCircle,
  Trash2,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";
import type { CatalogFile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadCatalog } from "../apis";

function CatalogUploader({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const response = await uploadCatalog(file);
      if (response) {
        toast({
          title: "Upload Complete",
          description: response.message,
        });
        onUploadSuccess();
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description:
          "Something went wrong during the upload. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      setFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
            {file ? (
              <p className="font-semibold text-foreground">{file.name}</p>
            ) : (
              <>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  CSV or JSON (MAX. 50MB)
                </p>
              </>
            )}
          </div>
          <Input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv,.json"
          />
        </label>
      </div>
      {uploadProgress !== null && (
        <Progress value={uploadProgress} className="w-full" />
      )}
      <Button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full"
      >
        {isUploading ? `Uploading... ${uploadProgress}%` : "Upload File"}
      </Button>
    </div>
  );
}

function ApiDataSource() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const endpoint = "https://api.forward.com/v1/catalog";
  const codeSnippet = `
fetch('${endpoint}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // Your product data here
  })
});`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">API Endpoint</label>
        <div className="flex items-center gap-2">
          <Input type="text" readOnly value={endpoint} className="font-mono" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(endpoint)}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">
          Example Usage (JavaScript)
        </label>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-code mt-1">
            <code>{codeSnippet}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleCopy(codeSnippet)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Refer to the{" "}
        <a href="/dashboard/api" className="underline">
          API documentation
        </a>{" "}
        for more details on payload structure.
      </p>
    </div>
  );
}

function WebhookDataSource() {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const webhookUrl = "https://api.forward.com/v1/webhooks/catalog/evt_123abc";
  const secretKey = "whsec_mock_xxxxxxxxxxxxxx";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast({ title: `${field} copied!` });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use this URL in your system to send product updates automatically. We
        will listen for POST requests with a JSON body.
      </p>
      <div className="space-y-1">
        <label className="text-sm font-medium">Webhook URL</label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            readOnly
            value={webhookUrl}
            className="font-mono"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(webhookUrl, "URL")}
          >
            {copied === "URL" ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Signing Secret</label>
        <div className="flex items-center gap-2">
          <Input type="text" readOnly value={secretKey} className="font-mono" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(secretKey, "Secret")}
          >
            {copied === "Secret" ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Use this secret to verify that webhooks are coming from Forward.
        </p>
      </div>
    </div>
  );
}

function SyncDataSource() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState([
    { id: 1, url: "https://api.my-store.com/products", schedule: "Daily" },
  ]);
  const [newJobUrl, setNewJobUrl] = useState("");
  const [newJobSchedule, setNewJobSchedule] = useState("Daily");

  const handleAddJob = () => {
    if (!newJobUrl) {
      toast({ title: "Please enter a URL", variant: "destructive" });
      return;
    }
    const newJob = {
      id: jobs.length + 2,
      url: newJobUrl,
      schedule: newJobSchedule,
    };
    setJobs([...jobs, newJob]);
    setNewJobUrl("");
    toast({
      title: "Sync Job Added",
      description: `Now syncing from ${newJobUrl} ${newJobSchedule.toLowerCase()}.`,
    });
  };

  const handleRemoveJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
    toast({ title: "Sync Job Removed" });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Set up a scheduled job to pull the latest catalog data from a URL
        endpoint.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Sync Job</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Data Source URL</label>
            <Input
              placeholder="https://api.example.com/products"
              value={newJobUrl}
              onChange={(e) => setNewJobUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Schedule</label>
            <Select value={newJobSchedule} onValueChange={setNewJobSchedule}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hourly">Hourly</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddJob}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h4 className="font-medium">Active Sync Jobs</h4>
        {jobs.length > 0 ? (
          <div className="border rounded-md">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div className="space-y-1">
                  <p className="font-mono text-sm truncate">{job.url}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {job.schedule}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveJob(job.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active sync jobs.
          </p>
        )}
      </div>
    </div>
  );
}

function CatalogList() {
  const [catalogs, setCatalogs] = useState<CatalogFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalogs = async () => {
    setLoading(true);
    const data = await api.catalog.getUploadedCatalogs();
    setCatalogs(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCatalogs();
  }, []);

  const getStatusBadge = (status: CatalogFile["status"]) => {
    switch (status) {
      case "Validated":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Validated
          </Badge>
        );
      case "Processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "Error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-4">
        <CardTitle>Processing History</CardTitle>
        <CardDescription>
          History of your uploaded product catalogs and data pushes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name / Source</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Size / Records</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="h-12 animate-pulse bg-muted rounded-md"></TableCell>
                  <TableCell className="h-12 animate-pulse bg-muted rounded-md"></TableCell>
                  <TableCell className="h-12 animate-pulse bg-muted rounded-md"></TableCell>
                  <TableCell className="h-12 animate-pulse bg-muted rounded-md"></TableCell>
                </TableRow>
              ))
            ) : catalogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No catalogs uploaded yet.
                </TableCell>
              </TableRow>
            ) : (
              catalogs.map((catalog) => (
                <TableRow key={catalog.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    {catalog.name}
                  </TableCell>
                  <TableCell>{format(catalog.uploadedAt, "PPp")}</TableCell>
                  <TableCell>{catalog.size}</TableCell>
                  <TableCell>{getStatusBadge(catalog.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function CatalogPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardShell>
      <DashboardHeader
        title="Catalog Management"
        description="Add products to your search index."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Choose how to add data to your catalog.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="upload">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                  <TabsTrigger value="webhook">Webhook</TabsTrigger>
                  <TabsTrigger value="sync">Sync</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-4">
                  <CatalogUploader
                    onUploadSuccess={() => setRefreshKey((k) => k + 1)}
                  />
                </TabsContent>
                <TabsContent value="api" className="pt-4">
                  <ApiDataSource />
                </TabsContent>
                <TabsContent value="webhook" className="pt-4">
                  <WebhookDataSource />
                </TabsContent>
                <TabsContent value="sync" className="pt-4">
                  <SyncDataSource />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <CatalogList key={refreshKey} />
        </div>
      </div>
    </DashboardShell>
  );
}
