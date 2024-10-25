"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { MessageSquare, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import { CustomerPost } from "@/lib/types/CustomerPost";
import { Applicant } from "@/lib/types/Applicant";
import { OpenJob } from "@/lib/types/OpenJob";

export default function Page() {
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [customerPostData, setCustomerPost] = useState<CustomerPost[]>([]);
  const [openJobData, setOpenJob] = useState<OpenJob[]>([]);
  const [applicantData, setApplicantData] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // dummy fetch data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCustomerPost([
          {
            type: "Jastip",
            name: "Reni",
            time: "07:45",
            from: "Jl. Awan",
            to: "Perpus",
            gender: "perempuan",
            status: "Open",
            note: "Sebelah ATM",
            applicant: 2,
          },
          {
            type: "Anjem",
            name: "Rizal",
            time: "07:45",
            from: "Jl. Awan",
            to: "Perpus",
            gender: "perempuan",
            status: "In Progress",
            note: "Warung",
            applicant: 3,
          },
        ]);
        setOpenJob([
          {
            type: "Jastip",
            name: "Reni",
            title: "Jastip Gacoan",
            fee: "5000",
            note: "-",
            location: "UNS",
            timeDelivered: "09:00",
            acceptedOrders: 5,
          },
          {
            type: "Anjem",
            name: "Rizal",
            title: "Anjem Perpustakaan",
            note: "tambah 2000 per 1km",
            fee: "3000",
            location: "Perpustakaan Pusat",
            timeDelivered: "10:00",
            acceptedOrders: 3,
          },
        ]);
        setApplicantData([
          { name: "Applicant 1", price: "Rp5000", orders: 2 },
          { name: "Applicant 2", price: "Rp5000", orders: 3 },
          { name: "Applicant 3", price: "Rp5000", orders: 1 },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleAccordion = (value: string) => {
    setOpenAccordions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const hashCustomerName = (name: string): string => {
    if (name.length <= 2) return name;
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4">
      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="flex w-full mb-6 bg-indigo-100 rounded-lg p-[6px]">
          <TabsTrigger
            value="customer"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            Customer Post
          </TabsTrigger>
          <TabsTrigger
            value="open"
            className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            Open Job
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer">
          <Accordion
            type="multiple"
            value={openAccordions}
            className="w-full space-y-4"
          >
            {customerPostData.map((job, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-indigo-200 rounded-lg overflow-visible relative my-8"
              >
                <div className="absolute -top-3 left-4 z-20">
                  <span className="px-3 py-1 text-lg font-semibold text-white bg-indigo-600 rounded-full shadow-sm">
                    {job.type}
                  </span>
                </div>
                <Card className="bg-white shadow-sm relative z-10 pt-4">
                  <CardHeader className="flex flex-row justify-between items-center py-2">
                    <div>
                      <h2 className="text-lg font-semibold text-indigo-700">
                        {hashCustomerName(job.name)}
                      </h2>
                    </div>
                    <p className="text-sm font-medium px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                      {job.status}
                    </p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="font-medium text-indigo-600">
                          From:
                        </span>
                        {hashCustomerName(job.from)}
                      </p>
                      <p>
                        <span className="font-medium text-indigo-600">To:</span>{" "}
                        {job.to}
                      </p>
                      <p>
                        <span className="font-medium text-indigo-600">
                          Gender:
                        </span>{" "}
                        {job.gender}
                      </p>
                      <p>
                        <span className="font-medium text-indigo-600">
                          Note:
                        </span>{" "}
                        {job.note}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span>Apply</span>
                      </Button>
                      <AccordionTrigger
                        onClick={() => toggleAccordion(`item-${index}`)}
                        className="hover:no-underline w-full text-left"
                      >
                        <div className="flex items-center justify-end hover:bg-gray-200 p-2 rounded-lg hover:outline-none">
                          <span className="text-indigo-600 hover:text-indigo-700 flex items-center mr-2 hover:underline">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            <span>{job.applicant} applicant</span>
                          </span>
                        </div>
                      </AccordionTrigger>
                    </div>
                  </CardContent>
                </Card>
                <AccordionContent className="bg-indigo-50">
                  <div className="px-6 py-4 bg-indigo-50 space-y-3">
                    {applicantData.map((applicant, appIndex) => (
                      <div
                        key={appIndex}
                        className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10 bg-indigo-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                          </Avatar>
                          <div>
                            <span className="font-medium text-indigo-700">
                              {applicant.price}
                            </span>
                            <span className="ml-2 text-sm text-indigo-500">
                              {applicant.orders} pesanan
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                          >
                            Chat
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            Detail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="open">
          <div className="w-full space-y-4">
            {openJobData.map((job, index) => (
              <div
                key={index}
                className="border border-indigo-200 rounded-lg overflow-visible relative my-8"
              >
                <div className="absolute -top-3 left-4 z-20">
                  <span className="px-3 py-1 text-lg font-semibold text-white bg-indigo-600 rounded-full shadow-sm">
                    {job.type}
                  </span>
                </div>
                <Card className="bg-white shadow-sm relative z-10 pt-4">
                  <CardHeader className="flex flex-row justify-between items-center py-2">
                    <div>
                      <h2 className="text-lg font-semibold text-indigo-700">
                        {hashCustomerName(job.name)}
                      </h2>
                    </div>
                    <p className="text-sm font-medium px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                      sampai {job.timeDelivered}
                    </p>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <p>
                        <span className="font-medium text-indigo-600">
                          Fee:
                        </span>{" "}
                        {job.fee}
                      </p>
                      <p>
                        <span className="font-medium text-indigo-600">
                          Location:
                        </span>{" "}
                        {job.location}
                      </p>
                      <p>
                        <span className="font-medium text-indigo-600">
                          Note:
                        </span>{" "}
                        {job.note}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:bg-indigo-50"
                        >
                          <MessageSquare className="w-4 h-4 " />
                          <span>Chat</span>
                        </Button>
                        {/* tombol pilih */}
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <span>Apply</span>
                        </Button>
                      </div>

                      <div className="flex items-center text-indigo-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>{job.acceptedOrders} accepted orders</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
