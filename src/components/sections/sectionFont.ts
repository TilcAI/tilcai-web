import localFont from "next/font/local";

/** Poppins for the story sections (problem, solution); one instance so the font loads once. */
export const sectionSans = localFont({
  src: [
    { path: "../../fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-section",
});
