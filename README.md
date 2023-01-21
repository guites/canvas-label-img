# canvas-label-img

This is supposed to be a simple canvas project with the following features:

1. Drag and drop: user should be able to drag and drop multiple boxes on the screen.
2. Resizing: user should be able to click on a box vertices and increase/reduce its size.
3. Create a new box: user should be able to insert a new box into the canvas.
4. Insert or update label: user should be able to insert a new label into a box, or update an existing one.
5. User should be able to export the final canvas configuration as a .xml or .txt file.

## Running the project

Since the image and label are being `fetch`d, you'll need to run a small http server running the files.

Using node's [npx](https://www.npmjs.com/package/npx) and [http-server](https://www.npmjs.com/package/http-server) you can just  `git clone` the project, `cd` into the directory and run http server.

        git clone git@github.com:guites/canvas-label-img.git
        cd canvas-label-img
        npx http-server .

You can then access it at <http://127.0.0.1:8080>.

## Sources

The drag and drop functionallity is mostly taken from [here](https://www.youtube.com/watch?v=7PYvx8u_9Sk)

The functinallities are from the original [labelImg](https://github.com/heartexlabs/labelImg) project.
