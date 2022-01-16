# ============
# Introduction
# ============

$(eval venvpath     := .venv)
$(eval pip          := $(venvpath)/bin/pip)
$(eval python       := $(venvpath)/bin/python)
$(eval bumpversion  := $(venvpath)/bin/bump2version)
$(eval gafam-info   := $(venvpath)/bin/gafam-info)

virtualenv:
	@test -e $(python) || python3 -m venv --system-site-packages $(venvpath)
	@$(pip) install --editable=.


# ===========
# Development
# ===========

# Start local webserver
webserver:
	cd htdocs; python3 -m http.server 9999

open-chooser:
	open http://localhost:9999/examples/lqdn-gafam-campaign/chooser.html

watch:
	yarn run watch


# =======
# Release
# =======

push:
	git push && git push --tags

bumpversion: virtualenv
	@$(pip) install bumpversion
	$(bumpversion) $(bump)

release: bumpversion push


# =======
# Upgrade
# =======

# Run `make upgrade` on the production server in order to pull all updates from
# development, retain the changes made on production, and invoke the resource
# bundling in production mode.

upgrade: virtualenv
	git stash save
	git pull
	git stash pop
	yarn install
	yarn run release
	$(python) setup.py develop


# =========
# Rendering
# =========

check-target-dir:
	@if test "$(TARGET_DIR)" = ""; then \
		echo "ERROR: Variable 'TARGET_DIR' not set"; \
		exit 1; \
	fi

# Render single PDF
pdf-single: check-target-dir virtualenv
	@echo
	@echo ---------------------
	@echo Rendering poster \"$(LANGUAGE)\"
	@echo ---------------------
	$(venvpath)/bin/gafam-info pdf --language=$(LANGUAGE) --name=all --variant=$(VARIANT) $(TARGET_DIR)

# Render all PDFs
pdf-all: check-target-dir virtualenv
	$(gafam-info) pdf --language=all --name=all --variant=all $(TARGET_DIR)

# Render mosaic image
mosaic: check-target-dir virtualenv
	$(gafam-info) mosaic --variant=color $(TARGET_DIR)



# ======
# Tweaks
# ======




upload-improved-resources:
	cd var; find ./*/*/*-{bn,he,hu,hr,te,tr,ja,zh}-* -iname '*' -print0 | tar --null --files-from=/dev/stdin -cvf - | ssh www-data@ptrace.gafam.info tar -xvf - -C /srv/www/organizations/gafam/ptrace.gafam.info/htdocs/unofficial; cd -
