
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SteganoTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

const SteganoTabs = ({ children, defaultValue = "encode" }: SteganoTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full"
    >
      <div className="flex justify-center mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="encode">Encode Message</TabsTrigger>
          <TabsTrigger value="decode">Decode Message</TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};

export { SteganoTabs, TabsContent };
