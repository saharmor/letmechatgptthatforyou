export interface AIProvider {
  id: string;
  name: string;
  titlePrefix: string;
  titleAccent: string;
  titleSuffix: string;
  tagline: string;
  accentColor: string;
  accentColorLight: string;
  buttonLabel: string;
  placeholder: string;
  buildRedirectUrl: (query: string) => string;
}

export const providers: Record<string, AIProvider> = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    titlePrefix: 'Let Me ',
    titleAccent: 'ChatGPT',
    titleSuffix: ' That For You',
    tagline: 'Since using ChatGPT is apparently too hard.',
    accentColor: '#10a37f',
    accentColorLight: '#e6f5f0',
    buttonLabel: 'Ask ChatGPT',
    placeholder: 'Ask ChatGPT anything...',
    buildRedirectUrl: (query: string) =>
      `https://chatgpt.com/?hints=search&prompt=${encodeURIComponent(query)}`,
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    titlePrefix: 'Let Me ',
    titleAccent: 'Claude',
    titleSuffix: ' That For You',
    tagline: 'Since asking Claude yourself was too much effort.',
    accentColor: '#d97757',
    accentColorLight: '#fdf0ea',
    buttonLabel: 'Ask Claude',
    placeholder: 'Ask Claude anything...',
    buildRedirectUrl: (query: string) =>
      `https://claude.ai/new?q=${encodeURIComponent(query)}`,
  },
};

export function getProvider(id: string): AIProvider | undefined {
  return providers[id];
}

export function getDisplayName(provider: AIProvider): string {
  return `${provider.titlePrefix}${provider.titleAccent}${provider.titleSuffix}`;
}
