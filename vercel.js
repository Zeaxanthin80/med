{
    "version": 2,
    "builds": [
      {
        "src": "index.html",
        "use": "@vercel/static"
      },
      {
        "src": "api/submit.js",
        "use": "@vercel/node"
      }
    ]
  }
  