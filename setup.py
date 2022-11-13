#!/usr/bin/env python
# -*- coding: utf-8 -*-
import setuptools
import unittest

# Read the contents of the README file
from os import path
this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setuptools.setup(name='rtspwebviewer_ffmpeg',
    version='0.0.1',
    description='Web viewer for RTSP streams that relies on ffmpeg.',
    author='Luis C. Garcia-Peraza Herrera',
    author_email='luiscarlos.gph@gmail.com',
    license='MIT',
    url='https://github.com/luiscarlosgph/rtspwebviewer',
    packages=['rtspwebviewer_ffmpeg'],
    package_dir={'rtspwebviewer_ffmpeg' : 'src'}, 
    install_requires=[
        'argparse',
        'flask',
    ],
    long_description=long_description,
    long_description_content_type='text/markdown',
    include_package_data=True,
    zip_safe=False,
)
