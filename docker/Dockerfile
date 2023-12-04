# @brief  Image with support for rtspwebviewer-ffmpeg.
# @author Luis C. Garcia Peraza Herrera (luiscarlos.gph@gmail.com).
# @date   13 November 2022.

# Image info
FROM ubuntu:latest
LABEL maintainer="luiscarlos.gph@gmail.com"
LABEL version="0.1"
LABEL description="Image with support for rtspwebviewer-ffmpeg."

# Install commonly used packages
RUN apt update
RUN DEBIAN_FRONTEND=noninteractive apt upgrade -y
RUN DEBIAN_FRONTEND=noninteractive apt install -y apt-utils aptitude sudo vim zsh wget curl git net-tools tmux locales build-essential cmake build-essential zlib1g-dev libbz2-dev libreadline-dev libssl-dev libsqlite3-dev libffi-dev liblzma-dev tk-dev ncurses-dev

# Install locales
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Define essential environment variables
ENV USER="root"
ENV HOME="/$USER"

# Intall oh-my-zsh so we have a nice terminal
RUN wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O $HOME/install.sh
RUN chmod +x $HOME/install.sh 
RUN $HOME/install.sh --unattended
RUN sed -i 's/robbyrussell/terminalparty/g' $HOME/.zshrc

# Install Python's pyenv environment
ENV PYTHON_VERSION="3.9.13"
RUN git clone https://github.com/pyenv/pyenv.git $HOME/.pyenv
RUN echo 'export PYENV_ROOT="$HOME/.pyenv"' >> $HOME/.zshrc
RUN echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> $HOME/.zshrc
RUN echo 'eval "$(pyenv init --path)"' >> $HOME/.zshrc
RUN /bin/zsh -c "source $HOME/.zshrc && pyenv install $PYTHON_VERSION"
RUN /bin/zsh -c "source $HOME/.zshrc && pyenv global $PYTHON_VERSION"

# Install ffmpeg
RUN DEBIAN_FRONTEND=noninteractive apt install -y ffmpeg

# Install WebRTC dependencies
RUN DEBIAN_FRONTEND=noninteractive apt install -y libmicrohttpd-dev libjansson-dev libssl-dev libsofia-sip-ua-dev libglib2.0-dev libopus-dev libogg-dev libcurl4-openssl-dev liblua5.3-dev libconfig-dev pkg-config libtool automake meson ninja-build

# Install libnice 
ENV LIBNICE_VERSION="0.1.21"
RUN cd /usr/local/src && git clone https://github.com/libnice/libnice.git
RUN cd /usr/local/src/libnice && git checkout tags/$LIBNICE_VERSION
RUN cd /usr/local/src/libnice && meson --prefix=/usr build
RUN cd /usr/local/src/libnice && ninja -C build
RUN cd /usr/local/src/libnice && ninja -C build install

# Install libsrtp
ENV LIBSRTP_VERSION="v2.2.0"
RUN cd /usr/local/src && wget https://github.com/cisco/libsrtp/archive/$LIBSRTP_VERSION.tar.gz
RUN cd /usr/local/src && tar -xzf $LIBSRTP_VERSION.tar.gz
RUN cd /usr/local/src && rm -rf $LIBSRTP_VERSION.tar.gz
RUN cd /usr/local/src && mv libsrtp-* libsrtp
RUN cd /usr/local/src/libsrtp && ./configure --prefix=/usr --enable-openssl
RUN cd /usr/local/src/libsrtp && make shared_library && make install

# Install usrsctp
ENV USRSCTP_VERSION="0.9.5.0"
RUN cd /usr/local/src && git clone https://github.com/sctplab/usrsctp.git
RUN cd /usr/local/src/usrsctp && git checkout tags/$USRSCTP_VERSION
RUN cd /usr/local/src/usrsctp && ./bootstrap 
RUN cd /usr/local/src/usrsctp && ./configure --prefix=/usr --disable-programs --disable-inet --disable-inet6
RUN cd /usr/local/src/usrsctp && make && make install

# Install libwebsockets
ENV LIBWEBSOCKETS_VERSION="v4.3.2"
RUN cd /usr/local/src && git clone https://libwebsockets.org/repo/libwebsockets
RUN cd /usr/local/src/libwebsockets && git checkout tags/$LIBWEBSOCKETS_VERSION
RUN cd /usr/local/src/libwebsockets && mkdir build
RUN cd /usr/local/src/libwebsockets/build && cmake -DLWS_MAX_SMP=1 -DLWS_WITHOUT_EXTENSIONS=0 -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_C_FLAGS="-fpic" ..
RUN cd /usr/local/src/libwebsockets/build && make && make install

# Install Janus Gateway
ENV JANUS_GATEWAY_VERSION="v1.1.3"
RUN cd /usr/local/src && git clone https://github.com/meetecho/janus-gateway.git
RUN cd /usr/local/src/janus-gateway && git checkout tags/$JANUS_GATEWAY_VERSION
RUN cd /usr/local/src/janus-gateway && ./autogen.sh
RUN cd /usr/local/src/janus-gateway && ./configure --prefix=/opt/janus
RUN cd /usr/local/src/janus-gateway && make && make install && make configs
RUN mkdir -p /app/backend/webrtc-server
RUN cd /app/backend/webrtc-server && ln -s /opt/janus/bin .
RUN cd /app/backend/webrtc-server && ln -s /opt/janus/etc/janus configs
RUN rm /app/backend/webrtc-server/configs/janus.plugin.streaming.jcfg
ADD files/janus.plugin.streaming.jcfg /app/backend/webrtc-server/configs/janus.plugin.streaming.jcfg

# Install rtspwebviewer-ffmpeg
RUN cd /opt && git clone https://github.com/luiscarlosgph/rtspwebviewer-ffmpeg.git
RUN /bin/zsh -c "source $HOME/.zshrc && cd /opt/rtspwebviewer-ffmpeg && python3 setup.py install"

# Start services and run the user-specified command
ADD files/entrypoint.sh /opt/entrypoint.sh
RUN chmod +x /opt/entrypoint.sh
ENTRYPOINT ["/opt/entrypoint.sh"]
CMD ["sleep infinity"]
