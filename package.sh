#!/bin/bash -e

version=$(grep '"version"' manifest.json | cut -d: -f2 | cut -d\" -f2)

# Setup environment for building inside Dockerized toolchain
[ $(id -u) = 0 ] && umask 0

# Clean up from previous releases
rm -rf *.tgz *.sha256sum package SHA256SUMS lib

if [ -z "${ADDON_ARCH}" ]; then
  TARFILE_SUFFIX=
else
  PYTHON_VERSION="$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d. -f 1-2)"
  TARFILE_SUFFIX="-${ADDON_ARCH}-v${PYTHON_VERSION}"
fi

mkdir -p lib package

# Pull down Python dependencies
pip3 install -r requirements.txt -t lib --no-binary :all: --prefix ""

cp *.py manifest.json LICENSE README.md package/
cp -r pkg lib css images js views package/
find package -type f -name '*.pyc' -delete
find package -type f -name '._*' -delete

echo "generating checksums"
cd package
find . -type f \! -name SHA256SUMS -exec shasum --algorithm 256 {} \; >> SHA256SUMS
cd -



# Make the tarball
echo "creating archive"
#TARFILE="photo-frame-${version}.tgz"
TARFILE="floorplanner-${version}${TARFILE_SUFFIX}.tgz"
tar czf ${TARFILE} package

shasum --algorithm 256 ${TARFILE} > ${TARFILE}.sha256sum
cat ${TARFILE}.sha256sum
