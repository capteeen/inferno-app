'use client';

import Spline from '@splinetool/react-spline/next';

export default function SplineBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      <Spline
        scene="https://prod.spline.design/fCNa1NUaZ3DrAROO/scene.splinecode" 
      />
    </div>
  );
} 