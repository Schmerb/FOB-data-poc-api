/**
 * API Generator
 *
 *
 */

const path = require('path');
const fileExists = require('../../utils/fileExists');

module.exports = {
  description: 'Add an API (model|router|controller)',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'CustomAPI',
      validate: value => {
        if (/.+/.test(value)) {
          return fileExists(value)
            ? 'A file with this name already exists.'
            : true;
        }

        return 'The name is required';
      },
    },
    // {
    //   type: 'input',
    //   name: 'tableName',
    //   message: 'What should the table be called?',
    //   default: 'CustomAPIs',
    // },
  ],
  actions: data => {
    //
    // Add router to app init function and prettify
    //
    const actions = [
      {
        type: 'modify',
        path: path.resolve(__dirname, '../../../src/api/index.js'),
        pattern: '//*__imports',
        templateFile: './api/routerImport.hbs',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: path.resolve(__dirname, '../../../src/api/index.js'),
        pattern: '//*__init',
        templateFile: './api/routerInit.hbs',
        abortOnFail: true,
      },
      {
        type: 'prettify',
        path: path.resolve(__dirname, '../../../src/api/index.js'),
        templateFile: './api/routerImport.hbs',
        abortOnFail: true,
      },
    ];

    //
    // Add Model, Router, Controller, and Tests
    //
    actions.push({
      type: 'pretty-add',
      path: path.resolve(
        __dirname,
        '../../../src/models/{{ camelCase name }}.js',
      ),
      templateFile: './api/model.hbs',
    });
    actions.push({
      type: 'pretty-add',
      path: path.resolve(
        __dirname,
        '../../../src/api/{{ camelCase name }}/controller.js',
      ),
      templateFile: './api/controller.hbs',
    });
    actions.push({
      type: 'pretty-add',
      path: path.resolve(
        __dirname,
        '../../../src/api/{{ camelCase name }}/index.js',
      ),
      templateFile: './api/router.hbs',
    });

    return actions;
  },
};
