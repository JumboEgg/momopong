// pages/button-demo.tsx
import React from 'react';
import Button from '@/components/common/buttons/TextButton';

function ButtonDemo(): JSX.Element {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Button Component Demo</h1>
      <div className="space-y-8">
        {/* White Background Buttons */}
        <section>
          <h2 className="text-xl font-bold mb-4">White Background</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <Button size="sm" variant="white" className="">텍스트</Button>
              <Button size="md" variant="white" className="">텍스트</Button>
              <Button size="lg" variant="white" className="">텍스트</Button>
            </div>
            <div className="flex gap-4 items-center">
              <Button size="sm" variant="white" className="" disabled>텍스트</Button>
              <Button size="md" variant="white" className="" disabled>텍스트</Button>
              <Button size="lg" variant="white" className="" disabled>텍스트</Button>
            </div>
          </div>
        </section>

        {/* Gray Background Buttons */}
        <section>
          <h2 className="text-xl font-bold mb-4">Gray Background</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <Button size="sm" variant="gray" className="">텍스트</Button>
              <Button size="md" variant="gray" className="">텍스트</Button>
              <Button size="lg" variant="gray" className="">텍스트</Button>
            </div>
            <div className="flex gap-4 items-center">
              <Button size="sm" variant="gray" className="" disabled>텍스트</Button>
              <Button size="md" variant="gray" className="" disabled>텍스트</Button>
              <Button size="lg" variant="gray" className="" disabled>텍스트</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ButtonDemo;
