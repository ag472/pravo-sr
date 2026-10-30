/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "402b66900e731ca748771b6fc5e7a068"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "7aed95ac41da7c9449f36d53c8871017"
  }, {
    "url": "pwa-512x512.png",
    "revision": "7aed95ac41da7c9449f36d53c8871017"
  }, {
    "url": "pwa-192x192.png",
    "revision": "e134b2c1602dd7a5ab6bcc5033c79f13"
  }, {
    "url": "index.html",
    "revision": "7b7a07bc586b52f2fb10bacf1c0e909c"
  }, {
    "url": "icon.svg",
    "revision": "733e1c599f7d15aae0df475c99cde7ab"
  }, {
    "url": "favicon.ico",
    "revision": "75e360df94c797229db4c5a58c8d35fb"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "ec68e9960448127a9bea7ffcb1cb541a"
  }, {
    "url": "404.html",
    "revision": "18687d9bfe9e4f1c02dc68e015d75576"
  }, {
    "url": "assets/index-BveWnkh4.css",
    "revision": null
  }, {
    "url": "assets/index-BT_594n_.js",
    "revision": null
  }, {
    "url": ".nojekyll",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  }, {
    "url": "404.html",
    "revision": "18687d9bfe9e4f1c02dc68e015d75576"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "ec68e9960448127a9bea7ffcb1cb541a"
  }, {
    "url": "favicon.ico",
    "revision": "75e360df94c797229db4c5a58c8d35fb"
  }, {
    "url": "icon.svg",
    "revision": "733e1c599f7d15aae0df475c99cde7ab"
  }, {
    "url": "pwa-192x192.png",
    "revision": "e134b2c1602dd7a5ab6bcc5033c79f13"
  }, {
    "url": "pwa-512x512.png",
    "revision": "7aed95ac41da7c9449f36d53c8871017"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "7aed95ac41da7c9449f36d53c8871017"
  }, {
    "url": "manifest.webmanifest",
    "revision": "1713dc703e177df176a5b6a1aa1267ed"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
