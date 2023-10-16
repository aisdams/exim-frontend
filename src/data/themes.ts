export const themes = [
  {
    name: 'default',
    hsl: '262.1 83.3% 57.8%',
    hslDark: '263.4 69.3% 42.2%',
    checkLight: true,
    foreground: '0 0% 98%',
    foregroundDark: '0 0% 98%',
  },
  {
    name: 'slate',
    hsl: '222.2 47.4% 11.2%',
    hslDark: '210 40% 98%',
    foreground: '210 40% 98%',
    foregroundDark: '222.2 47.4% 11.2%',
  },
  {
    name: 'red',
    hsl: '0 72.2% 50.6%',
    hslDark: '0 72.2% 50.6%',
    foreground: '0 85.7% 97.3%',
    foregroundDark: '0 85.7% 97.3%',
  },
  {
    name: 'orange',
    hsl: '24.6 95% 53.1%',
    hslDark: '20.5 90.2% 48.2%',
    foreground: '60 9.1% 97.8%',
    foregroundDark: '60 9.1% 97.8%',
  },
  {
    name: 'green',
    hsl: '142.1 76.2% 36.3%',
    hslDark: '142.1 70.6% 45.3%',
    foreground: '355.7 100% 97.3%',
    foregroundDark: '144.9 80.4% 10%',
  },
  {
    name: 'blue',
    hsl: '221.2 83.2% 53.3%',
    hslDark: '217.2 91.2% 59.8%',
    foreground: '210 40% 98%',
    foregroundDark: '222.2 47.4% 11.2%',
  },
  {
    name: 'yellow',
    hsl: '47.9 95.8% 53.1%',
    hslDark: '47.9 95.8% 53.1%',
    foreground: '26 83.3% 14.1%',
    foregroundDark: '26 83.3% 14.1%',
  },
] as const;

export type Theme = (typeof themes)[number]['name'];
