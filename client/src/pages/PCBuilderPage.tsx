import { Helmet } from 'react-helmet';
import { PCBuilder } from '@/components/pc-builder/PCBuilder';

export function PCBuilderPage() {
  return (
    <>
      <Helmet>
        <title>Custom PC Builder | RigFreaks</title>
        <meta name="description" content="Build your custom PC with our interactive PC Builder tool. Choose from a wide range of components and check compatibility in real-time." />
      </Helmet>
      
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">Custom PC Builder</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Build your dream PC by selecting compatible components for your specific needs
            </p>
          </div>
          
          <PCBuilder />
        </div>
      </div>
    </>
  );
}