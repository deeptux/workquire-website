import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

import { ThemeProvider } from "./components/site/ThemeProvider";
import Navbar from "./components/site/Navbar";
import Hero from "./components/site/Hero";
import About from "./components/site/About";
import Milestones from "./components/site/Milestones";
import WhyBuilt from "./components/site/WhyBuilt";
import Talents from "./components/site/Talents";
import Process from "./components/site/Process";
import Footer from "./components/site/Footer";
import InquiryDialog from "./components/site/InquiryDialog";

const Landing = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState("va");

  const openInquiry = (type) => {
    setInquiryType(type);
    setInquiryOpen(true);
  };

  return (
    <div className="App relative">
      <Navbar
        onInquireVA={() => openInquiry("va")}
        onInquireTeam={() => openInquiry("team")}
      />
      <main>
        <Hero
          onInquireVA={() => openInquiry("va")}
          onInquireTeam={() => openInquiry("team")}
        />
        <About />
        <Milestones />
        <WhyBuilt />
        <Talents onInquireTeam={() => openInquiry("team")} />
        <Process
          onInquireVA={() => openInquiry("va")}
          onInquireTeam={() => openInquiry("team")}
        />
      </main>
      <Footer
        onInquireVA={() => openInquiry("va")}
        onInquireTeam={() => openInquiry("team")}
      />
      <InquiryDialog open={inquiryOpen} onOpenChange={setInquiryOpen} type={inquiryType} />
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
