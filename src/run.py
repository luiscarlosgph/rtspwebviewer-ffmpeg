#!/usr/bin/env python3
"""
@brief  Software to launch a web server that displays one or more RTSP streams.

@author Luis C. Garcia Peraza Herrera (luiscarlos.gph@gmail.com).
@date   4 Dec 2023.
"""

import argparse
import flask
import os


# Initialize a flask object
app = flask.Flask(__name__)


def help(short_option):
    """
    @returns The string with the help information for each command 
             line option.
    """
    help_msg = {
        '-t': 'Web title (required: True)',
        '-a': 'The HTTP server will listen in this address (required: True)',
        '-p': 'The HTTP server will listen in this TCP port (required: True)',
        '-w': 'URL-based password (required: True)',
    }
    return help_msg[short_option]


def parse_cmdline_params():
    """@returns The argparse args object."""

    # Create command line parser
    parser = argparse.ArgumentParser(description='RTSP web server.')
    parser.add_argument('-t', '--title', required=True, type=str,
                        help=help('-t'))
    parser.add_argument('-a', '--address', required=True, type=str, 
                        help=help('-a'))
    parser.add_argument('-p', '--port', required=True, type=int,
                        help=help('-p'))
    parser.add_argument('-w', '--password', required=False, default='', type=str,
                        help=help('-w'))

    # Read parameters
    args = parser.parse_args()
    
    return args

# Get command line arguments
args = parse_cmdline_params()


@app.route('/' + args.password)
def index():
    """@returns the rendered template."""
    global args
    return flask.render_template('index.html', title=args.title)


def main():
    global app, args

    # Create a link to the m3u8 file in the static folder
    #file_path = os.path.realpath(__file__)
    #module_path = os.path.dirname(file_path)
    #static_path = os.path.join(module_path, 'static')
    #if not os.path.isdir(static_path):
    #    os.mkdir(static_path)

    # Start the flask app
    app.run(host=args.address, port=args.port, debug=False, threaded=True, use_reloader=False)


if __name__ == '__main__':
    main()
