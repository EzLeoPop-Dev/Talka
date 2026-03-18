"use client";
import { useState } from "react";
import AiSupport from "./mainpage/page";
import TemplatesPage from "./templates/templates";
import Receptionist from "./templates/receptionist";
import SaleAgent from "./templates/slaesagent";
import SupportAgent from "./templates/supportagent";
import CearteNew from "./templates/createnew";
import UseTemplates from "./usetemplates/usetemplates";

export default function page() {
  const [view, setView] = useState("mainpage");

  const [selectedTemplates, setSelectedTemplates] = useState([]);

  const handleUseTemplate = (type) => {
    setSelectedTemplates(prev =>
      prev.includes(type) ? prev : [...prev, type]
    );
    setView("usetemplates");
  };
  return (
    <>
      {view === "mainpage" && <AiSupport onNext={() => setView("templates")} />}
      {view === "templates" && (
        <TemplatesPage
          onBack={() => setView("mainpage")}
          onreceptionist={() => setView("receptionist")}
          onsalesagent={() => setView("saleagent")}
          onsupportagent={() => setView("supportagent")}
          oncreatenew={() => setView("createnew")}          
        />      
      )}
      {view === "receptionist" && (
        <Receptionist
          onNext={() => setView("receptionist")}
          onBack={() => setView("templates")}
          onUseRecep={() => handleUseTemplate("receptionist")}
        />
      )}
      {view === "saleagent" && (
        <SaleAgent
          onNext={() => setView("saleagent")}
          onBack={() => setView("templates")}
          onUseSale={() => handleUseTemplate("saleagent")}
        />
      )}
      {view === "supportagent" && (
        <SupportAgent
          onNext={() => setView("supportagent")}
          onBack={() => setView("templates")}
          onUseSup={() => handleUseTemplate("supportagent")}
        />
      )}
      {view === "createnew" && (
        <CearteNew
          onNext={() => setView("createnew")}
          onBack={() => setView("templates")}
        />
      )}
      {view === "usetemplates" && (
        <UseTemplates
          selected={selectedTemplates}
          onBack={() => setView("templates")}
          onCreate={() => setView("templates")}
          onreceptionist={() => setView("receptionist")}
          onsalesagent={() => setView("saleagent")}
          onsupportagent={() => setView("supportagent")}
        />
      )}
    </>
  );
}
