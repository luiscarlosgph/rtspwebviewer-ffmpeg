#!/bin/bash

# Setup the environment
source $USER/.zshrc

# Run ffmpeg to convert the RTSP stream into HLS
ffmpeg -fflags nobuffer -rtsp_transport tcp -i $RTSP -c copy -hls_time 2 -hls_wrap 10 /root/streaming.m3u8 &

# Run Python web server
python3 -m rtspwebviewer_ffmpeg.run --address 0.0.0.0 --port $PORT --title $WEB_TITLE --m3u8 /root/streaming.m3u8 --password $WEB_PWD &

# Run the CMD specified by the user
sh -c "$(echo $@)"
