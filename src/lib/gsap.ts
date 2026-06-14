'use client';

// Single registration point for GSAP + plugins. GSAP 3.13+ ships every plugin
// for free, so ScrollTrigger and SplitText resolve from the base package.
// Import this from 'use client' components; all animation runs inside
// useGSAP(() => {...}, { scope: ref }) so it auto-reverts on unmount.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register once. Guard against double-registration on Fast Refresh / re-import.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };
