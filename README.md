Description
-----------

Web server that displays an RTSP video stream using ffmpeg as backend.

Use as a Docker container
-------------------------

This section explains how to use this repository with Docker.

1. Build Docker container: 

   ```bash
   $ TODO
   ```

2. Launch Docker container:

   ```bash
   $ TODO
   ```
   
Use as a standalone program
---------------------------

This sections explains how to use this repository without Docker, as a standalone Python program.

1. Install dependencies:
   ```bash
   $ sudo apt update
   $ sudo apt install ffmpeg
   ```
   
2. Install `rtspwebviewer-ffmpeg`:
   ```bash
   $ git clone https://github.com/luiscarlosgph/rtspwebviewer-ffmpeg.git
   $ cd rtspwebviewer-ffmpeg
   $ python3 setup.py install
   ```

2. Run `ffmpeg` to convert the [RTSP](https://en.wikipedia.org/wiki/Real_Time_Streaming_Protocol) stream into  [HLS](https://en.wikipedia.org/wiki/HTTP_Live_Streaming):
   ```bash
   $ ffmpeg -fflags nobuffer -rtsp_transport tcp -i <rtsp_stream_address> -c copy -hls_time 2 -hls_wrap 10 <path_to_m3u8_file>
   $ python -m 
   ```

3. Run the web server:
   ```bash
   $ python -m rtspwebviewer-ffmpeg.run --m3u8 <path_to_m3u8_file>
   ```

Author
------

Luis C. Garcia-Peraza Herrera (luiscarlos.gph@gmail.com).


License
-------

This repository is shared under an [MIT License](https://github.com/luiscarlosgph/rtspwebviewer-ffmpeg/blob/main/LICENSE).
