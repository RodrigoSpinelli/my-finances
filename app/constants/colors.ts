export interface ColorOption {
  name: string;
  bg: string;
  ring: string;
  border: string;
}

export const colorOptions: ColorOption[] = [
  {
    name: "red",
    bg: "bg-red-600",
    ring: "ring-red-500",
    border: "border-red-500",
  },
  {
    name: "yellow",
    bg: "bg-yellow-400",
    ring: "ring-yellow-400",
    border: "border-yellow-400",
  },
  {
    name: "green",
    bg: "bg-green-400",
    ring: "ring-green-500",
    border: "border-green-500",
  },
  {
    name: "cyan",
    bg: "bg-cyan-500",
    ring: "ring-cyan-500",
    border: "border-cyan-500",
  },
  {
    name: "purple",
    bg: "bg-purple-500",
    ring: "ring-purple-500",
    border: "border-purple-500",
  },
  {
    name: "pink",
    bg: "bg-pink-500",
    ring: "ring-pink-500",
    border: "border-pink-500",
  },
];

export function getColorOptionByName(
  name: string | null | undefined,
): ColorOption | undefined {
  if (!name) return undefined;
  return colorOptions.find((c) => c.name === name);
}
