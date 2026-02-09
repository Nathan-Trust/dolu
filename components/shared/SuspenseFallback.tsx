import Image from "next/image";
import React from "react";

const SuspenseFallback = () => {
  return (
    <div className="min-h-screen grid place-content-center">
      <Image src="/quickroom.gif" width={500} height={500} alt="loading-gif" />
    </div>
  );
};

export default SuspenseFallback;
