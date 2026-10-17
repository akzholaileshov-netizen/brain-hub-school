"use client";

import { useState } from "react";
import {
  isDirectVideoUrl,
  isYouTubeUrl,
  toYouTubeEmbedUrl,
} from "@/lib/lesson-videos";

type Props = {
  videoUrl: string | null;
  title: string;
  onEnded?: () => void;
};

export function LessonVideoPlayer({ videoUrl, title, onEnded }: Props) {
  // Parent remounts via key={activeVideo.id}; local error resets on remount.
  const [loadError, setLoadError] = useState(false);

  if (!videoUrl) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-[var(--muted)] px-6 text-center">
        <p className="text-sm font-medium text-[var(--foreground)] sm:text-base">
          Бұл сабақтың видеосы жақын арада қосылады
        </p>
        <p className="max-w-md text-xs text-[var(--muted-foreground)]">
          «{title}» тақырыбына арналған бейне әзірге қолжетімсіз.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-[var(--muted)] px-6 text-center">
        <p className="text-sm font-medium text-[var(--destructive)] sm:text-base">
          Бейнені жүктеу мүмкін болмады
        </p>
        <p className="max-w-md text-xs text-[var(--muted-foreground)]">
          Желіні тексеріп, бетті жаңартыңыз немесе кейінірек қайта көріңіз.
        </p>
      </div>
    );
  }

  const youtubeEmbed = isYouTubeUrl(videoUrl)
    ? toYouTubeEmbedUrl(videoUrl)
    : null;

  if (youtubeEmbed) {
    return (
      <iframe
        key={youtubeEmbed}
        title={title}
        src={`${youtubeEmbed}?rel=0`}
        className="aspect-video w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setLoadError(true)}
      />
    );
  }

  if (isDirectVideoUrl(videoUrl) || videoUrl.startsWith("http")) {
    return (
      <video
        key={videoUrl}
        className="aspect-video w-full"
        controls
        preload="metadata"
        src={videoUrl}
        onEnded={onEnded}
        onError={() => setLoadError(true)}
      >
        Сіздің браузеріңіз бейнені қолдамайды.
      </video>
    );
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-[var(--muted)] px-6 text-center">
      <p className="text-sm font-medium text-[var(--foreground)]">
        Бұл сабақтың видеосы жақын арада қосылады
      </p>
    </div>
  );
}
