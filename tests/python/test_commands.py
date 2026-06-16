import subprocess
from pathlib import Path


def test_posterkit_pdf():
    output = subprocess.check_output('posterkit pdf --url="https://examples.posterkit.net/lqdn-gafam-campaign/poster.html?lang=fr&name=google&variant=color"', shell=True)
    assert output.startswith(b"%PDF"), "No PDF preamble found"


def test_posterkit_thumbnail():
    output = subprocess.check_output('posterkit thumbnail --pdf=https://ptrace.gafam.info/unofficial/pdf/color/lqdn-gafam-poster-fr-color.pdf --format=png', shell=True)
    assert output.startswith(b"\x89\x50\x4e\x47"), "No PNG preamble found"


def test_gafam_info_pdf(tmp_path):

    # Generate individual PDF pages and series documents.
    #subprocess.check_output(f'gafam-info pdf --language=de,fr --name=google,apple,facebook,amazon,microsoft --variant=color {tmp_path}', shell=True)
    subprocess.check_output(f'gafam-info pdf --language=fr --name=google --variant=color {tmp_path}', shell=True)

    # Validate outcome.
    page_contents = list(Path(tmp_path).glob("page/**/*.*"))
    assert len(page_contents) == 3, f"Wrong number of page results: {page_contents}"
    series_contents = list(Path(tmp_path).glob("series/**/*.*"))
    assert len(series_contents) == 4, f"Wrong number of series results: {series_contents}"


def test_gafam_info_mosaic(tmp_path):
    # Generate individual PDF pages.
    subprocess.check_output(f'gafam-info pdf --language=fr --name=google --variant=color {tmp_path}', shell=True)

    # Assemble into mosaic image.
    source_pattern = tmp_path / "*" / "*" / "*.pdf"
    subprocess.check_output(f'gafam-info mosaic --variant=color --source={source_pattern} {tmp_path}', shell=True)

    # Validate outcome.
    mosaic_contents = list(Path(tmp_path).glob("mosaic/*.*"))
    assert len(mosaic_contents) == 1, f"Wrong number of page results: {mosaic_contents}"
