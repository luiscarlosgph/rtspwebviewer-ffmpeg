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

# Install rtspwebviewer-ffmpeg
RUN /bin/zsh -c "source $HOME/.zshrc && python -m pip install rtspwebviewer_ffmpeg"

# Start services and run the user-specified command
ADD files/entrypoint.sh /opt/entrypoint.sh
RUN chmod +x /opt/entrypoint.sh
ENTRYPOINT ["/opt/entrypoint.sh"]
CMD ["sleep infinity"]
