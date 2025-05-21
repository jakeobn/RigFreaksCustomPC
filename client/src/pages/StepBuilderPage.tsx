import { Helmet } from 'react-helmet';
import { StepBuilder } from '@/components/pc-builder/StepBuilder';

function StepBuilderPage() {
  return (
    <div className="bg-white">
      <Helmet>
        <title>Step-by-Step PC Builder | RigFreaks</title>
        <meta name="description" content="Build your custom PC step-by-step with our guided PC builder. Choose compatible components and create the perfect custom gaming PC." />
        <meta property="og:title" content="Step-by-Step PC Builder | RigFreaks" />
        <meta property="og:description" content="Build your custom PC step-by-step with our guided PC builder. Choose compatible components and create the perfect custom gaming PC." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Build Your Custom PC</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our guided step-by-step builder helps you create the perfect custom PC with guaranteed compatibility.
            Follow each step to select your components.
          </p>
        </div>
        
        <StepBuilder />
      </div>
    </div>
  );
}

export default StepBuilderPage;