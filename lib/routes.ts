// Central internal route construction. Use these helpers instead of hard-coding
// href strings so canonical routes stay consistent and cannot silently 404.
// (External URLs and static assets do not use these.)

export function getHomePath(): string { return "/"; }
export function getBrowsePath(): string { return "/browse"; }
export function getAdhikaramPath(adhikaramId: string): string { return `/adhikaram/${adhikaramId}`; }
export function getIyalPath(adhikaramId: string, iyalId: string): string { return `/adhikaram/${adhikaramId}/${iyalId}`; }
export function getSutraPath(sutraId: string): string { return `/sutra/${sutraId}`; }
export function getSutraJsonPath(sutraId: string): string { return `/api/sutra/${sutraId}`; }
export function getGlossaryPath(termId?: string): string { return termId ? `/glossary#${termId}` : "/glossary"; }
export function getSearchPath(query?: string): string { return query ? `/search?q=${encodeURIComponent(query)}` : "/search"; }
export function getMethodologyPath(): string { return "/methodology"; }
export function getSourcePath(): string { return "/source"; }
export function getAboutPath(): string { return "/about"; }
export function getUnderstandingPath(): string { return "/understanding"; }
export function getCommentariesPath(): string { return "/commentaries"; }
export function getToolsPath(): string { return "/tools"; }

export const TOOL_PATHS = {
  "tamil-letters": "/tools/tamil-letters",
  "letter-classifier": "/tools/letter-classifier",
  "matra-explorer": "/tools/matra-explorer",
  "ani-ilakkanam": "/tools/ani-ilakkanam",
} as const;
export type ToolId = keyof typeof TOOL_PATHS;
export function getToolPath(id: ToolId): string { return TOOL_PATHS[id]; }
