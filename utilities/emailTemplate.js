//
//
//   Application level email template with styles
//
//

const emailTemplate = (markup) => {
  return `
          <!DOCTYPE html>
  <html lang="en">
  <head>
  <style>
  *,
  *::before,
  *::after {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
  }
  </style>
      <style>
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrLDz8Z1xlFd2JQEk.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      </style>
      <style>
      body {
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          line-height: 1.5;
      
      }
      header {
          display: flex;
          padding: 2rem 0;
          margin-bottom: 2rem;
      }
      h1 {
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-size: 1.7em;
          margin-bottom: 1rem;
          letter-spacing: 1px;
      }
      p {
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-size: 1.2em;
          letter-spacing: 0.5px;
      }
      a {
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          color: inherit;
      }
      </style>
      </head>
      <body>
      <header><a href="https://climatemonitor.info"><img src="https://climatemonitor.info/logoemail.svg" alt="Climate Monitor" height="50px"></a></header>
      <main>
        ${markup}
      </main>
  </body>
  </html>
          `
}

module.exports = emailTemplate
