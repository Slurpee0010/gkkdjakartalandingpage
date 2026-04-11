const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function extractYoutubeVideoId(value: string) {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();

    if (hostname === "youtu.be" || hostname === "www.youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return isValidYoutubeId(id) ? id : null;
    }

    if (hostname === "youtube.com" || hostname === "www.youtube.com" || hostname === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return isValidYoutubeId(id) ? id : null;
      }

      const segments = url.pathname.split("/").filter(Boolean);
      const typeSegment = segments[0];
      const id = segments[1];

      if (["embed", "shorts", "live", "v"].includes(typeSegment)) {
        return isValidYoutubeId(id) ? id : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function getYoutubeEmbedUrl(value?: string | null) {
  const id = value ? extractYoutubeVideoId(value) : null;

  if (!id) {
    return null;
  }

  const params = new URLSearchParams({
    rel: "0",
    enablejsapi: "1",
    playsinline: "1",
    modestbranding: "1",
    mute: "1",
  });

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getYoutubeWatchUrl(value?: string | null) {
  const id = value ? extractYoutubeVideoId(value) : null;
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

export function isYoutubeVideoUrl(value: string) {
  return extractYoutubeVideoId(value) !== null;
}

function isValidYoutubeId(value?: string | null): value is string {
  return !!value && YOUTUBE_ID_PATTERN.test(value);
}
