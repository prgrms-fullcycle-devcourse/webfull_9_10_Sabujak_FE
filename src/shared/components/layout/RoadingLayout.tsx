import React, { type ReactNode } from "react";

interface RoadingLayoutProps {
  header?: ReactNode;
  iconArea?: ReactNode;
  children?: ReactNode;
}

const RoadingLayout = ({ header, iconArea, children }: RoadingLayoutProps) => {
  return (
    <>
      <div className="flex-col items-center justify-center min-h-screen bg-stone-50">
        <div className="flex justify-center">{header}</div>

        <main>
          
          <div className="flex flex-col items-center justify-center">
            {iconArea}
          </div>

          <div className="flex flex-col items-center justify-center">
            {children}
          </div>
          
        </main>
      </div>
    </>
  );
};

export default RoadingLayout;
