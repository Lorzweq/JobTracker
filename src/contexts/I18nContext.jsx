import { createContext } from "react";

export const I18nContext = createContext({ t: () => "", lang: "fi", setLang: () => {} });