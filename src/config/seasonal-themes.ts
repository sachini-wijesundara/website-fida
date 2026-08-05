export type SeasonalThemeName = "none" | "christmas" | "new-year" | "vesak" | "autumn";

export interface SeasonalThemeConfig {
  enabled: boolean;
  theme: SeasonalThemeName;
  startAt: string;
  endAt: string;
  intensity: "low" | "medium" | "high";
  respectReducedMotion: boolean;
  mobileEnabled: boolean;
}

export const seasonalConfig: SeasonalThemeConfig = {
  enabled: true,
  theme: "none", // Fallback, overrideable dynamically by admin settings
  startAt: "2026-01-01",
  endAt: "2026-12-31",
  intensity: "medium",
  respectReducedMotion: true,
  mobileEnabled: true,
};
