import { useEffect, useRef, useState } from "react";

interface AutoplayYoutubeEmbedProps {
  embedUrl: string;
  title: string;
  className?: string;
}

const OBSERVER_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];

export default function AutoplayYoutubeEmbed({
  embedUrl,
  title,
  className = "h-full w-full",
}: AutoplayYoutubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const target = containerRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.55);
      },
      {
        threshold: OBSERVER_THRESHOLDS,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !iframeRef.current?.contentWindow) {
      return;
    }

    const contentWindow = iframeRef.current.contentWindow;

    const sendCommand = (func: "playVideo" | "pauseVideo" | "mute") => {
      contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func,
          args: [],
        }),
        "*",
      );
    };

    if (isVisible) {
      sendCommand("mute");
      sendCommand("playVideo");
    } else {
      sendCommand("pauseVideo");
    }
  }, [isLoaded, isVisible, embedUrl]);

  return (
    <div ref={containerRef} className={className}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
