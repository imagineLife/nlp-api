# Loading Data

- [Loading Data](#loading-data)
  - [Background](#background)
    - [This Started As A Side-Project](#this-started-as-a-side-project)
    - [I Didn't Think About Loading Data](#i-didnt-think-about-loading-data)
  - [A Process For Loading Data](#a-process-for-loading-data)
    - [Prepare the Files](#prepare-the-files)
    - [Run A Node Process](#run-a-node-process)

## Background

### This Started As A Side-Project

Curiosity has not led to a complete project. Along the way of putting this together, I've needed "better" ways to tinker: tinker with data, tinker with analysis, tinker with security...

### I Didn't Think About Loading Data

I started "loading data" pretty manually, imo.  
At first [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/) with an insert command. Over and over.  
I then built a little `POST` api that would allow for uploading a piece of data, which required an api, a tad bit of api validation, the mongo-to-node connective tissue.  
The more I wanted to work on data details, the more I felt an inner-gut grunting "ugh".  
I didn't realize that _loading data, in and of itself, can become a world of it's own (which is a little ironic given my recent work experiences)._

## A Process For Loading Data

### Prepare the Files

Prepare a bunch of text files in a directory.  
**Name them with a specific naming scheme**: `MMDDYYYY_FIRST_LAST.txt`

- The date
- The first & last name of the speaker of the speech

### Run A Node Process

[Included in the `lib` directory is a file that will upload the text files through the api](./lib/upload-text-to-api.js) which will...

- reads through the directory & finds the text files
  - NOTE: you may need to adjust the `TEXT_FILE_DIR_PATH` which tells node "where" to look for text files as a relative path in a string
- stores the file names in a local arr & does a process, one-by-one, on the files
  - take the last file from a list
  - read the text, covert to a string (_from a buffer_)
  - convert the name of the file into "metadata": the date and the author's name
  - send the text and the "medatada" to an api
    - **assuming success** (_because i wrote the whole thing so far!_), re-start the process until no more files left
