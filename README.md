Streaming TV OIO Player - Extracao Direta .MP4
Plataforma modular estilo Prime Video com Glassmorphism, PWA e extracao direta .mp4

Estrutura
/oio-tv/

index.html
style.css
script.js (modulo APIs publicas)
manifest.json
sw.js
README.md
APIs Publicas - 100% URL direta
NASA: images-api.nasa.gov/search + /asset/{id} -> ~orig.mp4
Blender: download.blender.org direto Big Buck Bunny, Sintel, Tears of Steel, Caminandes, Spring
Archive.org: advancedsearch.php + /metadata/{id} filtra .mp4 h264 -> archive.org/download/...
PeerTube: framatube.org/api/v1/videos -> streamingPlaylists.files[].fileUrl
Wikimedia: commons.wikimedia.org/w/api.php imageinfo url .webm direto
TED: download.ted.com direto
Regra: SEMPRE prioriza .mp4/.webm bruto

Player Nativo
<video controls autoplay playsinline class="w-full h-full object-contain"> - Glassmorphism sem marca d'agua - iframe apenas se embed estrito - onError -> proximo video automatico
PWA
manifest.json standalone theme #E50914
sw.js cache first shell, network first mp4

Deploy GitHub Pages 1 commit.
