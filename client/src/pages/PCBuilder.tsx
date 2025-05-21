import React from "react";
import PCBuilderComponent from "@/components/pcbuilder/PCBuilder";
import { Helmet } from "react-helmet";

const PCBuilder: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Custom PC Builder - RigFreaks</title>
        <meta name="description" content="Build your dream PC with our custom PC builder tool. Choose from premium components, check compatibility, and create a system perfectly matched to your needs." />
        <meta property="og:title" content="Custom PC Builder - RigFreaks" />
        <meta property="og:description" content="Design your perfect custom PC with our interactive builder tool. Select components, check compatibility, and order your dream rig." />
        <meta property="og:image" content="https://pixabay.com/get/g2b8189182afa50247464a01c3e23d5b1be55ee4e0a6b6f545bcf23076cbfd5d2feae6cbbd89e7c8f33f2944e4d76e46fe635f94be3bec81a96b2e2e1280ffbd4_1280.jpg" />
        <meta property="og:url" content="https://rigfreaks.com/build-your-pc" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="bg-dark-base pt-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-rajdhani mb-4 text-center">
            BUILD YOUR <span className="text-accent">CUSTOM PC</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Design your perfect PC by selecting each component. Our tool will help ensure all parts are compatible and optimize your build for performance.
          </p>
        </div>
      </div>
      
      <PCBuilderComponent />
    </>
  );
};

export default PCBuilder;
