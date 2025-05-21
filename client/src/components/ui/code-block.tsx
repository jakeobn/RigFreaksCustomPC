import React from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

/**
 * CodeBlock component for displaying code snippets
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "jsx",
  className,
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-0 right-0 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-bl">
        {language}
      </div>
      <pre className="p-4 pt-8 bg-gray-100 dark:bg-gray-800 overflow-x-auto rounded-md">
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
  );
};