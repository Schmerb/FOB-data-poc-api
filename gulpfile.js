/* eslint-disable */
const gulp = require('gulp');
const bump = require('gulp-bump');
const octo = require('@octopusdeploy/gulp-octo');
const currentdatestring = new Date().toISOString().replace(/[-:ZT\.]/g,'');

gulp.task('bump', function(){
	return gulp.src('./package.json')
		.pipe(bump({type: 'prerelease', preid: process.env.BUILD_SOURCEBRANCHNAME + '-' + currentdatestring }))
		.pipe(gulp.dest('./'));
});

gulp.task('publish', ['bump'], function () {
	return gulp.src(['**'], {dot:true})
		.pipe(octo.pack('zip'))
		.pipe(octo.push({apiKey: process.argv[6], host: process.argv[8]}));
});
