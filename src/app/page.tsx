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
  const [copied, setCopied] = useState(false);
  const rules = `
  ПОДГОТОВКА:

  1. Каждому игроку раздают стартовую руку с картами (количество зависит от числа игроков).

  2. Игра длится 3 раунда.

  ХОД:

  1. Все игроки одновременно выбирают по одной карте из руки и кладут её на стол лицом вниз.

  2. После выбора карты оставшиеся в руке карты передаются следующему игроку по кругу.

  3. Выбранные карты переворачиваются лицом вверх и остаются у игрока на столе до конца раунда.

  ОКОНЧАНИЕ РАУНДА:

  1. Когда у игроков заканчиваются карты, раунд завершается.

  2. Подсчитываются очки за выложенные карты (каждая комбинация даёт определённое количество очков).

  НОВЫЙ РАУНД:

  1. Все карты, кроме «Пудингов» (Pudding), убираются со стола.

  2. Раздаются новые карты, и процесс повторяется.

  ЗАВЕРШЕНИЕ ИГРЫ:

  1. После третьего раунда игроки получают/теряют дополнительные очки за «Пудинги».

  2. Подсчитываются все очки, и побеждает игрок с наибольшим результатом.
  `;
  // Single string containing all queries with comments
  const exampleQueries = `
-- 1) REGISTER USER
SELECT register_user('alice', 'abc123');

-- 2) LOGIN
SELECT login_user('alice', 'abc123');

-- 3) CREATE SESSION
SELECT create_session('<alice_token_uuid>', 'SaturdayGame', 30, 4);

-- 4) GET SESSIONS
SELECT get_sessions('<alice_token_uuid>');

-- 5) JOIN SESSION
SELECT join_session('<bob_token_uuid>', <session_id>);

-- 6) GET SESSION PLAYERS
SELECT get_session_players('<alice_token_uuid>', <session_id>);

-- 7) START SESSION
SELECT start_session(<session_id>);

-- 8) GET PLAYER CARDS
SELECT get_player_cards('<bob_token_uuid>', <session_id>);

-- 9) GET PLAYER TABLE CARDS
SELECT get_player_table_cards('<bob_token_uuid>', <session_id>);

-- 10) PLACE CARD ON TABLE
SELECT place_card_on_table('<bob_token_uuid>', <session_id>, <sessioncard_id>);

-- 11) PASS CARDS
SELECT pass_cards(<session_id>);

-- 12) SCORE ROUND
SELECT score_round(<session_id>);

-- 13) START NEW ROUND
SELECT start_new_round(<session_id>);

-- 14) END GAME SESSION (after the final round)
SELECT end_game_session('<alice_token_uuid>', <session_id>);

-- 15) GET PLAYERS SCORE
SELECT get_players_score(<session_id>);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exampleQueries.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      {/* Fixed Left Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 p-4 bg-gray-200 border-r border-gray-300 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Start</h2>
        <ul className="space-y-2">
          <li>
            <a href="#rules" className="hover:underline">
              Rules
            </a>
          </li>
          <li>
            <a href="#connection" className="hover:underline">
              Connection
            </a>
          </li>
          <li>
            <a href="#example" className="hover:underline">
              Example queries
            </a>
          </li>
          <hr className="h-1 bg-gray-300"></hr>
          <h2 className="text-xl font-bold mb-4">Functions</h2>
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
        <h1 className="text-3xl font-bold mb-6">Start</h1>
        <section className="mb-12 scroll-mt-20" id="rules">
          <h2 className="text-2xl font-bold mt-8 mb-2">
            Краткое описание правила
          </h2>
          <p className="whitespace-pre-line">{rules.trim()}</p>
        </section>
        <section className="mb-12 scroll-mt-20" id="connection">
          <h2 className="text-2xl font-bold mt-8 mb-2">Connection</h2>
          <p>
            Для подключения к базе данных используйте следующие учетные данные:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <strong>Host:</strong>{" "}
              ep-divine-heart-a2swx5pb.eu-central-1.aws.neon.tech
            </li>
            <li>
              <strong>Port:</strong> 5432
            </li>
            <li>
              <strong>Database:</strong> neondb
            </li>
            <li>
              <strong>User:</strong> neondb_owner
            </li>
            <li>
              <strong>Password:</strong> npg_tw0C7qaYGVpD
            </li>
          </ul>
        </section>
        <section className="mb-12 scroll-mt-20" id="example">
          <h2 className="text-2xl font-bold mt-8 mb-2">Example queries</h2>
          <div className="relative mb-4">
            <button
              onClick={handleCopy}
              className="text-black absolute right-3 top-3 bg-gray-100 hover:bg-gray-200 text-sm px-2 py-1 rounded"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <SyntaxHighlighter
              className="mb-4 bg-gray-200"
              language="sql"
              style={coy}
              showLineNumbers
            >
              {exampleQueries.trim()}
            </SyntaxHighlighter>
          </div>
        </section>
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
