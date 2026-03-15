import os

path = r'frontend\src\pages\dashboard\VideoPlayer.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# YouTube/Vimeo Embed Logic
embed_replacement = """                  videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com')) ? (
                    <iframe 
                      src={videoUrl.includes('youtube.com/watch?v=') ? videoUrl.replace('watch?v=', 'embed/') : videoUrl.includes('youtu.be/') ? videoUrl.replace('youtu.be/', 'youtube.com/embed/') : videoUrl.includes('vimeo.com/') ? videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/') : videoUrl}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      ref={videoRef}
                      src={videoUrl || undefined}
                      controls
                      autoPlay
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleVideoEnded}
                      className="w-full h-full outline-none"
                      controlsList="nodownload"
                    />
                  )"""

# Find the video block
start_tag = "<video"
end_tag = "/>"

# Find lines between ) : ( and )
search_pattern = '                ) : (\n                  <video'
if search_pattern in content:
    print("Found exact match")
    # This is hard because of indentation. Let's use a simpler replace.
else:
    print("Not found exact, trying soft match")

import re
pattern = re.compile(r'(\s+)\) : \(\n\s+<video.*?\/>', re.DOTALL)
content = pattern.sub(r'\1) : (\n' + embed_replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
