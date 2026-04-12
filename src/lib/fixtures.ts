import type { Article } from "./types";
import article1 from "../../fixtures/artticle-1.json";

const FIXTURES: Record<string, Article> = {
  "artikel-1": {
    slug: "artikel-1",
    title: "Treffen in Washington geplant / Israel greift weiter an / Vance warnt Iran vor Spiel",
    paragraphs: article1.paragraphs,
    vocabulary: [
      {
        word: "Regierung",
        article: "die",
        translation: "government",
        example: "Israel will mit der libanesischen Regierung über ein Ende des Libanonkrieges verhandeln.",
      },
      {
        word: "verhandeln",
        article: null,
        translation: "to negotiate",
        example: "Israel will mit der libanesischen Regierung über ein Ende des Libanonkrieges verhandeln.",
      },
      {
        word: "Angriffe",
        article: "die (Pl.)",
        translation: "attacks",
        example: "Die Angriffe auf die Hizbullah fortzusetzen.",
      },
      {
        word: "Treffen",
        article: "das",
        translation: "meeting",
        example: "In der kommenden Woche soll es ein vorbereitendes Treffen der Botschafter beider Länder geben.",
      },
      {
        word: "Botschafter",
        article: "der",
        translation: "ambassador",
        example: "In der kommenden Woche soll es ein vorbereitendes Treffen der Botschafter beider Länder geben.",
      },
      {
        word: "mitteilen",
        article: null,
        translation: "to announce, to inform",
        example: "Der israelische Regierungschef hatte am Donnerstag mitgeteilt, er habe sein Kabinett angewiesen.",
      },
      {
        word: "anweisen",
        article: null,
        translation: "to instruct, to direct",
        example: "Er habe sein Kabinett angewiesen, direkte Gespräche aufzunehmen.",
      },
      {
        word: "Entwaffnung",
        article: "die",
        translation: "disarmament",
        example: "Gespräche, die sich auf die Entwaffnung der Hizbullah konzentrieren sollten.",
      },
      {
        word: "Kriegszustand",
        article: "der",
        translation: "state of war",
        example: "Beide Länder befinden sich seit 1948 offiziell im Kriegszustand.",
      },
      {
        word: "Zurückhaltung",
        article: "die",
        translation: "restraint",
        example: "Netanjahu hat sich bereit erklärt, Zurückhaltung im Libanonkrieg walten zu lassen.",
      },
      {
        word: "Luftangriffswelle",
        article: "die",
        translation: "wave of airstrikes",
        example: "Am Mittwoch waren im Zuge einer groß angelegten israelischen Luftangriffswelle mehr als 300 Menschen getötet worden.",
      },
      {
        word: "gefährden",
        article: null,
        translation: "to endanger, to jeopardize",
        example: "Die fortgesetzten israelischen Schläge gefährden auch die amerikanisch-iranischen Verhandlungen.",
      },
    ],
  },
};

export function getArticle(slug: string): Article | null {
  return FIXTURES[slug] ?? null;
}

export function getArticleSlugs(): string[] {
  return Object.keys(FIXTURES);
}
