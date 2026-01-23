"use client";

import React, { useState, useEffect } from "react";
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
import { Copy, RefreshCw, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import {
  generateApiIntegrationSnippets,
  type ApiIntegrationSnippetsOutput,
} from "@/ai/flows/generate-api-integration-snippets";
import { generateSecretApiKey } from "../apis";

function ApiCredentials() {
  const { toast } = useToast();
  const [keys, setKeys] = useState({
    clientId: "",
    accessKey: "",
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const secretKey =
    JSON.parse(global?.window?.localStorage.getItem("secret-key") || "{}") ||
    "";
  const tenantId =
    JSON.parse(global?.window?.localStorage.getItem("userData") || "{}")?.user
      ?.tenantId || "";

  useEffect(() => {
    const fetchKeys = async () => {
      const fetchedKeys = await api.user.getKeys();
      setKeys((prev) => ({
        ...prev,
        accessKey: secretKey,
        clientId: tenantId,
      }));
    };
    fetchKeys();
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast({ title: `${field} copied to clipboard!` });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const newKeys = await generateSecretApiKey();
    if (newKeys?.secret_key) {
      setKeys((prev) => ({
        ...prev,
        accessKey: newKeys?.secret_key,
      }));
      global?.window?.localStorage.setItem(
        "secret-key",
        JSON.stringify(newKeys?.secret_key || ""),
      );
      setIsRegenerating(false);
      toast({
        title: "API Keys Regenerated",
        description: "Your new keys are now active.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Credentials</CardTitle>
        <CardDescription>
          Your secret keys to integrate Forward.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(keys).map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          return (
            <div key={key} className="space-y-1">
              <label className="text-sm font-medium">{label}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  readOnly
                  value={value || "Loading..."}
                  className="font-mono"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(value, label)}
                >
                  {copied === label ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
        <Button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          variant="destructive"
        >
          {isRegenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Regenerate Keys
        </Button>
      </CardContent>
    </Card>
  );
}

function ApiIntegration() {
  const [snippets, setSnippets] = useState<ApiIntegrationSnippetsOutput | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSnippets = async () => {
      setLoading(true);
      const userKeys = await api.user.getKeys();
      const result = await generateApiIntegrationSnippets({
        clientId: userKeys.clientId,
        accessKey: userKeys.accessKey,
        baseUrl: userKeys.baseUrl,
        query: "your-search-query",
      });
      setSnippets(result);
      setLoading(false);
    };
    fetchSnippets();
  }, []);

  const handleCopy = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    setCopied(lang);
    toast({ title: `${lang} snippet copied!` });
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeSnippet = ({ lang, code }: { lang: string; code?: string }) => (
    <div className="relative">
      {loading ? (
        <div className="h-48 animate-pulse bg-muted rounded-md"></div>
      ) : (
        <>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-code">
            <code>{code}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleCopy(code || "", lang)}
          >
            {copied === lang ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integration</CardTitle>
        <CardDescription>
          Example code snippets to get you started quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="curl">
          <TabsList>
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          <TabsContent value="curl">
            <CodeSnippet lang="cURL" code={snippets?.curl} />
          </TabsContent>
          <TabsContent value="javascript">
            <CodeSnippet lang="JavaScript" code={snippets?.javascript} />
          </TabsContent>
          <TabsContent value="python">
            <CodeSnippet lang="Python" code={snippets?.python} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function ApiPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        title="API & Integration"
        description="Access your API keys and find integration examples."
      />
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <ApiCredentials />
        <ApiIntegration />
      </div>
    </DashboardShell>
  );
}
