import React from "react";
import { ReportForm } from "../Components/ReportForm";
import { NavbarInicioUsers } from "../Components/NavbarInicioUsers";

const Report = () => {
  return (
    <div className="bg-dark">
      <NavbarInicioUsers />
      <ReportForm />
    </div>
  );
};

export default Report;
