# Noise cancelling microphone

create `~/.config/pipewire/pipewire.conf.d/99-input-denoising.conf` with content

```
context.modules = [
{   name = libpipewire-module-filter-chain
    args = {
        node.description =  "Noise Canceling source"
        media.name =  "Noise Canceling source"
        filter.graph = {
            nodes = [
                {
                    type = ladspa
                    name = rnnoise
                    plugin = /usr/local/lib/noise-suppression-for-voice/ladspa/librnnoise_ladspa.so
                    label = noise_suppressor_mono
                    control = {
                        "VAD Threshold (%)" = 85.0
                        "VAD Grace Period (ms)" = 200
                        "Retroactive VAD Grace (ms)" = 200
                    }
                }
            ]
        }
        capture.props = {
            node.name =  "capture.rnnoise_source"
            node.passive = true
            audio.rate = 48000
        }
        playback.props = {
            node.name =  "rnnoise_source"
            media.class = Audio/Source
            audio.rate = 48000
        }
    }
}
]
```

```
git clone https://github.com/werman/noise-suppression-for-voice.git
sudo apt-get install cmake libtiff libfreetype-dev libxrandr-dev libxinerama-dev libxcursor-dev
cd noise-suppression-for-voice/
cmake -Bbuild-x64 -H. -GNinja -DCMAKE_BUILD_TYPE=Release
ninja -C build-x64
sudo cp build-x64/bin /usr/local/lib/noise-suppression-for-voice -r
systemctl restart --user pipewire.service
```
