var gobble = require('gobble'),
    gulp   = require('gulp'),
    mkdirp = require('mkdirp'),
    mocha  = require('gulp-mocha-phantomjs');

// Disable: modules, classes, unicodeRegex, forOf
var babelOpts = {
  plugins: [
    'transform-undefined-to-void',
    'transform-es2015-arrow-functions',
    'transform-es2015-block-scoping',
    'transform-es2015-block-scoped-functions',
    'transform-es2015-constants',
    'transform-es2015-destructuring',
    'transform-es2015-parameters',
    'transform-es2015-spread',
    'transform-es2015-template-literals',
    'transform-es2015-computed-properties',
    'transform-es2015-shorthand-properties'
  ]
};

var es5 = gobble('src/aent.js').transform('babel', babelOpts);

gulp.task('build:umd', function(done) {
  mkdirp.sync('build/umd');

  var umd = es5.transform('rollup', {
    format: 'umd',
    entry: 'aent.js',
    moduleName: 'net'
  });

  var umdMin = umd.transform('uglifyjs', { ext: '.min.js' });
  gobble([umdMin, umd]).build({ dest: 'build/umd', force: true }).then(done);
});

gulp.task('build:amd', function(done) {
  mkdirp.sync('build/amd');

  var amd = es5.transform('rollup', {
    format: 'amd',
    entry: 'aent.js'
  });

  var amdMin = amd.transform('uglifyjs', { ext: '.min.js' });
  gobble([amdMin, amd]).build({ dest: 'build/amd', force: true }).then(done);
});

gulp.task('build', ['build:amd', 'build:umd']);

// TODO - investigate how to switch from esperanto to rollup
gulp.task('test', function(done) {
  gobble('test').transform('esperanto-bundle', {
    strict: false,
    type: 'concat',
    entry: 'specs.js'
  }).transform('babel', babelOpts)
    .build({ dest: 'tmp', force: true })
    .then(function() {
      gulp.src('test/test.html')
          .pipe(mocha({ reporter: 'dot' }));
    })
    .then(done)
    .catch(done);
});
