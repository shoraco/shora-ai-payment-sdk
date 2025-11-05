export const DEFAULT_BASE_URL = process.env.SHORA_BASE_URL || 'https://api.shora.cloud';

export interface ShoraConfig {
  apiKey?: string;
  basePath?: string;
  timeout?: number;
}

export function normalizeBasePath(cfg: Partial<ShoraConfig>): string {
  return cfg.basePath || DEFAULT_BASE_URL;
}

