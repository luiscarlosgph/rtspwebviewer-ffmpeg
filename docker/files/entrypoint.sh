#!/bin/zsh

# Setup the environment
source $USER/.zshrc

# Run ffmpeg to convert the RTSP stream into RTP
ffmpeg -i $RTSP -an -c:v copy -flags global_header -bsf dump_extra -f rtp rtp://localhost:5052 -vn -codec:a libopus -f rtp rtp://localhost:5051 > /dev/null 2>&1 &

# Run Python web server
#if [ -z $WEB_PWD ]; then 
#    python3 -m rtspwebviewer_ffmpeg.run --address 0.0.0.0 --port $PORT --title $WEB_TITLE --m3u8 /root/streaming.m3u8 > /dev/null 2>&1 &
#else 
#    python3 -m rtspwebviewer_ffmpeg.run --address 0.0.0.0 --port $PORT --title $WEB_TITLE --m3u8 /root/streaming.m3u8 --password $WEB_PWD > /dev/null 2>&1 &
#fi


# Run the CMD specified by the user
sh -c "$(echo $@)"
