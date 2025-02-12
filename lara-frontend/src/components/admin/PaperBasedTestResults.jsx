import React, { useState } from "react";
import PaperBasedExcelSheet from "./PaperBasedExcelSheet"; // Import the component
import AttendedStudentDetails from "./AttendedStudentDetails";

function PaperBasedTestResults() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Sidebar */}
        <div className="col-md-3 sidebar bg-light p-3">
          <h5 className="mb-3">Test Results</h5>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button
                className="nav-link custom-link btn btn-link text-left"
                onClick={() => setActiveComponent("PaperBasedExcelSheet")}
              >
                Paper Based Excel Sheet
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link custom-link btn btn-link text-left"
                onClick={() => setActiveComponent("AttendedStudentDetails")}
              >
                AttendedStudentDetails
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="col-md-9 content p-3">
          {activeComponent === "PaperBasedExcelSheet" && <PaperBasedExcelSheet />}
          {activeComponent === "AttendedStudentDetails" && <AttendedStudentDetails />}
          </div>
      </div>
    </div>
  );
}

export default PaperBasedTestResults;
