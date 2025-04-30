import React, { useState, useEffect } from "react";

/**
 * Props:
 * - paragraphs: string[]  An array of paragraph strings to type out in sequence.
 * - speed: number         Milliseconds delay between each word (default: 300).
 */
export const WordByWordTypewriter = ({
  paragraphs,
  speed = 300,
}: {
  paragraphs: string[];
  speed?: number;
}) => {
  // Tracks which paragraph we're typing.
  const [activeParagraph, setActiveParagraph] = useState(0);
  // Tracks which word index we're currently adding.
  const [wordIndex, setWordIndex] = useState(0);
  // The text that has been typed for each paragraph so far.
  const [typedParagraphs, setTypedParagraphs] = useState(() =>
    paragraphs.map(() => "")
  );

  useEffect(() => {
    // If we've already typed all paragraphs, stop.
    if (activeParagraph >= paragraphs.length) return;

    const words = paragraphs[activeParagraph].split(" ");

    // If there are still words left in the current paragraph, type the next one.
    if (wordIndex < words.length) {
      const timeout = setTimeout(() => {
        setTypedParagraphs((prev) => {
          const newTyped = [...prev];
          // Add a space if not the very first word in this paragraph
          const nextWord =
            newTyped[activeParagraph].length > 0
              ? newTyped[activeParagraph] + " " + words[wordIndex]
              : words[wordIndex];
          newTyped[activeParagraph] = nextWord;
          return newTyped;
        });
        setWordIndex(wordIndex + 1);
      }, speed);

      // Clear the timeout if the component unmounts or re-renders.
      return () => clearTimeout(timeout);
    } else {
      // We've finished the current paragraph, move on to the next.
      setActiveParagraph(activeParagraph + 1);
      setWordIndex(0);
    }
  }, [activeParagraph, wordIndex, paragraphs, speed]);

  return (
    <div className="space-y-4">
      {typedParagraphs.map((text, idx) => (
        <p key={idx} className="text-lg leading-relaxed font-sans">
          {text}
        </p>
      ))}
    </div>
  );
};