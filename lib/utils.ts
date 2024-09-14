import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSimpleId(): string {
    return Math.random().toString(26).slice(2);
}

export function removeTrailingSlash(s: string): string {
    return s.replace(/\/+$/,'')
}

export function cleanInput(s: string | undefined | null): string {
    if (typeof s === "undefined") return "";
    if (s === null) return "";
    return s.trim();
}
