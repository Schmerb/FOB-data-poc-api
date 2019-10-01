/**
 *
 * Aylien News API
 *
 *
 */

const AylienNewsApi = require('aylien-news-api');

const { AYLIEN_API_ID, AYLIEN_API_KEY } = require('config');

const apiInstance = new AylienNewsApi.DefaultApi();

// Configure API key authorization: app_id
const appId = apiInstance.apiClient.authentications.app_id;
appId.apiKey = AYLIEN_API_ID;

// Configure API key authorization: app_key
const appKey = apiInstance.apiClient.authentications.app_key;
appKey.apiKey = AYLIEN_API_KEY;

const coA = 'Hyundai Engineering & Construction';
const coA_Alt = 'Hyundai E&C';
const coA_Loc = ' South Korea';

const coB = 'Tecnicas Reunidas SA';
const coB_Alt = 'Tecnicas Reunidas';

const options = {
  // id: [56],
  // notId: [154211],
  // title: 'startup AND (raise OR raised OR raising OR raises)',
  title: coB,
  // body: 'startup',
  // text: coA,
  language: ['en'],
  notLanguage: ['es', 'it'],
  _return: ['id', 'title'],
  // sortBy: 'published_at',
  // sortDirection: 'desc',
  // cursor: '*',
  perPage: 30,
};

const callback = (error, data, response) => {
  console.log({ error });
  console.log({ data });
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    // eslint-disable-next-line no-console
    console.log({ data });
    // eslint-disable-next-line no-console
    console.log(
      `API called successfully. Returned data: ${JSON.stringify(data)}`,
    );

    for (let story of data.stories) {
      // console.log({ story });
      console.log(JSON.stringify(story), '\n\n');
    }
  }
};

apiInstance.listStories(options, callback);

const searchStoriesText = text =>
  new Promise((resolve, reject) => {
    try {
      const textOpts = {
        // id: [56],
        // notId: [154211],
        // title: 'startup AND (raise OR raised OR raising OR raises)',
        title: text,
        // entitiesTitleText: [text],
        // entitiesTitleType: ['Software', 'Organization'],
        // body: 'startup',
        // text,
        language: ['en'],
        notLanguage: ['es', 'it'],
        _return: ['id', 'title', 'published_at', 'body'],
        // sortBy: 'published_at',
        // sortDirection: 'desc',
        // cursor: '*',
        perPage: 30,
      };

      apiInstance.listStories(textOpts, (error, data, response) => {
        console.log({ error });
        console.log({ data });
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } else {
          // eslint-disable-next-line no-console
          console.log({ data });
          // eslint-disable-next-line no-console
          console.log(
            `API called successfully. Returned data: ${JSON.stringify(data)}`,
          );

          // for (let story of data.stories) {
          //   // console.log({ story });
          //   console.log(JSON.stringify(story), '\n\n');
          // }

          return resolve(data);
        }
      });
    } catch (err) {
      reject(err);
    }
  });

const searchStoriesEntityTitle = text =>
  new Promise((resolve, reject) => {
    try {
      const entityOpts = {
        // id: [56],
        // notId: [154211],
        // title: 'startup AND (raise OR raised OR raising OR raises)',
        // title: text,
        entitiesTitleText: [text],
        // entitiesTitleType: ['Software', 'Organization'],
        // body: 'startup',
        // text,
        language: ['en'],
        notLanguage: ['es', 'it'],
        _return: ['id', 'title', 'published_at', 'body'],
        // sortBy: 'published_at',
        // sortDirection: 'desc',
        // cursor: '*',
        perPage: 30,
      };

      apiInstance.listStories(entityOpts, (error, data, response) => {
        console.log({ error });
        console.log({ data });
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } else {
          // eslint-disable-next-line no-console
          console.log({ data });
          // eslint-disable-next-line no-console
          console.log(
            `API called successfully. Returned data: ${JSON.stringify(data)}`,
          );

          // for (let story of data.stories) {
          //   // console.log({ story });
          //   console.log(JSON.stringify(story), '\n\n');
          // }

          return resolve(data);
        }
      });
    } catch (err) {
      reject(err);
    }
  });

module.exports = {
  searchStoriesText,
  searchStoriesEntityTitle,
};
