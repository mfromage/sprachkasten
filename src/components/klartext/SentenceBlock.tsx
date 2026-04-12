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
    <div className={showGrammar ? "pb-4 mb-4 border-b border-gray-200 dark:border-gray-800" : ""}>
      <p className="font-serif text-lg leading-relaxed">
        {sentence.tokens.map((token, i) => (
          <span key={token.id}>
            {i > 0 && token.pos !== "PUNCT" && " "}
            <TokenWord token={token} showSyntax={showSyntax} />
          </span>
        ))}
      </p>
      {showGrammar && sentence.grammar_themes.length > 0 && (
        <div className="mt-3 space-y-2">
          {sentence.grammar_themes.map((theme) => (
            <GrammarCard key={theme.theme_id} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}
