"""
A setuptools based setup module.

See:
https://packaging.python.org/en/latest/distributing.html
https://github.com/pypa/sampleproject
"""

# Always prefer setuptools over distutils
from setuptools import setup, find_packages
# To use a consistent encoding
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, 'README.rst'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='posterkit',
    version='0.10.0',
    description='PosterKit has been created to support the lovely people of La Quadrature du Net and gafam.info in their endeavours',
    long_description=long_description,
    long_description_content_type='text/x-rst',
    url='https://github.com/posterkit/posterkit-sandbox',
    author='The PosterKit developers',
    author_email='developers@posterkit.org',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: Build Tools',
        'License :: CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
    ],
    keywords='lqdn, gafam, poster, sticker, campaign, information, translation, localization, pdf, conversion',
    packages=find_packages('src/python', exclude=['contrib', 'docs', 'tests']),
    package_dir={'': 'src/python'},
    install_requires=[
        'where==1.0.2',
        'docopt==0.6.2',
        'requests==2.18.4',
    ],
    extras_require={
        'dev': ['check-manifest'],
        'test': ['coverage'],
    },
    entry_points={
        'console_scripts': [
            'posterkit=posterkit.commands:run',
            'gafam-info=gafam.commands:run',
        ],
    },

    project_urls={  # Optional
        'Bug Reports': 'https://github.com/posterkit/posterkit-sandbox/issues',
        'Source': 'https://github.com/posterkit/posterkit-sandbox',
    },
)
