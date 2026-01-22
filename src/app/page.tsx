"use client";

import Link from "next/link";
import {
  CheckCircle,
  Search,
  UploadCloud,
  Zap,
  Package,
  Code,
  SlidersHorizontal,
  KeyRound,
  Globe,
  ToyBrick,
  Rocket,
  Database,
  Component,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { pricingPlans } from "@/lib/data";
import { Logo } from "@/components/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const featureTabs = [
  {
    id: "catalog",
    title: "Catalog Management",
    icon: Package,
    description:
      "Easily upload and manage your product catalog using various methods. Our system validates and indexes your data, making it ready for search in no time.",
    content: (
      <div className="bg-muted p-4 rounded-lg text-sm font-code">
        <p className="text-foreground">
          // Example: Uploading a product via API
        </p>
        <pre className="text-muted-foreground mt-2">
          {`fetch('https://api.forward.com/v1/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 'prod-123',
    name: 'Ergonomic Keyboard',
    price: 89.99
  })
});`}
        </pre>
      </div>
    ),
  },
  {
    id: "playground",
    title: "Search Playground",
    icon: SlidersHorizontal,
    description:
      "Interactively test and refine your search queries. The playground provides real-time feedback, allowing you to perfect the search experience before integrating it into your application.",
    content: (
      <div className="bg-muted p-4 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search for 'ergonomic keyboards'..."
            className="bg-background w-full pl-10 pr-4 py-2 rounded-md text-sm"
          />
        </div>
      </div>
    ),
  },
  {
    id: "integration",
    title: "API Integration",
    icon: KeyRound,
    description:
      "Our powerful REST API allows for seamless integration into any application. We provide clear documentation and client libraries to get you up and running quickly.",
    content: (
      <div className="bg-muted p-4 rounded-lg text-sm font-code">
        <p className="text-foreground">// Example: Javascript search query</p>
        <pre className="text-muted-foreground mt-2">
          {`import Forward from 'forward-client';

const client = new Forward('YOUR_CLIENT_ID');

client.search({
  query: 'wireless mouse',
  filters: 'category:electronics',
  limit: 10
}).then(results => {
  console.log(results);
});`}
        </pre>
      </div>
    ),
  },
];

const brandLogos = [
  { name: "QuantumCore", icon: Bot },
  { name: "StellarWorks", icon: Rocket },
  { name: "NexusData", icon: Database },
  { name: "ApexBuilds", icon: Component },
  { name: "TerraGlobe", icon: Globe },
  { name: "InnovateX", icon: ToyBrick },
];

const salesFormSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  companyName: z
    .string()
    .min(2, { message: "Please enter your company name." }),
  message: z.string().optional(),
});

function ContactSalesForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof salesFormSchema>>({
    resolver: zodResolver(salesFormSchema),
    defaultValues: { name: "", email: "", companyName: "", message: "" },
  });

  const onSubmit = (values: z.infer<typeof salesFormSchema>) => {
    console.log("Sales form submitted:", values);
    toast({
      title: "Request Sent!",
      description: "Our sales team will get back to you shortly.",
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Company Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your needs..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending..." : "Submit Request"}
        </Button>
      </form>
    </Form>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = React.useState(featureTabs[0].id);
  const [salesFormOpen, setSalesFormOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="#" className="flex items-center justify-center">
          <Logo />
          <span className="sr-only">Forward Platform</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section
          id="hero"
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/5"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Powerful, Scalable Search for Your Business
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Forward provides mid-scale businesses with a robust platform
                    to upload product catalogs, test search queries, and
                    integrate powerful search into any application.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started for Free</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="#pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Search className="h-48 w-48 text-primary/20" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="brands"
          className="w-full py-12 md:py-16 bg-background overflow-hidden"
        >
          <div className="container px-4 md:px-6">
            <div className="relative [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
              <div className="animate-scroll-x flex items-center gap-12">
                {[...brandLogos, ...brandLogos].map((brand, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-muted-foreground flex-shrink-0"
                  >
                    <brand.icon className="h-6 w-6" />
                    <span className="font-semibold text-lg">{brand.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Everything You Need to Power Your Search
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From catalog management to API integration, our platform is
                built for performance and ease of use.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto mb-6">
                    {featureTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="h-auto p-4 flex flex-col sm:flex-row items-center gap-2 text-md"
                      >
                        <tab.icon className="h-5 w-5" />
                        {tab.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {featureTabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id}>
                      <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold">{tab.title}</h3>
                          <p className="text-muted-foreground">
                            {tab.description}
                          </p>
                        </div>
                        <div>{tab.content}</div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-primary/5"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose a plan that scales with your business. No hidden fees.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3 pt-12">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "flex flex-col",
                    plan.isPopular
                      ? "border-primary ring-2 ring-primary shadow-lg"
                      : "",
                  )}
                >
                  <CardHeader className="pb-4">
                    {plan.isPopular && (
                      <div className="text-sm font-semibold text-primary mb-2 text-center">
                        Most Popular
                      </div>
                    )}
                    <CardTitle className="font-headline text-center">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="flex items-baseline justify-center">
                      {plan.price === "custom" ? (
                        <span className="text-2xl font-bold">Custom</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold">
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground">/month</span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {plan.price === "custom" ? (
                      <Dialog
                        open={salesFormOpen}
                        onOpenChange={setSalesFormOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="w-full">Contact Sales</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Contact Sales</DialogTitle>
                            <DialogDescription>
                              Fill out the form below and our sales team will be
                              in touch shortly.
                            </DialogDescription>
                          </DialogHeader>
                          <ContactSalesForm setOpen={setSalesFormOpen} />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        asChild
                        className="w-full"
                        variant={plan.isPopular ? "default" : "outline"}
                      >
                        <Link href="/signup">Choose Plan</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Forward Platform. All rights
          reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
