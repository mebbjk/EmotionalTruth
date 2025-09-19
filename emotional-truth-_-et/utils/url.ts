
export const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) {
    return '';
  }

  let videoId: string | null = null;
  try {
    // Regular expression to find the video ID from various YouTube URL formats.
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      videoId = match[2];
    }
  } catch (error) {
    console.error("Error parsing YouTube URL", error);
    return '';
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Return empty string if no valid ID is found
  return '';
};
