import Promise from 'bluebird';

export default {
  get(url) {
    return new Promise((resolve, reject) => {
      $.get(url).done(resolve).fail(reject);
    });
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      $.post(url, data).done(resolve).fail(reject);
    });
  },
};
