// ParentComponent.jsx

import React, { useState } from "react";
import PhysioView from "./PhysioView";
import SalesView from "./Salesview";

const ParentComponent = () => {
  const [timeRanges, setTimeRanges] = useState([]);

  return (
    <div>
      <PhysioView physioId="yourPhysioId" setTimeRanges={setTimeRanges} />
      <SalesView timeRanges={timeRanges} />
    </div>
  );
};

export default ParentComponent;
