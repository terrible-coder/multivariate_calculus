Getting started
===============

## Using with Node

### 1. Installing Nodejs
If you want to work on your computer locally, outside the browser,
you will need to download a JavaScript runtime like [Node.js](nodejs.org).
It is as easy as following the installation guides on the webpage.
If it has been installed successfully you can move on to the next step.

### 2. Creating project directory
When working on a project it is nice to have all the parts of your project
live in one folder separately on your computer.
To create our project directory we type the following in your terminal app:

	mkdir project_name
Now to work with our project, let us navigate inside the folder we just created:

	cd project_name

### 3. Initialising package
To be able to work with this library we need to first declare our directory as
a Node project.

	npm init
The `npm` command becomes available globally when we install nodejs.
The `npm init` command will run us through a very simple command-line wizard
which creates a `package.json` file under our project folder. This declares our
project as a node package.

### 4. Installing the library
Now we are ready to install `multivariate_calculus` inside our project folder.

	npm install multivariate_calculus
This command will create a node_modules folder which will have all our installed
packages from npm. To verify that the library has been installed we can go under
the node_modules folder and check if there is a folder named as multivariate_calculus.

---------------------

## Using in browser

### 1. Creating index.html
To work in the browser, the first thing one needs is an HTML file named index.html.
This is the file which one would first see if your project were hosted on some
server online.

### 2. Downloading
To be able to use this library in the browser is quite simple. The browser
version of this library is available [here](https://github.com/terrible-coder/multivariate_calculus/releases).

### 3. Including JavaScript source
Once the library has been downloaded, make sure you have a copy of it inside your
project directory. Now, we may refer to the source file for the library we just downloaded.

```html
<script src="mcalc.js"></script>
```
It is common practice to include the script tags in the header file so that all
the code is loaded before the page begins to load. However, for very large files
it is better to put their references at the end of the `body` tag. That way the
page loads quicker and there is at least something for the person to see on screen.

---------------------
Once all these have been done, you are now ready to work with `multivariate_calculus`
on your awesome project.

---------------------


Created using [docsify](https://docsify.js.org/#).