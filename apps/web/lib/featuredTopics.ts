import type { Locale } from "@human-ecmascript/model";

type FeaturedTopic = {
  slug: string;
  copy: Record<Locale, { title: string; body: string; searchTerms: string }>;
};

// This is the curated order of the complete release inventory, shared by cards,
// search, article numbering, and the sitemap. The inventory test prevents omissions.
export const featuredTopics = [
  {
    slug: "reference-call-this",
    copy: {
      en: {
        title: "References, calls, and this",
        body: "Follow `obj.method()` and `new C()` from receiver selection to focused observable checks.",
        searchTerms: "reference property method this evaluatecall",
      },
      ru: {
        title: "Ссылки, вызовы и this",
        body: "Разберём `obj.method()` и `new C()`: от выбора `this` до проверок в коде.",
        searchTerms: "reference свойство метод this evaluatecall",
      },
    },
  },
  {
    slug: "const-let-var",
    copy: {
      en: {
        title: "const, let, and var without folklore",
        body: "Trace initialization, TDZ, scopes, loop bindings, and the real performance boundary behind each declaration.",
        searchTerms: "const let var tdz scope binding hoisting performance loop closure",
      },
      ru: {
        title: "const, let и var — без мифов",
        body: "Разберём инициализацию, TDZ, области видимости, циклы и честные правила выбора без мифов о скорости.",
        searchTerms:
          "const let var tdz область видимости переменная всплытие производительность цикл замыкание",
      },
    },
  },
  {
    slug: "values-types-memory",
    copy: {
      en: {
        title: "Primitive values, Reference Records, and actual storage",
        body: "Trace name resolution in ECMA-262, then compare local and captured Smi, String, and Symbol storage in pinned V8 bytecode.",
        searchTerms:
          "primitive value reference record environment resolvebinding object identity heap stack context smi symbol bigint number",
      },
      ru: {
        title: "Primitive value, Reference Record и реальное хранение",
        body: "Проследим поиск имени по ECMA-262 и сравним хранение локальных и захваченных Smi, String и Symbol в закреплённом V8.",
        searchTerms:
          "primitive value reference record environment resolvebinding ссылочный тип объект идентичность heap stack context smi symbol bigint number",
      },
    },
  },
  {
    slug: "typeof-not-type-query",
    copy: {
      en: {
        title: "typeof is not a type system query",
        body: "Trace missing names, TDZ, null, and callable objects through the operator algorithm, then locate the browser boundary of document.all.",
        searchTerms:
          "typeof type language specification null undefined function class arrow callable constructable proxy revoked tdz unresolvable reference getvalue document.all ishtmldda",
      },
      ru: {
        title: "typeof — не запрос к системе типов",
        body: "Разберём отсутствующие имена, TDZ, null и объекты с [[Call]] по алгоритму оператора, затем найдём границу браузерной среды у document.all.",
        searchTerms:
          "typeof тип языка спецификация null undefined function класс стрелка вызов конструирование proxy отозванный tdz неразрешимая reference getvalue document.all ishtmldda",
      },
    },
  },
] as const satisfies readonly FeaturedTopic[];

export function topicSequence(slug: string): number {
  const index = featuredTopics.findIndex((topic) => topic.slug === slug);
  if (index < 0) throw new Error(`Topic is missing from the release inventory: ${slug}`);
  return index + 1;
}
