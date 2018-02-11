# ===========
# bumpversion
# ===========

$(eval venvpath     := .venv27)
$(eval bumpversion  := $(venvpath)/bin/bumpversion)

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

upgrade:
	git stash save
	git pull
	git stash pop
	yarn install
	yarn run release


# ========
# preprint
# ========

# Which posters to render to PDF
LANGUAGES = fr en de jp eo ru cmn it pl nb_NO ca

# Render single PDF
pdf-single:
	@echo
	@echo ------------------------
	@echo Rendering poster \"$(lang)\"
	@echo ------------------------
	./htdocs/examples/lqdn-gafam-campaign/makepdf.py $(lang) $(TARGET_DIR) $(VARIANT)

# Render all PDFs
pdf-all:
	$(foreach language,$(LANGUAGES),make pdf-single lang=$(language);)

