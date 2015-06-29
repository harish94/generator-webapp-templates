'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

var WebappTemplateGenerator = yeoman.generators.Base.extend({
  promptUser: function() {
        var done = this.async(); 
        // have Yeoman greet the user
        console.log(this.yeoman);
 
        var prompts = [{
            name: 'appName',
            message: 'What is your app\'s name ?'
        },{
          type: 'checkbox',
          name: 'features',
          message: 'What more would you like?',
          choices: [{
            name: 'SemanticUI',
            value: 'includeSemantic',
            checked: true
          }, {
            name: 'Bootstrap',
            value: 'includeBootstrap',
            checked: true
          }, {
            name: 'Modernizr',
            value: 'includeModernizr',
            checked: true
          }]
        },{
            type: 'confirm',
            name: 'includeJQuery',
            message: 'Would you like to include jQuery?',
            default: true,
            when: function (answers) {
              return answers.features.indexOf('includeBootstrap') === -1;
            }
          }];
        
      

        this.prompt(prompts, function (answers) {
            this.appName = answers.appName;
            var features = answers.features;

            function hasFeature(feat) {
              return features && features.indexOf(feat) !== -1;
            };

            // manually deal with the response, get back and store the results.
            // we change a bit this way of doing to automatically do this in the self.prompt() method.
            this.includeSass = hasFeature('includeSass');
            this.includeBootstrap = hasFeature('includeBootstrap');
            this.includeModernizr = hasFeature('includeModernizr');
            this.includeJQuery = answers.includeJQuery;

   
            done();
        }.bind(this));

    },

    initializing: function () {
      this.pkg = this.templatePath('_package.json');
      
      // all templates should end with "/"
      this.templateconfig = 'config/';
      this.templatescss = 'assets/css/scss/';
      

      // all in destination - should NOT end with "/"
      this.distpath = 'dist';
      this.appscss = 'app/assets/scss';
      this.appfonts = 'app/assets/fonts';
      this.appimg = 'app/assets/img';
      this.appscripts = 'app/assets/scripts';
      this.appviews = 'app/views';
      
      

    },

    scaffoldFolders: function(){
     
      mkdirp(this.distpath);
      mkdirp(this.appscss);      
      mkdirp(this.appfonts);
      mkdirp(this.appimg);
      mkdirp(this.appscripts);
      mkdirp(this.appviews);
      mkdirp(this.distpath);
    },


    writing: {
      gulpfile: function () {
        this.fs.copyTpl(
          this.templatePath('_gulp.js'),
          this.destinationPath('gulp.js'),
          {
            date: (new Date).toISOString().split('T')[0],
            name: this.appName,
            version: this.pkg.version,
            includeSass: this.includeSass,
            includeBootstrap: this.includeBootstrap
          }
        );
      },
      packageJSON: function () {
        this.fs.copyTpl(
          this.templatePath(this.templateconfig+'_package.json'),
          this.destinationPath('package.json'),
          {
            includeSass: this.includeSass,
            name: this.appName
          }
        );
      },
      git: function () {
        this.fs.copy(this.templatePath(this.templateconfig+'gitignore'),this.destinationPath('.gitignore'));
        this.fs.copy(this.templatePath(this.templateconfig+'gitattributes'),this.destinationPath('.gitattributes'));
      },
      bower: function () {
      var bowerJson = {
        name: _s.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if (this.includeBootstrap) {
        if (this.includeSass) {
          bowerJson.dependencies['bootstrap-sass'] = '~3.3.5';
          bowerJson.overrides = {
            'bootstrap-sass': {
              'main': [
                'assets/stylesheets/_bootstrap.scss',
                'assets/fonts/bootstrap/*',
                'assets/javascripts/bootstrap.js'
              ]
            }
          };
        } else {
          bowerJson.dependencies['bootstrap'] = '~3.3.5';
          bowerJson.overrides = {
            'bootstrap': {
              'main': [
                'less/bootstrap.less',
                'dist/css/bootstrap.css',
                'dist/js/bootstrap.js',
                'dist/fonts/*'
              ]
            }
          };
        }
      } else if (this.includeJQuery) {
        bowerJson.dependencies['jquery'] = '~2.1.1';
      }

      if (this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~2.8.1';
      }

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath(this.templateconfig+'bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    editorConfig: function () {
      this.fs.copy(
        this.templatePath(this.templateconfig+'editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    h5bp: function () {
      this.fs.copy(
        this.templatePath(this.templateconfig+'favicon.ico'),
        this.destinationPath('app/favicon.ico')
      );

      this.fs.copy(
        this.templatePath(this.templateconfig+'apple-touch-icon.png'),
        this.destinationPath('app/apple-touch-icon.png')
      );

      this.fs.copy(
        this.templatePath(this.templateconfig+'robots.txt'),
        this.destinationPath('app/robots.txt'));
    },
    styles: function () {
      var css = 'main.scss';
      this.fs.copyTpl(
        this.templatePath(this.templatescss),
        this.destinationPath( this.appscss),
        {
          //includeBootstrap: this.includeBootstrap
        }
      );
    },

    html: function () {
      var bsPath;
      // path prefix for Bootstrap JS files
      if (this.includeBootstrap) {
        bsPath = '/bower_components/';
        if (this.includeSass) {
          bsPath += 'bootstrap-sass/assets/javascripts/bootstrap/';
        } else {
          bsPath += 'bootstrap/js/';
        }
      }
      this.fs.copyTpl(this.templatePath('views/_index.html'),this.destinationPath('app/views/index.html'),
      {appname: this.appName}
      );
      
    },

  }  
    
});

module.exports = WebappTemplateGenerator;