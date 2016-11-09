var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    Stream = require('stream').Stream,
    jimp = require('jimp'),
    readChunk = require('read-chunk'); ;
var fileType = require('file-type');
var PDFImage = require("pdf-image").PDFImage;
var mime = require('mime');



module.exports = flow = function(temporaryFolder) {
    var $ = this;
    $.temporaryFolder = temporaryFolder;
    $.maxFileSize = null;
    $.fileParameterName = 'file';

    try {
        fs.mkdirSync($.temporaryFolder);
    } catch (e) {}

    function cleanIdentifier(identifier) {
        return identifier.replace(/[^0-9A-Za-z_-]/g, '');
    }

    function getChunkFilename(chunkNumber, identifier) {
        // Clean up the identifier
        identifier = cleanIdentifier(identifier);
        // What would the file name be?
        return path.resolve($.temporaryFolder, './flow-' + identifier + '.' + chunkNumber);
    }

    function getFilename(identifier) {
         // Clean up the identifier
       // identifier = cleanIdentifier(identifier);
        // What would the file name be?
        return path.resolve($.temporaryFolder, './' + identifier );
    }

    function validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, fileSize) {
        // Clean up the identifier
        identifier = cleanIdentifier(identifier);

        // Check if the request is sane
        if (chunkNumber == 0 || chunkSize == 0 || totalSize == 0 || identifier.length == 0 || filename.length == 0) {
            return 'non_flow_request';
        }
        var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
        if (chunkNumber > numberOfChunks) {
            return 'invalid_flow_request1';
        }

        // Is the file too big?
        if ($.maxFileSize && totalSize > $.maxFileSize) {
            return 'invalid_flow_request2';
        }

        if (typeof(fileSize) != 'undefined') {
            if (chunkNumber < numberOfChunks && fileSize != chunkSize) {
                console.log('CHUNKNUMBER: ' + chunkNumber + '  numberOfChunks: ' + numberOfChunks + ' fileSize: ' + fileSize + ' chunkSize: ' + chunkSize );
                // The chunk in the POST request isn't the correct size
                return 'invalid_flow_request3';
            }
            if (numberOfChunks > 1 && chunkNumber == numberOfChunks && fileSize != ((totalSize % chunkSize) + parseInt(chunkSize))) {
                // The chunks in the POST is the last one, and the fil is not the correct size
                return 'invalid_flow_request4';
            }
            if (numberOfChunks == 1 && fileSize != totalSize) {
                // The file is only a single chunk, and the data size does not fit
                return 'invalid_flow_request5';
            }
        }

        return 'valid';
    }

    //'found', filename, original_filename, identifier
    //'not_found', null, null, null
    $.get = function(req, callback) {
        var chunkNumber = req.param('flowChunkNumber', 0);
        var chunkSize = req.param('flowChunkSize', 0);
        var totalSize = req.param('flowTotalSize', 0);
        var identifier = req.param('flowIdentifier', "");
        var filename = req.param('flowFilename', "");
        
        if (validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename) == 'valid') {
            var chunkFilename = getChunkFilename(chunkNumber, identifier);
            fs.exists(chunkFilename, function(exists) {
                if (exists) {
                    callback('found', chunkFilename, filename, identifier);
                } else {
                    callback('not_found', null, null, null);
                }
            });
        } else {
            callback('not_found', null, null, null);
        }
    };

    //'partly_done', filename, original_filename, identifier
    //'done', filename, original_filename, identifier
    //'invalid_flow_request', null, null, null
    //'non_flow_request', null, null, null
    $.post = function(req, callback) {

        console.log('Request Body: ' + JSON.stringify(req.body));
        var fields = req.body;
        var files = req.files;

        var chunkNumber = fields['flowChunkNumber'];
        var chunkSize = fields['flowChunkSize'];
        var totalSize = fields['flowTotalSize'];
        var identifier = cleanIdentifier(fields['flowIdentifier']);
        var filename = fields['flowFilename'];
        var caption = fields['caption'];

        if(caption) {
            console.log('RECEIVED CAPTION: ' + caption)
        }

        if (!files[$.fileParameterName] || !files[$.fileParameterName].size) {
            callback('invalid_flow_request', null, null, null);
            return;
        }

        var original_filename = files[$.fileParameterName]['originalFilename'];
        var validation = validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, files[$.fileParameterName].size);
        if (validation == 'valid') {
            var chunkFilename = getChunkFilename(chunkNumber, identifier);
            // Save the chunk (TODO: OVERWRITE)
            fs.rename(files[$.fileParameterName].path, chunkFilename, function() {

                // Do we have all the chunks?
                var currentTestChunk = 1;
                var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
                var testChunkExists = function() {
                    fs.exists(getChunkFilename(currentTestChunk, identifier), function(exists) {
                        if (exists) {
                            currentTestChunk++;
                            if (currentTestChunk > numberOfChunks) {
                                callback('done', filename, original_filename, identifier);
                            } else {
                                // Recursion
                                testChunkExists();
                            }
                        } else {
                            callback('partly_done', filename, original_filename, identifier);
                        }
                    });
                };
                testChunkExists();
            });
        } else {
            callback(validation, filename, original_filename, identifier);
        }
    };

    // Pipe chunks directly in to an existsing WritableStream
    //   r.write(identifier, response);
    //   r.write(identifier, response, {end:false});
    //
    //   var stream = fs.createWriteStream(filename);
    //   r.write(identifier, stream);
    //   stream.on('data', function(data){...});
    //   stream.on('finish', function(){...});
    $.write = function(identifier, writableStream, options) {
        options = options || {};
        options.end = (typeof options['end'] == 'undefined' ? true : options['end']);

        // Iterate over each chunk
        var pipeChunk = function(number) {

            var chunkFilename = getChunkFilename(number, identifier);
            fs.exists(chunkFilename, function(exists) {

                if (exists) {
                    // If the chunk with the current number exists,
                    // then create a ReadStream from the file
                    // and pipe it to the specified writableStream.
                    var sourceStream = fs.createReadStream(chunkFilename);
                    sourceStream.pipe(writableStream, {
                        end: false
                    });
                    sourceStream.on('end', function() {
                        // When the chunk is fully streamed,
                        // jump to the next one
                        pipeChunk(number + 1);
                    });
                } else {
                    // When all the chunks have been piped, end the stream
                    if (options.end) writableStream.end();
                    if (options.onDone) options.onDone();
                }
            });
        };
        pipeChunk(1);
    };

    $.writeThumbnail = function(filename, writableStream) {
            filename = path.resolve($.temporaryFolder, filename);
            fs.exists(filename, function(exists) {

                if (exists) {
                    var sourceStream = fs.createReadStream(filename);
                    sourceStream.pipe(writableStream, {
                        end: true
                    });
                    sourceStream.on('end', function() {
                    });
                } else {
                    // When all the chunks have been piped, end the stream
                    writableStream.end();
                }
            });

    };

    $.createThumbnail = function(req) {
        
        var fields = req.body;
        var chunkNumber = fields['flowChunkNumber'];
        var identifier = cleanIdentifier(fields['flowIdentifier']);
        var filename = fields['flowFilename'];
        var ext = filename.split('.').pop();

        identifier = cleanIdentifier(identifier);
        var actualFile = path.resolve($.temporaryFolder, './' + identifier);
        var writableStream = fs.createWriteStream(actualFile);

        var pipeChunk = function(number) {
            var chunkFilename = getChunkFilename(number, identifier);

            fs.exists(chunkFilename, function(exists) {
                if (exists) {
                    // If the chunk with the current number exists,
                    // then create a ReadStream from the file
                    // and pipe it to the specified writableStream.
                    var sourceStream = fs.createReadStream(chunkFilename);
                    sourceStream.pipe(writableStream, {
                        end: false
                    });
                    sourceStream.on('end', function() {
                        // When the chunk is fully streamed,
                        // jump to the next one
                        pipeChunk(number + 1);
                    });
                } else {

                    writableStream.end();

                    console.log('actualFile: ' + actualFile)
                    var buffer = readChunk.sync(actualFile, 0, 1000);
                    var f = fileType(buffer);
                    console.log('mime type ' + f.mime + '   mime ' + mime.lookup(actualFile));
                    if (f) {
                        switch (f.mime.toLowerCase()) {
                            case 'application/pdf': 
                                var pdfImage = new PDFImage(actualFile);
                                pdfImage.convertPage(0).then(function (imagePath) {
                                }, function(err){
                                    console.log(err);
                                });



                            case jimp.MIME_PNG:
                            case jimp.MIME_JPEG:
                            case jimp.MIME_BMP:

                                jimp.read(actualFile, function(err, pic) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    if (!err) {
                                        pic.resize(jimp.AUTO, 250).write(actualFile + '_thumb.' + ext, function(err){
                                            if (err) {
                                                console.log(err); 
                                            }
                                        });
                                    }
                                });
                        }
                     }

                    

                }
            });
        };
        pipeChunk(1);

    };



    $.clean = function(identifier, options) {
        options = options || {};

        // Iterate over each chunk
        var pipeChunkRm = function(number) {

            var chunkFilename = getChunkFilename(number, identifier);

            fs.exists(chunkFilename, function(exists) {
                if (exists) {
                    fs.unlink(chunkFilename, function(err) {
                        if (err && options.onError) options.onError(err);
                    });

                    pipeChunkRm(number + 1);

                } else {

                    if (options.onDone) options.onDone();

                }
            });

        };
        pipeChunkRm(1);

        var filename = getFilename(identifier);
        console.log('delete file' + filename);
        fs.exists(filename, function(exists) {
                if (exists) {
                    console.log('exists ' + filename);

                    fs.unlink(filename, function(err) {
                        if (!err) console.log('deleted ' + filename);
                        else console.log('error ' + filename + ' - ' + err);


                        if (err && options.onError) options.onError(err);
                    });
                }
            }); 

    };

    return $;
};