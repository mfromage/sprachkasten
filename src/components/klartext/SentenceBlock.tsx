import type { Sentence } from "@/lib/types";
import { TokenWord } from "./TokenWord";
import { GrammarCard } from "./GrammarCard";

interface SentenceBlockProps {
  sentence: Sentence;
  showSyntax: boolean;
  showGrammar: boolean;
}

export function SentenceBlock({ sentence, showSyntax, showGrammar }: SentenceBlockProps) {
  return (
    <div className={showGrammar ? "pb-5 mb-5 border-b border-gray-200 dark:border-gray-800" : "mb-1"}>
      <div className={`text-xl leading-[2] ${showSyntax ? "[word-spacing:4px]" : ""}`}>
        {sentence.tokens.map((token, i) => (
          <span key={token.id}>
            {i > 0 && token.pos !== "PUNCT" && " "}
            <TokenWord token={token} showSyntax={showSyntax} />
          </span>
        ))}
      </div>
      {showGrammar && sentence.grammar_themes.length > 0 && (
        <div className="mt-3 space-y-2">
          {sentence.grammar_themes.map((theme, i) => (
            <GrammarCard key={`${theme.theme_id}-${i}`} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}
