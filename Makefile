# ===========
# bumpversion
# ===========

$(eval venvpath     := .venv)
$(eval bumpversion  := $(venvpath)/bin/bumpversion)
$(eval python       := $(venvpath)/bin/python)

virtualenv:
	@test -e $(venvpath)/bin/python || `command -v virtualenv` --python=`command -v python` --no-site-packages $(venvpath)

bumpversion: virtualenv
	@$(venvpath)/bin/pip install bumpversion
	$(bumpversion) $(bump)


# =======
# release
# =======

push:
	git push && git push --tags


release: bumpversion push


# =======
# upgrade
# =======

upgrade: virtualenv
	git stash save
	git pull
	git stash pop
	yarn install
	yarn run release
	$(python) setup.py develop


# ========
# preprint
# ========

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
	$(venvpath)/bin/gafam-info pdf --language=all --name=all --variant=all $(TARGET_DIR)

# Render mosaic image
mosaic: check-target-dir virtualenv
	$(venvpath)/bin/gafam-info mosaic --variant=color $(TARGET_DIR)



# ===============
# local webserver
# ===============
webserver:
	cd htdocs; python -m SimpleHTTPServer 9999

open-chooser:
	open http://localhost:9999/examples/lqdn-gafam-campaign/chooser.html


# ======
# tweaks
# ======
upload-improved-resources:
	# Publish/overwrite Arabic resources as they look more beautiful when rendered on macOS
	cd tmp/out; find ./*/*/*-ar-* -iname '*' -print0 | tar --null --files-from=/dev/stdin -cvf - | ssh www-data@ptrace.gafam.info tar -xvf - -C /srv/www/organizations/gafam/ptrace.gafam.info/htdocs/unofficial; cd -
