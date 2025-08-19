export const themeMap = {
  spring: { light: "light-spring", dark: "dark-spring" },
  summer: { light: "light-summer", dark: "dark-summer" },
  autumn: { light: "light-autumn", dark: "dark-autumn" },
  winter: { light: "light-winter", dark: "dark-winter" },
};

export function getThemeKey(season, mode) {
  return themeMap[season]?.[mode] || "light-spring";
}