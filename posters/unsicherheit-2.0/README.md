# PosterKit example: The Unsicherheit 2.0 posters

## Development

```shell
make webserver
make open-chooser
```

## Rendering the posters as PDF documents

The low-level command which will be executed is:

```shell
decktape generic --chrome-arg=--no-sandbox --load-pause 3000 --slides 1 --size 793x1118 'https://examples.posterkit.net/unsicherheit-2.0/poster.html?lang=de&name=federal' unsicherheit-poster-de-federal.pdf
```

:::: note
::: title
Note
:::

793x1118 is supposed to be A4.
::::

However, there are shortcuts for your convenience.

Render a single Unsicherheit 2.0 poster campaign PDF document with parameters
French/Google/Black and store output to filesystem:
```shell
unsicherheit-2.0 pdf --language=fr --name=google --variant=black /srv/www/posterkit
```

Render all the Unsicherheit 2.0 poster campaign PDF documents:
```shell
unsicherheit-2.0 pdf --language=all --name=all --variant=all /srv/www/posterkit
```

There are even more convenient shortcuts as make target wrappers:

```shell
# Define where PDF documents should be stored
export TARGET_DIR=/srv/www/organizations/unsicherheit-2.0/htdocs

# Render all variants of French posters
make pdf-single LANGUAGE=fr VARIANT=all

# Render all variants for all languages
make pdf-all
```

## Publishing the posters

### HTML

```shell
ssh www-data@examples.posterkit.net
cd /srv/www/organizations/posterkit/sources/posterkit-sandbox

make upgrade
```

### PDF

```shell
ssh www-data@examples.posterkit.net
cd /srv/www/organizations/posterkit/sources/posterkit-sandbox

# Bring everything up to speed
make upgrade

# Activate Python virtual environment
source .venv/bin/activate

# Define where PDF documents should be stored
export TARGET_DIR=/srv/www/organizations/unsicherheit-2.0/htdocs

# Render all posters (full matrix of permutations)
unsicherheit-2.0 pdf --language=all --name=all --variant=all $TARGET_DIR

# Render posters for selected language only
unsicherheit-2.0 pdf --language=de --name=all --variant=all $TARGET_DIR
```

## Render and publish posters with non-latin glyphs

Render, publish and overwrite resources with improved glyphs. They look
more beautiful when rendered on macOS:

```shell
make build-improved-resources
make upload-improved-resources
```
