"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/cjs/styles/prism";
import functions from "../data/functions.json";

interface Parameter {
  name: string;
  type: string;
  description: string;
}

interface FunctionDoc {
  name: string;
  description: string;
  parameters: Parameter[];
  returns: string;
  usage?: string;
  exampleReturns?: string;
  code: string;
}

const FunctionSection: React.FC<{ func: FunctionDoc }> = ({ func }) => {
  const [showCode, setShowCode] = useState<boolean>(false);

  // Helper to format the example returns as JSON
  const formatExampleReturns = (input: string): string => {
    try {
      return JSON.stringify(JSON.parse(input), null, 2);
    } catch (err) {
      console.log(err);
      return input;
    }
  };

  return (
    <section id={func.name} className="mb-12 scroll-mt-20">
      <h2 className="text-2xl font-bold mt-8 mb-2">{func.name}</h2>
      <p className="mb-4">{func.description}</p>

      <h3 className="text-xl font-semibold">Parameters</h3>
      {func.parameters.length > 0 ? (
        <ul className="list-disc pl-5 mb-4">
          {func.parameters.map((param) => (
            <li key={param.name}>
              <span className="font-bold">{param.name}</span> (
              <em>{param.type}</em>): {param.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No parameters.</p>
      )}

      <h3 className="text-xl font-semibold">Returns</h3>
      <p className="mb-4">{func.returns}</p>

      {func.usage && (
        <>
          <h3 className="text-xl font-semibold">Example Usage</h3>
          <pre className="bg-gray-200 p-2 rounded mb-4 whitespace-pre-wrap">
            {func.usage}
          </pre>
        </>
      )}

      {func.exampleReturns && (
        <>
          <h3 className="text-xl font-semibold">Example Returns</h3>
          <div className="bg-gray-200">
            <SyntaxHighlighter
              language="json"
              style={coy}
              className="mb-4 bg-gray-200"
            >
              {formatExampleReturns(func.exampleReturns)}
            </SyntaxHighlighter>
          </div>
        </>
      )}

      <button
        onClick={() => setShowCode(!showCode)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {showCode ? "Hide Code" : "Show Code"}
      </button>

      <AnimatePresence initial={false}>
        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-100 p-4 rounded">
              <SyntaxHighlighter language="sql" style={coy}>
                {func.code}
              </SyntaxHighlighter>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default function HomePage() {
  return (
    <div className="relative">
      {/* Fixed Left Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 p-4 bg-gray-200 border-r border-gray-300 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Functions</h2>
        <ul className="space-y-2">
          {functions.map((func: FunctionDoc) => (
            <li key={func.name}>
              <a
                href={`#${func.name}`}
                className="text-blue-500 hover:underline"
              >
                {func.name}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content with left margin to offset the fixed sidebar */}
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-6">
          PostgreSQL Functions Documentation
        </h1>
        {functions.map((func: FunctionDoc) => (
          <FunctionSection key={func.name} func={func} />
        ))}
      </div>
    </div>
  );
}
